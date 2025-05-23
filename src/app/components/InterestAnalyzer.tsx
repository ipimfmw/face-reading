"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getInterestAnalysis } from "@/lib/gemini-interest-analyzer";

const InterestAnalyzer = () => {
  const [txtContent, setTxtContent] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState<string>("");

  // txt 파일 업로드 및 내용 읽기
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTxtContent(reader.result as string);
    };
    reader.readAsText(file, "utf-8");
  };

  // 분석 요청
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!txtContent.trim()) return;
    setIsLoading(true);
    setResult("");
    try {
      const res = await getInterestAnalysis(txtContent, input);
      setResult(res);
    } catch (err) {
      setResult("분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 h-full w-full">
      <Card className="w-full max-w-md p-6 flex flex-col gap-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold">카카오톡 대화 txt 파일 업로드</label>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="내가 누구인지 입력, 추가 분석원하는 요청사항 입력" />
          <input
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            aria-label="카카오톡 대화 txt 파일 업로드"
          />
          {txtContent && <p>대화내용 로드 완료!</p>}
          <Button type="submit" disabled={!txtContent.trim() || isLoading} className="w-full">
            {isLoading ? "분석 중..." : "분석하기"}
          </Button>
        </form>
        {result && (
          <div className="mt-4 whitespace-pre-line text-base text-left">
            {result}
          </div>
        )}
      </Card>
    </div>
  );
};

export default InterestAnalyzer;
