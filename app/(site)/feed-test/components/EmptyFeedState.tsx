"use client";

import React from 'react';

export default function EmptyFeedState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            {/* 아이콘 */}
            <div
                className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                </svg>
            </div>

            {/* 메인 메시지 */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                아직 게시글이 없어요 🐕
            </h3>

            {/* 서브 메시지 */}
            <p className="text-gray-600 mb-8 max-w-sm leading-relaxed">
                첫 번째 게시글을 작성하거나 다른 반려동물 친구들을 팔로우해서 피드를 채워보세요!
            </p>

            {/* 액션 버튼들 */}
            <div className="flex flex-col gap-3 w-full max-w-xs">
                <button
                    className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                    첫 게시글 작성하기
                </button>

                <button
                    className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                    친구 찾기
                </button>
            </div>

            {/* 추가 정보 */}
            <div className="mt-8 space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <span>💡</span>
                    <span>팁: 해시태그를 사용해서 더 많은 사람들과 소통해보세요</span>
                </div>
            </div>
        </div>
    );
}
