import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.NETLIFY ? undefined : 'standalone',
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.api-sports.io',
        pathname: '**/*',
      },
      {
        // 선수 사진 실 응답 호스트(D-9, ST-006b). r2.dev는 Cloudflare R2 공개 버킷이 임의 발급받는
        // 공용 도메인이라 **.r2.dev로 와일드카드하면 다른 사람의 R2 버킷 이미지까지 우리 이미지
        // 최적화 프록시를 태울 수 있다(보안 표면 확대) — 실측으로 확정한 호스트 하나만 정확히 허용한다.
        protocol: 'https',
        hostname: 'pub-8dfe7ca8163c400aac6a83640c67edb4.r2.dev',
        pathname: '**/*',
      },
    ],
  },
};

export default nextConfig;
