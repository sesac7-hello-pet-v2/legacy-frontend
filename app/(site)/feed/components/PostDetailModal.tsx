"use client";

import React, {useEffect, useState} from 'react';
import {FeedPost} from '../../../types/feed';
import {feedApi} from '../../../lib/feedApi';
import ImageCarousel from './ImageCarousel';
import PostHeader from './PostHeader';
import PostActions from './PostActions';
import PostContent from './PostContent';
import {useAuth} from '@/app/hooks/useAuth';

interface PostDetailModalProps {
    isOpen: boolean;
    postId: string;
    onClose: () => void;
    onPostDelete?: (postId: string) => void;
}

export default function PostDetailModal({isOpen, postId, onClose, onPostDelete}: PostDetailModalProps) {
    const [post, setPost] = useState<FeedPost | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAuth();

    useEffect(() => {
        if (isOpen && postId) {
            fetchPostDetail();
        }
    }, [isOpen, postId]);

    const fetchPostDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const postData = await feedApi.getPost(postId);
            setPost(postData);
        } catch (err) {
            console.error('게시글 조회 실패:', err);
            setError('게시글을 불러올 수 없습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handlePostDelete = (deletedPostId: string) => {
        onPostDelete?.(deletedPostId);
        onClose(); // 모달 닫기
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        } else {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] min-h-[600px] overflow-hidden flex">
                {/* 왼쪽: 이미지 영역 */}
                <div className="flex-1 bg-black relative flex items-center justify-center">
                    {loading ? (
                        <div className="h-full w-full bg-gray-300 animate-pulse"></div>
                    ) : error ? (
                        <div className="text-center text-white">
                            <p className="text-lg mb-2">⚠️</p>
                            <p>{error}</p>
                        </div>
                    ) : post?.imageUrls && post.imageUrls.length > 0 ? (
                        <ImageCarousel images={post.imageUrls} isModal={true}/>
                    ) : (
                        <div className="text-center text-white">
                            <p className="text-lg mb-2">📷</p>
                            <p>이미지가 없습니다</p>
                        </div>
                    )}
                </div>

                {/* 오른쪽: 게시글 정보 영역 */}
                <div className="w-96 flex flex-col">
                    {/* 헤더 */}
                    <div className="border-b border-gray-200">
                        {post && (
                            <PostHeader
                                user={post.user}
                                postedAt={post.postedAt}
                                currentUserId={user?.id}
                                onEdit={() => {
                                    onClose();
                                    window.location.href = `/feed/edit/${post.postId}`;
                                }}
                                onDelete={() => handlePostDelete(post.postId)}
                                showActions={true}
                            />
                        )}
                    </div>

                    {/* 내용 */}
                    <div className="flex-1 overflow-y-auto pt-2">
                        {post && <PostContent content={post.content}/>}

                        {/* 댓글 영역 */}
                        <div className="p-4 text-gray-500 text-sm border-t border-gray-200">
                            <p>댓글 기능은 추후 구현 예정입니다.</p>
                        </div>
                    </div>

                    {/* 액션 버튼들 */}
                    {post && (
                        <div className="border-t border-gray-200">
                            <PostActions
                                postId={post.postId}
                                initialLikeCount={post.likeCount}
                                initialIsLiked={post.isLiked}
                                currentUserId={user?.id}
                                postUserId={post.user.userId}
                                isDetailModal={true}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
