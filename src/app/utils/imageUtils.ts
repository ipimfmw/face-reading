import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 768,
    useWebWorker: true,
    fileType: 'image/jpeg',
    initialQuality: 0.8,
  };

  try {
    return await imageCompression(file, options);
  } catch (error) {
    console.error('이미지 압축 중 오류 발생:', error);
    throw new Error('이미지 압축에 실패했습니다.');
  }
};

export const validateImage = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error('JPG 또는 PNG 형식의 이미지만 업로드 가능합니다.');
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('10MB 이하의 이미지만 업로드 가능합니다.');
  }

  return true;
}; 