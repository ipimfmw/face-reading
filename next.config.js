/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // SSG를 위한 설정
  images: {
    unoptimized: true, // S3에 배포할 때 필요한 설정
    domains: ['your-s3-bucket.s3.amazonaws.com'], // S3 도메인 설정
  },
  // 빌드 시 정적 페이지 생성
  trailingSlash: true, // URL 끝에 슬래시를 추가하여 정적 호스팅 시 문제 방지
}

module.exports = nextConfig 