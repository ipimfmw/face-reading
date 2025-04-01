import axios from 'axios';
import type { AnalysisRequest, AnalysisResponse } from '../types/face';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.face-reading.com';

export const analyzeFace = async (request: AnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const response = await axios.post<AnalysisResponse>(
      `${API_URL}/analyze`,
      request
    );
    return response.data;
  } catch (error) {
    console.error('얼굴 분석 중 오류 발생:', error);
    throw new Error('얼굴 분석에 실패했습니다.');
  }
}; 