import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface ErrorResponse {
  code?: string; // "UNAUTHORIZED"
  message?: string; // "Full authentication is required to access this resource"
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // ← 새 accessToken 쿠키를 자동으로 싣도록 유지
  timeout: 5000,
});

// 별도 axios 인스턴스 사용
const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let queue: {
  resolve: (value: AxiosResponse) => void;
  reject: (reason: any) => void;
  config: AxiosRequestConfig;
}[] = [];

/** 대기열 비우면서 재요청 */
function processQueue(error: any = null) {
  queue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      // api(config) 의 실제 결과를 resolve 해 줘야
      // 호출 측에서 then/catch 로 정상 흐름을 이어갈 수 있음
      api(config).then(resolve).catch(reject);
    }
  });
  queue = [];
}

api.interceptors.response.use(
  /* ① 성공 응답은 그대로 전달 */
  (res) => res,

  /* ② 실패 응답 처리 */
  async (err: AxiosError<ErrorResponse>) => {
    const { response, config } = err;

    const isAccessExpired =
      response?.status === 401 &&
      (response?.data.code === "UNAUTHORIZED" ||
        response?.data.code === "ACCESS_TOKEN_EXPIRED");

    // 이미 한 번 재시도했다면 그대로 에러 반환
    if (!isAccessExpired || (config as any)._retry) {
      return Promise.reject(err);
    }
    (config as any)._retry = true;

    // ──────────────── 1) 리프레시 중이면 큐에 넣고 대기 ────────────────
    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        queue.push({ resolve, reject, config: config! })
      );
    }

    // ──────────────── 2) 첫 리프레시 시도 ────────────────
    isRefreshing = true;
    try {
      await refreshApi.post("/auth/refresh"); // ← 리프레시 쿠키로 새 accessToken 쿠키 발급
      isRefreshing = false; // ← 먼저 플래그 해제
      processQueue(); // ← 대기열 요청 전부 재시도
      return api(config!); // ← 자기 자신 재시도 후 결과 반환
    } catch (refreshErr) {
      isRefreshing = false; // ← 먼저 플래그 해제

      processQueue(refreshErr); // 전부 실패 처리
      alert("로그인 정보가 없습니다.");
      if (typeof window !== "undefined") {
        window.location.replace("/401"); // 새로고침 없이 경로만 변경
      }
      return Promise.reject(refreshErr);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
