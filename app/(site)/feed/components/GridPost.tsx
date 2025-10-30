import React from 'react';
import {FeedPost as FeedPostType} from "../../../types/feed";

interface GridPostProps {
    post: FeedPostType;
    onClick: (postId: string) => void;
}

export default function GridPost({post, onClick}: GridPostProps) {
    const handleClick = () => {
        onClick(post.postId);
    };

    const firstImage = post.imageUrls?.[0];
    const hasMultipleImages = post.imageUrls && post.imageUrls.length > 1;

    if (!firstImage) {
        return (
            <div className="relative aspect-square bg-gray-300 flex items-center justify-center cursor-pointer"
                 onClick={handleClick}>
                <span className="text-gray-500 text-xs">이미지 없음</span>
            </div>
        );
    }

    return (
        <div className="relative aspect-square cursor-pointer group overflow-hidden" onClick={handleClick}>
            <img
                src={firstImage}
                alt={`게시글 ${post.postId}`}
                className="w-full h-full object-cover"
            />

            {/* 다중 이미지 표시 아이콘 */}
            {hasMultipleImages && (
                <div className="absolute top-2 right-2">
                    <svg
                        className="w-5 h-5 text-white drop-shadow-lg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
                        <path d="M15 8a1 1 0 100-2 1 1 0 000 2z"/>
                    </svg>
                </div>
            )}

            {/* 호버 오버레이 - 더 단순하게 */}
            <div
                className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>

            {/* 호버 시 표시되는 정보 */}
            <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center gap-4 text-white">
                    <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"/>
                        </svg>
                        <span className="text-sm font-semibold">{post.likeCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                  clipRule="evenodd"/>
                        </svg>
                        <span className="text-sm font-semibold">0</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
