"use client";

import {useState} from "react";
import {feedApi} from "../../../lib/feedApi";
import {PostLikeResponse} from "../../../types/feed";
import {useAuth} from "@/app/hooks/useAuth";

interface PostActionsProps {
    postId: string;
    initialLikeCount: number;
    currentUserId?: number;
    postUserId?: number;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function PostActions({
                                        postId,
                                        initialLikeCount,
                                        currentUserId,
                                        postUserId,
                                        onEdit,
                                        onDelete
                                    }: PostActionsProps) {
    const {isAuthenticated} = useAuth();
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isSaved, setIsSaved] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    const handleLike = async () => {
        if (!isAuthenticated || isLikeLoading || !currentUserId) return;

        const originalLiked = isLiked;
        const originalCount = likeCount;

        setIsLiked(!isLiked);
        setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
        setIsLikeLoading(true);

        try {
            const response: PostLikeResponse = await feedApi.likePost(postId, {
                userId: currentUserId
            });

            setIsLiked(response.isLiked);
            setLikeCount(response.likeCount);
        } catch (error) {
            console.error('좋아요 처리 중 오류:', error);
            setIsLiked(originalLiked);
            setLikeCount(originalCount);
        } finally {
            setIsLikeLoading(false);
        }
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleComment = () => {
        console.log("Comment on post:", postId);
    };

    const handleShare = () => {
        console.log("Share post:", postId);
    };

    const isMyPost = isAuthenticated && currentUserId && postUserId === currentUserId;

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        disabled={!isAuthenticated || isLikeLoading}
                        className={`transition-transform ${
                            !isAuthenticated
                                ? "text-gray-400 cursor-not-allowed"
                                : isLiked
                                    ? "text-red-500 hover:scale-110"
                                    : "text-gray-700 hover:scale-110"
                        } ${isLikeLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        title={!isAuthenticated ? "로그인이 필요합니다" : "좋아요"}
                    >
                        <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                    <button
                        onClick={handleComment}
                        className="text-gray-700 hover:scale-110 transition-transform"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                    </button>
                    <button
                        onClick={handleShare}
                        className="text-gray-700 hover:scale-110 transition-transform"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    {isMyPost && (
                        <div className="flex items-center gap-1">
                            <button
                                onClick={onEdit}
                                className="text-gray-700 hover:text-blue-500 transition-colors p-1"
                                title="수정"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            </button>
                            <button
                                onClick={onDelete}
                                className="text-gray-700 hover:text-red-500 transition-colors p-1"
                                title="삭제"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                            </button>
                        </div>
                    )}
                    <button
                        onClick={handleSave}
                        className={`hover:scale-110 transition-transform ${
                            isSaved ? "text-gray-900" : "text-gray-700"
                        }`}
                    >
                        <svg className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                        </svg>
                    </button>
                </div>
            </div>
            {likeCount > 0 && (
                <div className="text-sm font-semibold text-gray-900 mb-2">
                    좋아요 {likeCount.toLocaleString()}개
                    {!isAuthenticated && (
                        <span className="text-gray-500 text-xs ml-2">
                            (로그인하여 좋아요 남기기)
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
