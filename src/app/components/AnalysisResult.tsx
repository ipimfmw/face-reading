'use client';

import { observer } from 'mobx-react-lite';
import { faceAnalysisStore } from '../stores/FaceAnalysisStore';

const AnalysisResult = () => {
  const { analysis } = faceAnalysisStore;

  if (!analysis) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">관상 분석 결과</h2>
      
      {/* 얼굴 특징 분석 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">얼굴 특징 분석</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">이마</p>
            <p className="text-gray-600">{analysis.features.forehead}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">눈</p>
            <p className="text-gray-600">{analysis.features.eyes}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">코</p>
            <p className="text-gray-600">{analysis.features.nose}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">입</p>
            <p className="text-gray-600">{analysis.features.mouth}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">턱</p>
            <p className="text-gray-600">{analysis.features.chin}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-700">얼굴형</p>
            <p className="text-gray-600">{analysis.features.faceShape}</p>
          </div>
        </div>
      </div>

      {/* 종합 분석 */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">성격</h3>
          <p className="text-gray-600">{analysis.personality}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">운명</h3>
          <p className="text-gray-600">{analysis.fortune}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">재물운</h3>
          <p className="text-gray-600">{analysis.wealth}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">애정운</h3>
          <p className="text-gray-600">{analysis.love}</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-gray-700">종합 분석</h3>
          <p className="text-gray-600">{analysis.overallAnalysis}</p>
        </div>
      </div>

      {/* 공유 버튼 */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => {
            // 공유 기능 구현
            const shareText = `내 관상 분석 결과\n${analysis.overallAnalysis}`;
            if (navigator.share) {
              navigator.share({
                title: '관상 분석 결과',
                text: shareText,
                url: window.location.href,
              });
            } else {
              // 클립보드에 복사
              navigator.clipboard.writeText(shareText);
              alert('분석 결과가 클립보드에 복사되었습니다.');
            }
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="분석 결과 공유하기"
        >
          결과 공유하기
        </button>
      </div>
    </div>
  );
};

export default observer(AnalysisResult); 