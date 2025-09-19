// app/auth/layout.tsx
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* ───────── 헤더 ───────── */}
      <header className="flex items-center gap-2 px-4 py-3">
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
      </header>

      {/* ───────── 본문 ───────── */}
      <main className="flex flex-grow items-center justify-center">
        {children}
      </main>
    </div>
  );
}
