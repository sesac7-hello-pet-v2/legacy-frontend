"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "@/app/lib/api";

interface Announcement {
  id: number;
  breed: string;
  status: string;
  shelterName: string;
  createdAt: string;
  image: string | null;
}

// 상태 변환
const animalStatus: Record<"IN_PROGRESS" | "COMPLETED", string> = {
  IN_PROGRESS: "입양 중",
  COMPLETED: "입양완료",
};

// 더미 데이터 (항상 10개)
const DUMMY_ANNOUNCEMENTS: Announcement[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  breed: "데이터를 불러올 수 없습니다",
  status: "IN_PROGRESS",
  shelterName: "알 수 없음",
  image: null,
  createdAt: new Date().toISOString(),
}));

export default function AnnouncementCards() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(DUMMY_ANNOUNCEMENTS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIdx = Math.max(0, announcements.length - visibleCount);
        return prev >= maxIdx ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get("/announcements?page=0&size=10");
      const data = response.data.announcements || [];
      // API 데이터가 있으면 사용, 없으면 더미 데이터 유지
      if (data.length > 0) {
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("입양게시판 불러오기 실패:", error);
      // 에러 시에도 더미 데이터 유지
      setAnnouncements(DUMMY_ANNOUNCEMENTS);
    } finally {
      setLoading(false);
    }
  };

  const visibleCount = 4;
  const maxIndex = Math.max(0, announcements.length - visibleCount);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">입양을 기다리는 동물들</h2>
          <Link
            href="/announcements"
            className="text-amber-500 hover:text-amber-600 text-sm font-medium"
          >
            더보기 →
          </Link>
        </div>

        <div className="relative">
          {/* 카드 컨테이너 */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCount + 1.5)}%)` }}
            >
              {announcements.map((announcement) => {
                const isDummy = announcement.breed === "데이터를 불러올 수 없습니다";
                const CardWrapper = isDummy ? 'div' : Link;
                const cardProps = isDummy
                  ? { className: "flex-shrink-0 w-[calc(25%-18px)] bg-white rounded-lg shadow-sm overflow-hidden opacity-50 cursor-not-allowed" }
                  : {
                      href: `/announcements/${announcement.id}`,
                      className: "flex-shrink-0 w-[calc(25%-18px)] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group"
                    };

                return (
                  <CardWrapper key={announcement.id} {...cardProps}>
                    {/* 이미지 */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      {announcement.image ? (
                        <Image
                          src={announcement.image}
                          alt={announcement.breed}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          {isDummy ? '로딩 중...' : '이미지 없음'}
                        </div>
                      )}
                      {/* 뱃지 */}
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-2.5 py-0.5 rounded-full text-xs font-medium">
                        {animalStatus[announcement.status as "IN_PROGRESS" | "COMPLETED"]}
                      </div>
                    </div>

                    {/* 정보 */}
                    <div className="p-3">
                      <h3 className="font-semibold text-base mb-1.5 truncate">{announcement.breed}</h3>
                      <div className="text-xs text-gray-600 space-y-0.5">
                        <p>보호소: {announcement.shelterName}</p>
                        <p>등록일: {new Date(announcement.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </div>

          {/* 좌우 버튼 */}
          {announcements.length > visibleCount && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-3 shadow-lg z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-3 shadow-lg z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
