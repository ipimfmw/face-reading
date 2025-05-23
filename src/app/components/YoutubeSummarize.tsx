"use client";
import { useState } from 'react';
import { summarizeYoutubeVideo } from '@/lib/gemini-youtube-summarize';
import { Button } from "@/components/ui/button";

const YoutubeSummarize = () => {
  // 상태 관리: 입력값, 요약 결과, 로딩, 에러
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 요약 버튼 클릭 핸들러
  const handleSummarize = async () => {
    setSummary('');
    setError('');
    if (!url) {
      setError('유튜브 링크를 입력해 주세요.');
      return;
    }
    setLoading(true);
    try {
      const result = await summarizeYoutubeVideo(url);
      setSummary(result);
    } catch (err: any) {
      setError(err.message || '요약 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 엔터키로도 요약 가능하게
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSummarize();
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-bold mb-2">유튜브 영상 요약</h2>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="유튜브 영상 링크를 입력하세요"
          aria-label="유튜브 영상 링크 입력"
          className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          tabIndex={0}
        />
        <Button
          onClick={handleSummarize}
          disabled={loading || !url}
          aria-label="요약하기"
        >
          {loading ? '요약 중...' : '요약하기'}
        </Button>
      </div>
      {error && (
        <div className="text-red-500" role="alert">{error}</div>
      )}
      {summary && (
        <div className="bg-gray-50 p-4 rounded border text-gray-800 whitespace-pre-line" aria-live="polite">
          {summary}
        </div>
      )}
    </div>
  );
};

export default YoutubeSummarize; 