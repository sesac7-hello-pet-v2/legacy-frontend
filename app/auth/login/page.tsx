"use client";

import RequireRole from "@/app/components/RequireRole";
import api from "@/app/lib/api";
import { useUserStore } from "@/app/store/UserStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const setUser = useUserStore((s) => s.setUser);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    try {
      setLoading(true);
      await api.post("/auth/login", { email, password }).then((res) => {
        setUser(res.data);
      });
      alert("로그인 되었습니다!");
      router.push("/");
    } catch (err) {
      alert("로그인 실패: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <RequireRole notAllow={["USER", "ADMIN", "SHELTER"]}>
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-md rounded-2xl shadow-[0_0_0_4px_rgba(253,224,71,0.25)] p-10">
          <h1 className="mb-12 text-center text-4xl font-bold tracking-widest text-amber-400">
            로그인
          </h1>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="아이디를 입력하세요."
              required
              className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요."
              required
              className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-amber-400 py-3 font-semibold text-white shadow-md transition hover:bg-amber-500 disabled:opacity-60"
            >
              {loading ? "로딩..." : "로그인"}
            </button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/signup"
              className="text-sm text-amber-400 hover:underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
