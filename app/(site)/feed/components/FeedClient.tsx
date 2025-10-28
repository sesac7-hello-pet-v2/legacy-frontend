"use client";

import React, {useEffect, useState} from "react";
import {FeedPost as FeedPostType} from "../../../types/feed";
import {feedApi} from "@/app/lib/feedApi";
import FeedPost from "./FeedPost";
import {usePostStore} from "@/app/store/PostStore";
import PendingPostComponent from "./PendingPost";
import {useAuth} from "@/app/hooks/useAuth";
import FeedSkeleton from "./FeedSkeleton";
import PostDetailModal from "./PostDetailModal";
import CreatePostButton from "./CreatePostButton";
import {useRouter} from "next/navigation";

interface FeedClientProps {
    initialPosts: FeedPostType[];
    initialPage: {
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
    };
}

export default function FeedClient({initialPosts, initialPage}: FeedClientProps) {
    const [posts, setPosts] = useState<FeedPostType[]>(initialPosts);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(initialPage.number);
    const [hasMore, setHasMore] = useState((initialPage.number + 1) < initialPage.totalPages);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [focusComment, setFocusComment] = useState(false);
    const {pendingPosts} = usePostStore();
    const {user} = useAuth();
    const router = useRouter();

    const currentUserId = user?.id;

    const loadMorePosts = React.useCallback(async (pageNum: number) => {
        try {
            setLoading(true);

            const response = await feedApi.getPosts({
                page: pageNum,
                size: 10,
                // 모든 게시글이므로 userId 파라미터 없음
            });

            const postsData = response.content;

            setPosts(prev => [...prev, ...postsData]);
            setHasMore(pageNum < response.page.totalPages);
            setPage(pageNum);
            setError(null);
        } catch (err) {
            setError("게시글을 불러오는데 실패했습니다.");
            console.error("Failed to load posts:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleRefresh = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await feedApi.getPosts({
                page: 1,
                size: 10,
            });

            setPosts(response.content);
            setPage(response.page.number);
            setHasMore((response.page.number + 1) < response.page.totalPages);
            setError(null);
        } catch (err) {
            setError("게시글을 새로고침하는데 실패했습니다.");
            console.error("Failed to refresh posts:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // pending 게시글의 상태 변화 감지해서 자동 새로고침
    useEffect(() => {
        const hasSuccessfulPosts = pendingPosts.some(post => post.status === 'success');
        if (hasSuccessfulPosts) {
            const refreshTimer = setTimeout(() => {
                handleRefresh();
            }, 1000);

            return () => clearTimeout(refreshTimer);
        }
    }, [pendingPosts, handleRefresh]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadMorePosts(page + 1);
        }
    };

    const handlePostDelete = (postId: string) => {
        setPosts(prev => prev.filter(post => post.postId !== postId));
    };

    const handlePostClick = (postId: string, shouldFocusComment = false) => {
        setSelectedPostId(postId);
        setFocusComment(shouldFocusComment);
    };

    const handleCloseModal = () => {
        setSelectedPostId(null);
        setFocusComment(false);
    };

    if (error && posts.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 mb-4">{error}</p>
                <button
                    onClick={handleRefresh}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    다시 시도
                </button>
            </div>
        );
    }

    return (
        <>
            {posts.length === 0 && pendingPosts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">게시글이 없습니다.</p>
                </div>
            ) : (
                <div>
                    {/* Pending 게시글들 먼저 표시 */}
                    {pendingPosts.map((pendingPost) => (
                        <PendingPostComponent
                            key={pendingPost.tempId}
                            post={pendingPost}
                        />
                    ))}

                    {/* 일반 피드 뷰 */}
                    <div>
                        {posts.map((post) => (
                            <FeedPost
                                key={post.postId}
                                post={post}
                                currentUserId={currentUserId}
                                onPostDelete={handlePostDelete}
                                onPostClick={handlePostClick}
                                onCommentClick={(postId) => handlePostClick(postId, true)}
                            />
                        ))}
                    </div>

                    {/* 더 보기 로딩 시 스켈레톤 표시 */}
                    {loading && posts.length > 0 && (
                        <FeedSkeleton count={2}/>
                    )}

                    {hasMore && !loading && (
                        <div className="text-center py-4">
                            <button
                                onClick={handleLoadMore}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                더 보기
                            </button>
                        </div>
                    )}

                    {!hasMore && posts.length > 0 && (
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-sm">모든 게시글을 확인했습니다.</p>
                        </div>
                    )}
                </div>
            )}

            {/* 게시글 상세 모달 */}
            {selectedPostId && (
                <PostDetailModal
                    isOpen={true}
                    postId={selectedPostId}
                    onClose={handleCloseModal}
                    onPostDelete={handlePostDelete}
                    focusComment={focusComment}
                />
            )}

            {/* 플로팅 게시물 작성 버튼 */}
            <CreatePostButton/>
        </>
    );
}
