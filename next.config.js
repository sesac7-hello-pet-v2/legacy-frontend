/** @type {import('next').NextConfig} */
const nextConfig = {
  // ESLint 에러로 인한 빌드 실패 방지
  eslint: {
    ignoreDuringBuilds: true,
  },

  // TypeScript 에러로 인한 빌드 실패 방지
  typescript: {
    ignoreBuildErrors: true,
  },

  // 개발/빌드 성능 향상
  experimental: {
    // 병렬 빌드 활성화
    cpus: Math.max(1, require('os').cpus().length - 1),

    // 메모리 사용량 최적화
    workerThreads: false,
  },

  // 프로덕션 빌드 최적화
  ...(process.env.NODE_ENV === 'production' && {
    // 소스맵 비활성화 (속도 향상)
    productionBrowserSourceMaps: false,

    // 런타임 청크 최적화
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // 클라이언트 번들 최적화
        config.optimization.splitChunks = {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // 프레임워크 코드 분리
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // 라이브러리 코드 분리
            lib: {
              test(module) {
                return module.size() > 160000 &&
                  /node_modules[/\\]/.test(module.identifier())
              },
              name: 'lib',
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
          },
        }
      }
      return config
    }
  })
}

module.exports = nextConfig