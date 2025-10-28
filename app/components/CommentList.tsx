"use client";

import React, {useEffect, useState} from 'react';
import {Comment} from '../types/comment';
import {commentApi} from '../lib/commentApi';
import {useAuth} from '../hooks/useAuth';
import CommentItem from './CommentItem';

interface CommentListProps {
    postId: string;
    isOpen: boolean;
}

export default function CommentList({postId, isOpen}: CommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalElements, setTotalElements] = useState(0);
    const {user} = useAuth();

    const loadComments = async (pageNum: number = 1, reset: boolean = false) => {
        try {
            setLoading(true);
            setError(null);

            const response = await commentApi.getComments(
                postId,
                {page: pageNum, size: 20}
            );

            if (reset) {
                setComments(response.content);
            } else {
                setComments(prev => [...prev, ...response.content]);
            }

            setPage(pageNum);
            setHasMore(pageNum < response.page.totalPages);
            setTotalElements(response.page.totalElements);
        } catch (err) {
            setError(err instanceof Error ? err.message : '댓글을 불러오는데 실패했습니다.');
            console.error('Failed to load comments:', err);
        } finally {
            setLoading(false);
        }
    };

    // 모달이 열릴 때 댓글 로드
    useEffect(() => {
        if (isOpen && postId) {
            loadComments(1, true);
        }
    }, [isOpen, postId]);

    const handleCommentAdded = (newComment: Comment) => {
        setComments(prev => [newComment, ...prev]);
        setTotalElements(prev => prev + 1);
    };

    const handleCommentUpdated = (updatedComment: Comment) => {
        setComments(prev =>
            prev.map(comment =>
                comment.commentId === updatedComment.commentId ? updatedComment : comment
            )
        );
    };

    const handleCommentDeleted = (commentId: string) => {
        setComments(prev => prev.filter(comment => comment.commentId !== commentId));
        setTotalElements(prev => Math.max(0, prev - 1));
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadComments(page + 1, false);
        }
    };

    if (!isOpen) return null;

    return (
        <div>
            {/* 댓글 목록 헤더 */}
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">
                    댓글 {totalElements.toLocaleString()}개
                </h3>
            </div>

            {/* 댓글 목록 */}
            <div className="max-h-96 overflow-y-auto">
                {error && (
                    <div className="p-4 text-center">
                        <p className="text-red-500 text-sm mb-2">{error}</p>
                        <button
                            onClick={() => loadComments(1, true)}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            다시 시도
                        </button>
                    </div>
                )}

                {comments.length === 0 && !loading && !error ? (
                    <div className="p-8 text-center">
                        <p className="text-gray-500 text-sm">
                            아직 댓글이 없습니다.
                            {user ? ' 첫 번째 댓글을 작성해보세요!' : ' 로그인 후 댓글을 작성할 수 있습니다.'}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {comments.map((comment) => (
                            <CommentItem
                                key={comment.commentId}
                                comment={comment}
                                postId={postId}
                                onCommentUpdated={handleCommentUpdated}
                                onCommentDeleted={handleCommentDeleted}
                            />
                        ))}
                    </div>
                )}

                {/* 로딩 스켈레톤 */}
                {loading && (
                    <div className="p-4 space-y-3">
                        {Array.from({length: 3}).map((_, index) => (
                            <div key={index} className="flex gap-3">
                                <div className="w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-300 rounded w-1/4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-3/4 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 더 보기 버튼 */}
                {hasMore && !loading && comments.length > 0 && (
                    <div className="p-4 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            댓글 더 보기
                        </button>
                    </div>
                )}

                {!hasMore && comments.length > 0 && (
                    <div className="p-4 text-center">
                        <p className="text-gray-500 text-xs">모든 댓글을 확인했습니다.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
