"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/app/lib/api";

interface Announcement {
  id: number;
  breed: string;
  status: string;
  shelterName: string;
  createdAt: string;
  image: string | null;
}

interface AnnouncementPage {
  page: number;
  size: number;
  totalPages: number;
  totalCount: number;
  announcements: Announcement[];
}

const animalstatus: Record<"IN_PROGRESS" | "COMPLETED", string> = {
  IN_PROGRESS: "입양 중",
  COMPLETED: "입양완료",
};

const ITEMS_PER_PAGE = 9;

export default function AnnouncementsPage() {
  const [data, setData] = useState<AnnouncementPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchAnnouncements(page);
  }, [page]);

  async function fetchAnnouncements(p: number) {
    setLoading(true);
    try {
      const res = await api.get<AnnouncementPage>(
        `/announcements?page=${p}&size=${ITEMS_PER_PAGE}`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  const goPrev = () => page > 0 && setPage(page - 1);
  const goNext = () => data && page < data.totalPages - 1 && setPage(page + 1);

  if (loading) return <h1 className="text-center mt-20 text-xl">Loading…</h1>;
  if (!data) return <h1 className="text-center mt-20 text-xl">조회 실패</h1>;

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <h1 className="text-center text-yellow-600 font-extrabold text-3xl mb-10">
        입양 게시판
      </h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
        {data.announcements.map((item) => (
          <li key={item.id}>
            <Link
              href={`/announcements/${item.id}`}
              className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 hover:bg-yellow-50"
            >
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.breed}
                  className="w-full h-56 object-cover rounded-xl mb-4 transition-transform hover:scale-105 duration-300"
                />
              ) : (
                <div className="w-full h-56 bg-gray-200 rounded-xl mb-4 flex items-center justify-center text-gray-400">
                  이미지 없음
                </div>
              )}

              <p className="text-lg text-yellow-800 font-bold mb-1">
                {item.breed}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {animalstatus[item.status as "IN_PROGRESS" | "COMPLETED"]} /{" "}
                보호소: {item.shelterName}
              </p>
              <p className="text-sm text-gray-400">
                등록일: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={goPrev}
          disabled={page === 0}
          className={`px-4 py-2 rounded-full shadow ${
            page === 0
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
        >
          ◀ 이전
        </button>

        <span className="text-sm text-gray-700 font-medium">
          {page + 1} / {data.totalPages}
        </span>

        <button
          onClick={goNext}
          disabled={page >= data.totalPages - 1}
          className={`px-4 py-2 rounded-full shadow ${
            page >= data.totalPages - 1
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-yellow-500 text-white hover:bg-yellow-600"
          }`}
        >
          다음 ▶
        </button>
      </div>
    </div>
  );
}
