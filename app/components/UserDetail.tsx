"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import Link from "next/link";
import { UserDetailData } from "../store/UserStore";

export default function UserDetail() {
  /* ─────────── 상태 ─────────── */
  const [user, setUser] = useState<UserDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ─────────── 전화번호 포맷팅 함수 ─────────── */
  const formatPhoneNumber = (phone: string): string => {
    // 숫자만 추출
    const numbers = phone.replace(/[^0-9]/g, "");

    // 휴대폰 번호 (010, 011, 016, 017, 018, 019 등)
    if (numbers.startsWith("01")) {
      if (numbers.length === 11) {
        return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      } else if (numbers.length === 10) {
        return numbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
      }
    }

    // 서울 지역번호 (02)
    if (numbers.startsWith("02")) {
      if (numbers.length === 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
      } else if (numbers.length === 9) {
        return numbers.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
      }
    }

    // 기타 지역번호 (031, 032, 033, 041, 042, 043, 051, 052, 053, 054, 055, 061, 062, 063, 064 등)
    if (numbers.length === 11) {
      return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (numbers.length === 10) {
      return numbers.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }

    // 포맷팅할 수 없는 경우 원본 반환
    return phone;
  };

  /* ─────────── 데이터 패치 ─────────── */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<UserDetailData>("/v1/users");
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
    <div className="w-full">
        {/* 헤더 */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            내 정보
          </h2>
          <Link
            href="/auth/edit"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            내 정보 수정
          </Link>
        </div>

        {/* 정보 그리드 */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* 이름 카드 */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-amber-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <dt className="text-sm font-semibold">이름</dt>
            </div>
            <dd className="text-2xl font-bold text-gray-900">{user.username}</dd>
          </div>

          {/* 닉네임 카드 */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-amber-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <dt className="text-sm font-semibold">닉네임</dt>
            </div>
            <dd className="text-2xl font-bold text-gray-900">{user.nickname}</dd>
          </div>

          {/* 전화번호 카드 */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-amber-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <dt className="text-sm font-semibold">전화번호</dt>
            </div>
            <dd className="text-2xl font-bold text-gray-900">{formatPhoneNumber(user.phoneNumber)}</dd>
          </div>

          {/* 주소 카드 */}
          <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-2 flex items-center gap-2 text-amber-700">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <dt className="text-sm font-semibold">주소</dt>
            </div>
            <dd className="text-lg font-medium leading-relaxed text-gray-900">{user.address}</dd>
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="mt-8 rounded-xl bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">계정 정보</h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span className="font-medium">이메일</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">계정 상태</span>
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                <svg className="mr-1.5 h-2 w-2 fill-current" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="4" />
                </svg>
                활성화
              </span>
            </div>
          </div>
        </div>
      </div>
  );
}
