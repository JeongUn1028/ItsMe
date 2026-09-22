import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  //* dev 서버와 `next build` 가 같은 .next 를 공유하면 서로의 산출물을 덮어써 dev 서버가 깨집니다.
  //* (e2e/캡처용 dev 서버는 NEXT_DIST_DIR=.next-dev 로 분리해서 띄웁니다)
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  pageExtensions: ["js", "jsx", "md", "ts", "tsx"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
