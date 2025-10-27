"use client";

import {useEffect, useState} from "react";
import Link from "next/link";
import SmartImage from "@/app/components/SmartImage";
import PostDetailModal from "@/app/(site)/feed/components/PostDetailModal";

import {feedApi} from "@/app/lib/feedApi";
import {FeedPost} from "@/app/types/feed";

// 더미 데이터 (항상 10개)
const DUMMY_FEEDS: FeedPost[] = Array.from({ length: 10 }, (_, i) => ({
  postId: `dummy-${i + 1}`,
    user: {
        userId: 0,
        nickname: "로딩중",
        profileUrl: null,
    },
  content: "데이터를 불러올 수 없습니다",
  imageUrls: [],
  postedAt: new Date().toISOString(),
  likeCount: 0,
  isLiked: false,
}));

export default function FeedCards() {
  const [feeds, setFeeds] = useState<FeedPost[]>(DUMMY_FEEDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchFeeds();
  }, []);

  // 자동 슬라이드 (5초마다)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIdx = Math.max(0, feeds.length - visibleCount);
        return prev >= maxIdx ? 0 : prev + 1;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [feeds.length]);

  const fetchFeeds = async () => {
    try {
      const response = await feedApi.getPosts({ page: 1, size: 10 });
      const data = response.content || [];
      // API 데이터가 있으면 사용, 없으면 더미 데이터 유지
      if (data.length > 0) {
        setFeeds(data);
      }
    } catch (error) {
      // 에러 시에도 더미 데이터 유지 (콘솔 에러 제거)
      setFeeds(DUMMY_FEEDS);
    } finally {
      setLoading(false);
    }
  };

  const visibleCount = 4;
  const maxIndex = Math.max(0, feeds.length - visibleCount);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

    const handlePostClick = (postId: string) => {
        setSelectedPostId(postId);
    };

    const handleCloseModal = () => {
        setSelectedPostId(null);
    };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">우리 동물들의 이야기</h2>
          <Link
            href="/feed"
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
              {feeds.map((feed) => {
                const isDummy = feed.postId.startsWith('dummy-');

                  // 로딩 중이거나 더미인 경우 스켈레톤, 아니면 Link
                if (loading || isDummy) {
                  return (
                    <div
                      key={feed.postId}
                      className="flex-shrink-0 w-[calc(25%-18px)] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                    >
                        {/* 사용자 정보 스켈레톤 */}
                      <div className="p-3 flex items-center gap-2.5 border-b">
                          <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse flex-shrink-0"></div>
                          <div className="h-4 bg-gray-300 rounded animate-pulse flex-1"></div>
                      </div>

                        {/* 이미지 스켈레톤 */}
                        <div className="relative h-48 overflow-hidden bg-gray-300 animate-pulse">
                      </div>

                        {/* 내용 스켈레톤 */}
                        <div className="p-3 space-y-2">
                            <div className="h-3 bg-gray-300 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                            <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  );
                }

                  // 실제 데이터인 경우 클릭 가능한 div로 렌더링
                return (
                    <div
                    key={feed.postId}
                    onClick={() => handlePostClick(feed.postId)}
                    className="flex-shrink-0 w-[calc(25%-18px)] bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group border border-gray-200 cursor-pointer"
                  >
                    {/* 사용자 정보 */}
                    <div className="p-3 flex items-center gap-2.5 border-b">
                        {feed.user.profileUrl ? (
                            <SmartImage
                                src={feed.user.profileUrl}
                                alt={`${feed.user.nickname} 프로필`}
                                size="thumb"
                                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                        ) : (
                            <div
                                className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium text-gray-600">
                            {feed.user.nickname?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                            </div>
                        )}
                      <span className="font-medium text-sm">
                        {feed.user.nickname || '익명'}
                      </span>
                    </div>

                    {/* 이미지 */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      {feed.imageUrls && feed.imageUrls.length > 0 ? (

                        <SmartImage
                          src={feed.imageUrls[0]}
                          alt="Feed"
                          size="feed"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"

                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          이미지 없음
                        </div>
                      )}
                    </div>

                    {/* 내용 */}
                    <div className="p-3">
                      <p className="text-gray-700 text-sm line-clamp-3">{feed.content}</p>
                    </div>
                    </div>
                );
              })}
            </div>
          </div>

          {/* 좌우 버튼 */}
          {feeds.length > visibleCount && (
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

        {/* 게시글 상세 모달 */}
        {selectedPostId && (
            <PostDetailModal
                isOpen={true}
                postId={selectedPostId}
                onClose={handleCloseModal}
            />
        )}
    </section>
  );
}
