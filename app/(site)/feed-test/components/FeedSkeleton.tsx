"use client";

import React from 'react';

export default function FeedSkeleton() {
    return (
        <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden animate-pulse"
                >
                    {/* 헤더 */}
                    <div className="flex items-center space-x-3 p-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>

                    {/* 이미지 */}
                    <div className="aspect-square bg-gray-200"></div>

                    {/* 액션 버튼들 */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-4">
                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                            </div>
                            <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        </div>

                        {/* 좋아요 수 */}
                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>

                        {/* 텍스트 내용 */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>

                        {/* 댓글 */}
                        <div className="mt-3">
                            <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                        </div>

                        {/* 시간 */}
                        <div className="h-3 bg-gray-200 rounded w-16 mt-2"></div>
                    </div>
                </div>
            ))}

            {/* 로딩 더보기 */}
            <div className="flex justify-center py-4">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
        </div>
    );
}