'use client';

import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { faceAnalysisStore } from '../stores/FaceAnalysisStore';
import { compressImage, validateImage } from '../utils/imageUtils';
import { uploadToS3 } from '../services/s3Service';

const ImageUploader = () => {
  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      validateImage(file);
      faceAnalysisStore.setLoading(true);
      faceAnalysisStore.setImageFile(file);

      // 이미지 압축
      const compressedFile = await compressImage(file);
      
      // S3 업로드
      const uploadResponse = await uploadToS3(compressedFile);
      faceAnalysisStore.setUploadedImage(uploadResponse);
    } catch (error) {
      faceAnalysisStore.setError((error as Error).message);
    } finally {
      faceAnalysisStore.setLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <label 
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        role="button"
        tabIndex={0}
        aria-label="이미지 업로드"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">클릭하여 업로드</span> 또는 드래그 앤 드롭
          </p>
          <p className="text-xs text-gray-500">PNG, JPG (최대 10MB)</p>
        </div>
        <input
          id="image-upload"
          type="file"
          className="hidden"
          accept="image/jpeg,image/png"
          onChange={handleFileChange}
          aria-label="이미지 파일 선택"
        />
      </label>
      {faceAnalysisStore.error && (
        <p className="mt-2 text-sm text-red-600">{faceAnalysisStore.error}</p>
      )}
      {faceAnalysisStore.isLoading && (
        <p className="mt-2 text-sm text-blue-600">이미지를 처리중입니다...</p>
      )}
    </div>
  );
};

export default observer(ImageUploader); 