export interface FaceFeatures {
  forehead: string;  // 이마
  eyes: string;      // 눈
  nose: string;      // 코
  mouth: string;     // 입
  chin: string;      // 턱
  faceShape: string; // 얼굴형
}

export interface FaceAnalysis {
  features: FaceFeatures;
  personality: string;    // 성격
  fortune: string;       // 운명
  wealth: string;        // 재물운
  love: string;          // 애정운
  overallAnalysis: string; // 종합 분석
}

export interface ImageUploadResponse {
  url: string;
  key: string;
}

export interface AnalysisRequest {
  imageUrl: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: FaceAnalysis;
  error?: string;
} 