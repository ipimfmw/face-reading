import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { ImageUploadResponse } from '../types/face';

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || '',
  },
});

export const uploadToS3 = async (file: File): Promise<ImageUploadResponse> => {
  try {
    const fileKey = `uploads/${Date.now()}-${file.name}`;
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET || '',
      Key: fileKey,
      ContentType: file.type,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // 파일 업로드
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('이미지 업로드에 실패했습니다.');
    }

    // CloudFront URL 생성
    const cloudFrontUrl = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileKey}`;

    return {
      url: cloudFrontUrl,
      key: fileKey,
    };
  } catch (error) {
    console.error('S3 업로드 중 오류 발생:', error);
    throw new Error('이미지 업로드에 실패했습니다.');
  }
}; 