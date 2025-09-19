"use client";
import Link from "next/link";
import { useUserStore } from "../store/UserStore";
import { useEffect, useRef, useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";

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
    setOpen(false);
    try {
      await api.delete("/auth/logout");
      router.push("/");
      alert("로그아웃 되었습니다.");
    } catch (err) {
      alert("로그아웃 실패: " + (err as Error).message);
    }
  };

  return (
    <nav className="bg-yellow-100 border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-10 py-2">
        {/* 왼쪽: 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/img3.png"
            alt="Home Logo"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <span className="text-lg font-bold text-orange-400">Hello Pet</span>
        </Link>

        {/* 오른쪽: 메뉴 + 로그인 */}
        <div className="flex items-center gap-x-6">
          <Link
            href="/announcements"
            className="text-gray-700 hover:text-amber-500 font-medium transition"
          >
            입양게시판
          </Link>
          <Link
            href="/boards"
            className="text-gray-700 hover:text-amber-500 font-medium transition"
          >
            자유게시판
          </Link>

          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen(!open)}>
                <img
                  src={user.profileUrl}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full object-cover border-2 border-amber-400"
                />
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-lg z-10">
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={user.profileUrl}
                      alt="profile"
                      width={64}
                      height={64}
                      className="rounded-full object-cover border"
                    />
                    <p className="text-base font-semibold">{user.nickname}</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 w-full">
                    <Link
                      href="/me"
                      onClick={() => setOpen(false)}
                      className="rounded-md px-4 py-2 text-sm text-center hover:bg-gray-100 transition"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={logout}
                      className="rounded-md bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600 transition"
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
              className="rounded-full bg-amber-300 px-4 py-2 text-sm text-white hover:bg-amber-400 transition"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
