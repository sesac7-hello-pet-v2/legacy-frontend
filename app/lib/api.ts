import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
    timeout: 30000, // 30초로 증가
});

// 토큰 만료 시간 관리
let tokenExpiresAt: number | null = null;
let refreshTimer: NodeJS.Timeout | null = null;

/**
 * 토큰 만료 시간 설정 및 자동 갱신 타이머 시작
 * @param expiresIn 만료까지 남은 시간 (초)
 */
export function setTokenExpiry(expiresIn: number) {
  // 만료 시간 계산 (현재 시간 + expiresIn 초)
  tokenExpiresAt = Date.now() + expiresIn * 1000;

  console.log("🔑 [Token Manager] 토큰 만료 시간 설정");
  console.log("  - 만료까지 남은 시간:", expiresIn, "초");
  console.log("  - 만료 예정 시각:", new Date(tokenExpiresAt).toLocaleString());

  // 기존 타이머 취소
  if (refreshTimer) {
    console.log("  - 기존 타이머 취소");
    clearTimeout(refreshTimer);
  }

  // 만료 1분 전에 토큰 갱신 (expiresIn - 60초)
  const refreshDelay = Math.max(0, (expiresIn - 60) * 1000);
  console.log("  - 갱신 예정 시각:", new Date(Date.now() + refreshDelay).toLocaleString());
  console.log("  - 갱신까지 대기 시간:", refreshDelay / 1000, "초");

  refreshTimer = setTimeout(async () => {
    console.log("⏰ [Token Manager] 토큰 갱신 시작");
    try {
      const response = await api.post("/v1/auth/refresh");
      console.log("✅ [Token Manager] 토큰 갱신 성공");

      // 응답 body에서 새로운 만료 시간 가져오기 (밀리초 → 초 변환)
      if (response.data?.expireIn) {
        const expireInSeconds = response.data.expireIn / 1000;
        console.log("  - 새로운 만료 시간:", response.data.expireIn, "ms ->", expireInSeconds, "초");
        setTokenExpiry(expireInSeconds);
      } else {
        console.warn("⚠️ [Token Manager] 응답에 expireIn이 없습니다:", response.data);
      }
    } catch (error) {
      console.error("❌ [Token Manager] 토큰 갱신 실패:", error);
      // 갱신 실패 시 로그인 페이지로 이동
      if (typeof window !== "undefined") {
        alert("세션이 만료되었습니다.");
        window.location.replace("/auth/login");
      }
    }
  }, refreshDelay);
}

/**
 * 타이머 정리 (로그아웃 시 호출)
 */
export function clearTokenExpiry() {
  console.log("🚪 [Token Manager] 토큰 타이머 정리 (로그아웃)");
  tokenExpiresAt = null;
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

/**
 * 로그인 후 호출 - 토큰 만료 시간 초기화
 * @param expiresIn 만료까지 남은 시간 (초)
 */
export function initializeTokenRefresh(expiresIn: number) {
  console.log("🚀 [Token Manager] 토큰 갱신 초기화 호출");
  setTokenExpiry(expiresIn);
}

export default api;
