"use client";
import RequireRole from "@/app/components/RequireRole";
import api from "@/app/lib/api";
import { useUserStore } from "@/app/store/UserStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Withdraw() {
  const [password, setPassword] = useState("");
  const [verified, setVerified] = useState(false);

  const clearUser = useUserStore((s) => s.clearUser);

  const router = useRouter();

  async function checkPassword() {
    try {
      const res = api.post("/auth/check-password", { password });
      if ((await res).data.pass) {
        alert((await res).data.message);
        setVerified(true);
      }
    } catch (err) {
      alert(err);
    }
  }

  async function withdraw() {
    try {
      await api.delete("/me");
      clearUser();
      alert("탈퇴 되었습니다.");
      router.push("/");
    } catch (err) {
      alert(err);
    }
  }

  return (
    <RequireRole allow={["USER", "ADMIN", "SHELTER"]} fallback="/auth/login">
      <div className="flex flex-col min-h-screen items-center justify-center bg-white px-4">
        {/* 회원 탈퇴 페이지 타이틀 */}
        <h1 className="mb-8 text-center text-3xl font-bold tracking-widest text-amber-400">
          회원 탈퇴
        </h1>

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          disabled={verified}
          value={password} // 3) value 바인딩
          onChange={(e) => setPassword(e.target.value)} // 4) onChange 핸들러
          className="w-full rounded-lg px-4 py-3 shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100 
      disabled:text-gray-500 
      disabled:cursor-not-allowed"
        />

        {verified ? (
          <button
            onClick={withdraw}
            type="button"
            className=" mt-4
      w-full
      rounded-lg bg-red-500 py-3 text-center font-semibold text-white shadow-md transition 
             hover:bg-red-600"
          >
            회원 탈퇴 하기
          </button>
        ) : (
          <button
            onClick={checkPassword}
            type="button"
            disabled={password.length === 0} // 입력 없으면 비활성화
            className="
      mt-4
      w-full
      rounded-lg
      bg-amber-400
      py-3
      font-semibold
      text-white
      shadow-md
      transition
      hover:bg-amber-500
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
          >
            비밀번호 확인
          </button>
        )}
      </div>
    </RequireRole>
  );
}
