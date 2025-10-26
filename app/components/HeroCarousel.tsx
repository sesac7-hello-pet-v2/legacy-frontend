"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGES = [
  { url: "/bannerImg.png", type: "local" },
  { url: "/hero2.jpg", type: "local" },
  { url: "/hero3.jpg", type: "local" },
  { url: "/hero4.jpg", type: "local" },
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? HERO_IMAGES.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  return (
    <div className="relative w-full h-[480px] overflow-hidden">
      {/* 배경 이미지 슬라이드 */}
      {HERO_IMAGES.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* 배경 그라데이션 (첫 번째 배너만) */}
          {index === 0 && (
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100" />
          )}
          <Image
            src={image.url}
            alt={`Hero ${index + 1}`}
            fill
            className={index === 0 ? "object-contain" : "object-cover"}
            priority={index === 0}
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* 텍스트 오버레이 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-lg">
          반려동물권의 올바른 실천,
        </h1>
        <p className="text-xl md:text-2xl mb-6 drop-shadow-lg font-light">
          삶을이야기 생명으로
        </p>
        <Link
          href="/announcements"
          className="bg-amber-400 hover:bg-amber-500 text-white px-6 py-2.5 rounded-full text-sm font-medium transition transform hover:scale-105"
        >
          입양게시판
        </Link>
      </div>

      {/* 좌우 화살표 */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-3 transition"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 rounded-full p-3 transition"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
