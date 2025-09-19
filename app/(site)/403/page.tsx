// app/403/page.tsx
import Link from "next/link";

export const metadata = {
  title: "403 – Forbidden",
};

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-4xl font-bold text-red-500">403</h1>
      <p className="mt-4 text-lg text-gray-700">접근 권한이 없습니다.</p>
      <Link
        href="/"
        className="mt-6 px-4 py-2 rounded bg-amber-400 text-white hover:bg-amber-500"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
