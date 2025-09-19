import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 중 ESLint 에러를 무시 (경고는 그대로 출력)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 타입체크 에러가 있어도 빌드 진행
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
