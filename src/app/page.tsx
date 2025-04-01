'use client';

import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import { faceAnalysisStore } from './stores/FaceAnalysisStore';
import { analyzeFace } from './services/apiService';

const queryClient = new QueryClient();

const Home = () => {
  useEffect(() => {
    const processAnalysis = async () => {
      if (faceAnalysisStore.uploadedImage && !faceAnalysisStore.analysis) {
        try {
          faceAnalysisStore.setLoading(true);
          const result = await analyzeFace({
            imageUrl: faceAnalysisStore.uploadedImage.url,
          });
          faceAnalysisStore.setAnalysis(result.analysis);
        } catch (error) {
          faceAnalysisStore.setError((error as Error).message);
        } finally {
          faceAnalysisStore.setLoading(false);
        }
      }
    };

    processAnalysis();
  }, [faceAnalysisStore.uploadedImage]);

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI 관상 분석</h1>
            <p className="text-lg text-gray-600">
              당신의 얼굴 사진을 업로드하면 AI가 관상을 분석해드립니다.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <ImageUploader />
          </div>

          {faceAnalysisStore.analysis && <AnalysisResult />}

          <div className="text-center mt-8 text-sm text-gray-500">
            <p>* 이 서비스는 재미를 위한 것이며, 실제 운세나 성격 판단과는 관련이 없습니다.</p>
          </div>
        </div>
      </main>
    </QueryClientProvider>
  );
};

export default observer(Home);
