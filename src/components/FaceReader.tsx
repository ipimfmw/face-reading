"use client";

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from "react";
import { getFaceReadingResponse } from "@/lib/gemini-face-reader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const FaceReader = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>("");
  const [userPrompt, setUserPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const prevImageUrlRef = useRef<string>("");

  // 이미지 파일을 base64로 변환
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    // objectURL 생성 및 이전 objectURL revoke
    if (prevImageUrlRef.current) {
      URL.revokeObjectURL(prevImageUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
    prevImageUrlRef.current = objectUrl;
    // base64 변환
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64((reader.result as string).split(",")[1] || "");
    };
    reader.readAsDataURL(file);
  };

  // 관상 분석 요청
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!imageBase64) return;
    setIsLoading(true);
    setResult("");
    try {
      const res = await getFaceReadingResponse({
        imageBase64,
        mimeType: image?.type || "image/jpeg",
        userPrompt,
      });
      setResult(res);
    } catch (err) {
      setResult("분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 unmount 시 objectURL 정리
  useEffect(() => {
    return () => {
      if (prevImageUrlRef.current) {
        URL.revokeObjectURL(prevImageUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-6 h-full w-full">
      <Card className="w-full max-w-md p-6 flex flex-col gap-4">
        {/* 이미지 미리보기 영역 */}
        {imagePreviewUrl && (
          <div className="flex justify-center mb-2">
            <img
              src={imagePreviewUrl}
              alt="업로드한 얼굴 미리보기"
              aria-label="업로드한 얼굴 미리보기"
              tabIndex={0}
              className="w-40 h-40 object-cover rounded-full border-2 border-primary shadow-md"
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="font-semibold">얼굴 사진 업로드</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
            aria-label="얼굴 사진 업로드"
          />
          <Textarea
            value={userPrompt}
            onChange={e => setUserPrompt(e.target.value)}
            placeholder="추가로 궁금한 점이나 요청을 입력하세요 (선택)"
            className="resize-none"
            aria-label="추가 요청 입력"
          />
          <Button type="submit" disabled={!imageBase64 || isLoading} className="w-full">
            {isLoading ? "분석 중..." : "관상 보기"}
          </Button>
        </form>
        {result && (
          <div className="mt-4 whitespace-pre-line text-base text-center">
            {result}
          </div>
        )}
      </Card>
    </div>
  );
};

export default FaceReader; 