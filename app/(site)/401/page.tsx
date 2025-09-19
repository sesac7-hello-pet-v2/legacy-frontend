"use client";
import { useUserStore } from "@/app/store/UserStore";
import Link from "next/link";
import { useEffect } from "react";

export default function UnauthorizedPage() {
  const clearUser = useUserStore((s) => s.clearUser);

  useEffect(() => {
    clearUser();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-500">401</h1>
      <p className="mt-4 text-lg text-gray-700">
        유효한 인증 자격 증명이 없습니다.
      </p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 rounded bg-amber-400 text-white hover:bg-amber-500"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
