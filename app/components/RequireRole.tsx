"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../store/UserStore";

interface Props {
  allow?: string[];
  notAllow?: string[];
  fallback?: string;
  children: ReactNode;
}

export default function RequireRole({
  allow = [],
  notAllow = [],
  fallback = "/403",
  children,
}: Props) {
  const user = useUserStore((s) => s.user);
  const role = user ? user.role : null;
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // 클라이언트 사이드에서만 권한 체크 실행
  useEffect(() => {
    setIsReady(true);
  }, []);

  // 스토어가 아직 초기화되지 않았거나 클라이언트 준비가 안된 상태
  const isLoading = !isReady || user === undefined;

  let isBlocked = false;

  if (!isLoading) {
    if (role && notAllow.includes(role)) isBlocked = true;
    else if (allow.length > 0 && (!role || !allow.includes(role)))
      isBlocked = true;
  }

  useEffect(() => {
    // 로딩이 완료되고 차단되어야 할 때만 리다이렉트
    if (!isLoading && isBlocked) {
      router.replace(fallback);
    }
  }, [isLoading, isBlocked, router, fallback]);

  if (isLoading) return <div className="p-4">Loading…</div>;
  if (isBlocked) return null;
  return <>{children}</>;
}
