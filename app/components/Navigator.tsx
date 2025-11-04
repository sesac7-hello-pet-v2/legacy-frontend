"use client";
import Link from "next/link";
import {useUserStore} from "../store/UserStore";
import {useEffect, useRef, useState} from "react";
import api, {clearTokenExpiry} from "../lib/api";
import {useRouter} from "next/navigation";
import {modalAlert} from "@/app/utils/alertUtils";

export default function Navigator() {
  const { user, clearUser } = useUserStore();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  /* ── 바깥 클릭 시 닫기 ── */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  /* ── 로그아웃 ── */
  const logout = async () => {
    clearUser();
    clearTokenExpiry();
    setOpen(false);
    try {
      await api.post("/v1/auth/logout");
      router.push("/");
        modalAlert("로그아웃 되었습니다.", "success");
    } catch (err) {
        modalAlert("로그아웃 실패: " + (err as Error).message, "error");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 mb-0">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* 왼쪽: 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/img3.png"
            alt="Home Logo"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <span className="text-xl font-bold text-amber-500">Hello PET</span>
        </Link>

        {/* 오른쪽: 메뉴 + 로그인 */}
        <div className="flex items-center gap-x-12">
          <Link
            href="/about"
            className="text-base text-gray-600 hover:text-amber-500 font-semibold transition-colors"
          >
            소개
          </Link>
          <Link
            href="/announcements"
            className="text-base text-gray-600 hover:text-amber-500 font-semibold transition-colors"
          >
            입양게시판
          </Link>
          <Link
            href="/feed"
            className="text-base text-gray-600 hover:text-amber-500 font-semibold transition-colors"
          >
            피드
          </Link>
          <Link
            href="/notices"
            className="text-base text-gray-600 hover:text-amber-500 font-semibold transition-colors"
          >
            공지사항
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={user.profileUrl || "/basic_profile.jpg"}
                  alt="Profile"
                  width={28}
                  height={28}
                  className="rounded-full object-cover ring-2 ring-amber-400"
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-52 rounded-lg border border-gray-200 bg-white shadow-lg z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profileUrl || "/basic_profile.jpg"}
                        alt="profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover ring-2 ring-white"
                      />
                      <p className="text-sm font-semibold text-gray-800">{user.nickname}</p>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/me"
                      onClick={() => {
                        console.log("🔘 [Navigator] 마이페이지 버튼 클릭");
                        setOpen(false);
                      }}
                      className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="rounded-lg bg-amber-500 px-5 py-2 text-sm text-white hover:bg-amber-600 transition-colors font-medium shadow-sm"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
