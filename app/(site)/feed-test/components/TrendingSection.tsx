"use client";

import React from 'react';

// 가짜 인기 게시글 데이터
const trendingPosts = [
    {
        id: 1,
        thumbnail: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop",
        likes: 1234,
        caption: "우리 골댕이의 첫 수영 🏊‍♂️",
        author: "멍멍이집사",
    },
    {
        id: 2,
        thumbnail: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop",
        likes: 987,
        caption: "고양이의 완벽한 점프샷 📸",
        author: "고양이왕국",
    },
    {
        id: 3,
        thumbnail: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=300&fit=crop",
        likes: 856,
        caption: "토끼의 귀여운 하품 😴",
        author: "토끼애호가",
    },
    {
        id: 4,
        thumbnail: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=300&h=300&fit=crop",
        likes: 745,
        caption: "햄스터의 볼주머니 폭발 💥",
        author: "햄스터마을",
    },
    {
        id: 5,
        thumbnail: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=300&fit=crop",
        likes: 623,
        caption: "강아지 삼형제의 단체사진 📷",
        author: "댕댕이네",
    },
    {
        id: 6,
        thumbnail: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=300&h=300&fit=crop",
        likes: 567,
        caption: "고양이의 신비로운 눈빛 ✨",
        author: "냥이마음",
    },
];

export default function TrendingSection() {
    const formatLikes = (likes: number) => {
        if (likes >= 1000) {
            return `${(likes / 1000).toFixed(1)}k`;
        }
        return likes.toString();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span>🔥</span>
                    인기 게시글
                </h3>
                <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    모두 보기
                </button>
            </div>

            {/* 인기 게시글 그리드 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {trendingPosts.map(post => (
                    <div key={post.id} className="relative group cursor-pointer">
                        <div className="aspect-square overflow-hidden rounded-lg">
                            <img
                                src={post.thumbnail}
                                alt={post.caption}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>

                        {/* 오버레이 */}
                        <div
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <div
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-white text-sm font-medium">
                                <span>❤️</span>
                                <span>{formatLikes(post.likes)}</span>
                            </div>
                        </div>

                        {/* 좋아요 배지 */}
                        <div
                            className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                            {formatLikes(post.likes)}
                        </div>
                    </div>
                ))}
            </div>

            {/* 인기 게시글 리스트 미리보기 */}
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">최근 인기</h4>
                {trendingPosts.slice(0, 3).map(post => (
                    <div key={`list-${post.id}`} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                            <img
                                src={post.thumbnail}
                                alt={post.caption}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900 truncate">
                                {post.caption}
                            </p>
                            <p className="text-xs text-gray-500">
                                {post.author} • {formatLikes(post.likes)} 좋아요
                            </p>
                        </div>
                        <div className="text-xs text-gray-400">
                            2시간 전
                        </div>
                    </div>
                ))}
            </div>

            {/* 트렌딩 해시태그 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-2">인기 해시태그</h4>
                <div className="flex flex-wrap gap-2">
                    {['#골든리트리버', '#고양이', '#강아지산책', '#펫스타그램', '#반려동물'].map(tag => (
                        <span
                            key={tag}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full hover:bg-blue-100 cursor-pointer"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
