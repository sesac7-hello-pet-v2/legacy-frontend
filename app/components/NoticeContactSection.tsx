"use client";

import Link from "next/link";

export default function NoticeContactSection() {
  // 임시 공지사항 데이터 (나중에 API로 대체)
  const notices = [
    { id: 1, title: "Hello Pet 서비스 오픈 안내", date: "2025-10-20" },
    { id: 2, title: "입양 절차 안내", date: "2025-10-18" },
    { id: 3, title: "반려동물 등록 의무화 안내", date: "2025-10-15" },
    { id: 4, title: "겨울철 반려동물 건강 관리 팁", date: "2025-10-10" },
    { id: 5, title: "서비스 이용 가이드", date: "2025-10-05" },
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 왼쪽: 공지사항 */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">공지사항</h2>
              <Link
                href="/notices"
                className="text-amber-500 hover:text-amber-600 text-sm font-medium"
              >
                더보기 →
              </Link>
            </div>
            <ul className="space-y-4">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <Link
                    href={`/notices/${notice.id}`}
                    className="flex items-start justify-between gap-3 hover:bg-gray-50 p-3 rounded-lg transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-base text-gray-900 hover:text-amber-500 transition line-clamp-1">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{notice.date}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 오른쪽: 연락처 */}
          <div className="bg-teal-600 text-white rounded-lg shadow-sm p-8 relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute -right-10 -bottom-10 opacity-10">
              <svg className="w-64 h-64" viewBox="0 0 100 100" fill="currentColor">
                <circle cx="50" cy="50" r="40" />
              </svg>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4 tracking-tight">동물사랑센터</h2>
              <p className="text-teal-100 text-base mb-8 leading-relaxed">
                유기 동물 문의, 입양 상담을 위한 문의는<br />
                아래 연락처로 문의해 주세요!
              </p>

              <div className="space-y-5">
                {/* 전화번호 */}
                <div className="flex items-center gap-3.5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-teal-100 mb-1">전화 문의</p>
                    <p className="text-2xl font-bold">1577-0954</p>
                  </div>
                </div>

                {/* 운영 시간 */}
                <div className="flex items-center gap-3.5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-teal-100 mb-1">운영 시간</p>
                    <p className="text-base font-semibold">평일 09:00 - 18:00</p>
                  </div>
                </div>

                {/* 위치 */}
                <div className="flex items-center gap-3.5">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-teal-100 mb-1">위치</p>
                    <p className="text-base font-semibold">서울 성동구</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
