import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get('videoId');

  if (!videoId) {
    return NextResponse.json(
      { error: 'videoId is required' },
      { status: 400 }
    );
  }

  try {
    // YouTube watch 페이지에서 자막 정보 추출
    const response = await axios.get(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const html = response.data;
    
    // 자막 데이터 추출 시도
    const captionsMatch = html.match(/"captions":\s*({[\s\S]*?})\s*,\s*"videoDetails"/);
    if (!captionsMatch) {
      console.error('No captions data found in HTML');
      return NextResponse.json(
        { error: 'No captions found' },
        { status: 404 }
      );
    }

    let captionsJson;
    try {
      captionsJson = JSON.parse(captionsMatch[1]);
    } catch (e) {
      console.error('Failed to parse captions JSON:', e);
      return NextResponse.json(
        { error: 'Failed to parse captions data' },
        { status: 500 }
      );
    }

    const tracks = captionsJson.playerCaptionsTracklistRenderer?.captionTracks;
    if (!tracks || tracks.length === 0) {
      console.error('No caption tracks found');
      return NextResponse.json(
        { error: 'No caption tracks available' },
        { status: 404 }
      );
    }

    // 첫 번째 자막 트랙의 URL로 자막 XML 받아오기
    const trackUrl = tracks[0].baseUrl;
    if (!trackUrl) {
      console.error('No track URL found');
      return NextResponse.json(
        { error: 'No track URL available' },
        { status: 404 }
      );
    }

    const xmlRes = await axios.get(trackUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const xml = xmlRes.data;
    
    // XML에서 텍스트만 추출 (간단 파싱)
    const textRegex = /<text[^>]*>(.*?)<\/text>/g;
    const matches = xml.matchAll(textRegex);
    const texts: string[] = [];
    
    for (const m of matches as IterableIterator<RegExpMatchArray>) {
      if (m[1]) {
        texts.push(
          m[1]
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
        );
      }
    }

    if (texts.length === 0) {
      console.error('No text content found in XML');
      return NextResponse.json(
        { error: 'No text content found in captions' },
        { status: 404 }
      );
    }

    const transcript = texts.join(' ');
    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript' },
      { status: 500 }
    );
  }
}