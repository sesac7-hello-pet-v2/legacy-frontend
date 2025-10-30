"use client";

import {useEffect, useState} from "react";
import {feedApi} from "../../../lib/feedApi";
import {PostLikeResponse} from "../../../types/feed";
import {useAuth} from "@/app/hooks/useAuth";

interface PostActionsProps {
    postId: string;
    initialLikeCount: number;
    initialCommentCount?: number;
    initialIsLiked?: boolean;
    currentUserId?: number;
    postUserId?: number;
    isDetailModal?: boolean;
    onCommentClick?: () => void;
    showComments?: boolean;
    hideCommentInput?: boolean;
    hideCommentButton?: boolean;
}

export default function PostActions({
                                        postId,
                                        initialLikeCount,
                                        initialCommentCount = 0,
                                        initialIsLiked = false,
                                        currentUserId,
                                        postUserId,
                                        isDetailModal = false,
                                        onCommentClick,
                                        showComments = false,
                                        hideCommentInput = false,
                                        hideCommentButton = false
                                    }: PostActionsProps) {
    const {isAuthenticated} = useAuth();
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isSaved, setIsSaved] = useState(false);
    const [isLikeLoading, setIsLikeLoading] = useState(false);

    // props가 변경될 때 상태 업데이트
    useEffect(() => {
        setIsLiked(initialIsLiked);
        setLikeCount(initialLikeCount);
    }, [initialIsLiked, initialLikeCount]);

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
        if (onCommentClick) {
            onCommentClick();
        } else {
            console.log("Comment on post:", postId);
        }
    };

    const handleShare = () => {
        console.log("Share post:", postId);
    };


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

                    {!hideCommentButton && (
                        <button
                            onClick={handleComment}
                            className={`transition-transform hover:scale-110 ${
                                showComments ? "text-blue-600" : "text-gray-700"
                            }`}
                            title="댓글"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                            </svg>
                        </button>
                    )}
                </div>
            </div>
            {/* 좋아요와 댓글 수 표시 */}
            <div className="space-y-1">
                {likeCount > 0 && (
                    <div className="text-sm font-semibold text-gray-900">
                        좋아요 {likeCount.toLocaleString()}개
                        {!isAuthenticated && (
                            <span className="text-gray-500 text-xs ml-2">
                                (로그인하여 좋아요 남기기)
                            </span>
                        )}
                    </div>
                )}

                {initialCommentCount > 0 && (
                    <button
                        onClick={handleComment}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        댓글 {initialCommentCount.toLocaleString()}개 보기
                    </button>
                )}
            </div>
        </div>
    );
}
