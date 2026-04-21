import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js 16: 로컬 src에 쿼리스트링이 있으면 localPatterns에 명시해야 함
    // https://nextjs.org/docs/messages/next-image-unconfigured-localpatterns
    localPatterns: [
      {
        pathname: "/api/naver-map-preview",
        // search 생략 → lat/lon/w/h 등 임의 쿼리 허용
      },
    ],
  },
};

export default nextConfig;
