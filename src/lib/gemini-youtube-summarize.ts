import axios from 'axios';
import { GoogleGenAI } from "@google/genai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

// Gemini API 호출을 위한 타입 정의
interface GeminiSummaryResponse {
  summary: string;
}

/**
 * 유튜브 URL에서 videoId 추출
 */
const extractVideoId = (url: string): string | null => {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
};

/**
 * 유튜브 자막(Transcript) 추출
 * 서버 프록시(/api/youtube-transcript) 호출 방식
 */
const fetchYoutubeTranscript = async (videoId: string): Promise<string> => {
  try {
    const { data } = await axios.get(`/api/youtube-transcript?videoId=${videoId}`);
    if (!data || !data.transcript) {
      throw new Error('자막을 찾을 수 없습니다.');
    }
    return data.transcript;
  } catch (error) {
    throw new Error('유튜브 자막을 불러오지 못했습니다.');
  }
};

/**
 * Gemini API를 통해 자막 요약 (GoogleGenAI 사용)
 */
const fetchGeminiSummary = async (transcript: string): Promise<string> => {
  try {
    const prompt = 
    `다음은 유튜브 영상의 전체 자막입니다. 이 내용을 기반으로 영상을 보지않고도 영상 내용을 이해할 수 있도록 정리해주세요. 너무 짧게 요약하지 말고 디테일도 이해할 수 있게 구성해주세요.\n
     markdown양식을 사용하지 않고, plain text를 이용해서 대답해주세요.\n\n
    ${transcript}`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ text: prompt }],
    });
    return response.text || '요약 결과를 불러올 수 없습니다.';
  } catch (error) {
    console.error("Gemini Youtube Summarize API Error:", error);
    throw new Error('Gemini 요약 요청에 실패했습니다.');
  }
};

/**
 * 유튜브 영상 요약 메인 함수
 */
export const summarizeYoutubeVideo = async (youtubeUrl: string): Promise<string> => {
  // 1. videoId 추출
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) throw new Error('유효하지 않은 유튜브 링크입니다.');
  // 2. 자막 추출
  const transcript = await fetchYoutubeTranscript(videoId);
  // 3. Gemini 요약
  const summary = await fetchGeminiSummary(transcript);
  return summary;
}; 