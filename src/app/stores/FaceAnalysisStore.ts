import { makeAutoObservable } from 'mobx';
import type { FaceAnalysis, ImageUploadResponse } from '../types/face';

export class FaceAnalysisStore {
  imageFile: File | null = null;
  uploadedImage: ImageUploadResponse | null = null;
  analysis: FaceAnalysis | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setImageFile = (file: File | null) => {
    this.imageFile = file;
    this.error = null;
  };

  setUploadedImage = (response: ImageUploadResponse | null) => {
    this.uploadedImage = response;
  };

  setAnalysis = (analysis: FaceAnalysis | null) => {
    this.analysis = analysis;
  };

  setLoading = (loading: boolean) => {
    this.isLoading = loading;
  };

  setError = (error: string | null) => {
    this.error = error;
  };

  reset = () => {
    this.imageFile = null;
    this.uploadedImage = null;
    this.analysis = null;
    this.isLoading = false;
    this.error = null;
  };
}

export const faceAnalysisStore = new FaceAnalysisStore(); 