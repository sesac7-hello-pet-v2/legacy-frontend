"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Link from "next/link";
import { UserDetailData } from "../store/UserStore";
import RequireRole from "./RequireRole";

export default function UserDetail() {
  /* ─────────── 상태 ─────────── */
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ─────────── 데이터 패치 ─────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<UserDetailData>("/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ─────────── 상태별 렌더링 ─────────── */
  if (loading) {
    return <div className="p-6 text-center text-sm">로딩 중...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-sm text-red-500">
        유저 정보를 불러올 수 없습니다.
      </div>
    );
  }

  /* ─────────── UI ─────────── */
  return (
    <RequireRole allow={["USER", "ADMIN", "SHELTER"]} fallback="/auth/login">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_0_0_4px_rgba(253,224,71,0.25)]">
        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-wide text-amber-400">
            내 정보
          </h2>
          <Link
            href="/auth/edit"
            className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-500 transition hover:bg-amber-50"
          >
            내 정보 수정
          </Link>
        </div>

        {/* 정보 */}
        <dl className="space-y-3 text-sm text-gray-700">
          <div className="flex justify-between">
            <dt className="font-semibold">이름</dt>
            <dd>{user.username}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold">닉네임</dt>
            <dd>{user.nickname}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold">전화번호</dt>
            <dd>{user.phoneNumber}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-semibold">주소</dt>
            <dd className="text-right">{user.address}</dd>
          </div>
        </dl>
      </div>
    </RequireRole>
  );
}
