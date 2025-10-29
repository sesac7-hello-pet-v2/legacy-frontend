"use client";

import React, {useEffect, useState} from 'react';
import {FeedPost as FeedPostType} from "../../../../types/feed";
import {feedApi} from "@/app/lib/feedApi";
import {useAuth} from "@/app/hooks/useAuth";
import {useRouter} from "next/navigation";
import {usePostStore} from "@/app/store/PostStore";
import UserProfileHeader from "../../components/UserProfileHeader";
import PostDetailModal from "../../components/PostDetailModal";
import PendingPostComponent from "../../components/PendingPost";
import GridPost from "../../components/GridPost";
import CreatePostButton from "../../components/CreatePostButton";
import ScrollToTopButton from "../../components/ScrollToTopButton";

interface UserFeedProps {
    userId: string;
}

export default function UserFeed({userId}: UserFeedProps) {
    const [posts, setPosts] = useState<FeedPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [isScrollToTopVisible, setIsScrollToTopVisible] = useState(false);
    const {pendingPosts} = usePostStore();
    const {user} = useAuth();
    const router = useRouter();

    const currentUserId = user?.id;
    const targetUserId = parseInt(userId);
    const isMyProfile = currentUserId === targetUserId;

    const loadPosts = React.useCallback(async (pageNum: number = 1, reset: boolean = false) => {
        try {
            setLoading(true);

            const response = await feedApi.getPosts({
                page: pageNum,
                size: 30, // 그리드 뷰용 더 많은 게시글 로드
                userId: targetUserId,
            });

            const postsData = response.content;

            if (reset) {
                setPosts(postsData);
            } else {
                setPosts(prev => [...prev, ...postsData]);
            }

            setHasMore(pageNum < response.page.totalPages);
            setPage(pageNum);
            setError(null);
        } catch (err) {
            setError("게시글을 불러오는데 실패했습니다.");
            console.error("Failed to load posts:", err);
        } finally {
            setLoading(false);
        }
    }, [targetUserId]);

    useEffect(() => {
        // 새로운 사용자로 전환 시 데이터 초기화
        setPosts([]);
        setPage(0);
        setHasMore(true);
        loadPosts(1, true);
    }, [loadPosts]);

    // pending 게시글의 상태 변화 감지해서 자동 새로고침 (내 프로필일 때만)
    useEffect(() => {
        if (isMyProfile) {
            const hasSuccessfulPosts = pendingPosts.some(post => post.status === 'success');
            if (hasSuccessfulPosts) {
                const refreshTimer = setTimeout(() => {
                    loadPosts(1, true);
                }, 1000);

                return () => clearTimeout(refreshTimer);
            }
        }
    }, [pendingPosts, loadPosts, isMyProfile]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1, false);
        }
    };

    // 무한 스크롤 처리
    useEffect(() => {
        const handleScroll = () => {
            const {scrollTop, scrollHeight, clientHeight} = document.documentElement;

            // 스크롤이 바닥에서 200px 이내에 도달했을 때 다음 페이지 로드
            if (scrollHeight - scrollTop <= clientHeight + 200) {
                if (!loading && hasMore) {
                    loadPosts(page + 1, false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore, page, loadPosts]);

    const handleRefresh = () => {
        loadPosts(1, true);
    };

    const handlePostDelete = (postId: string) => {
        setPosts(prev => prev.filter(post => post.postId !== postId));
    };

    const handlePostClick = (postId: string) => {
        setSelectedPostId(postId);
    };

    const handleCloseModal = () => {
        setSelectedPostId(null);
    };

    if (loading && posts.length === 0) {
        return (
            <div className="max-w-4xl mx-auto flex gap-4">
                {/* 왼쪽 사이드바 */}
                <div className="w-48 flex-shrink-0">
                    <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => router.push('/feed')}
                                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left bg-gray-50 text-gray-700 hover:bg-gray-100"
                            >
                                모든 게시글
                            </button>
                            <button
                                onClick={() => router.push(`/feed/${currentUserId}`)}
                                disabled={!user}
                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                                    isMyProfile
                                        ? "bg-blue-500 text-white"
                                        : !user
                                            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                내 게시글
                            </button>
                        </div>
                    </div>
                </div>
                {/* 그리드 스켈레톤 */}
                <div className="flex-1 max-w-md">
                    <div className="bg-white border-b border-gray-200 p-6 mb-4">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <div className="w-32 h-6 bg-gray-300 rounded animate-pulse mb-3"></div>
                                <div className="flex gap-6">
                                    <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                        {Array.from({length: 9}).map((_, index) => (
                            <div key={index} className="aspect-square bg-gray-300 animate-pulse rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error && posts.length === 0) {
        return (
            <div className="max-w-4xl mx-auto flex gap-4">
                <div className="w-48 flex-shrink-0">
                    <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => router.push('/feed')}
                                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left bg-gray-50 text-gray-700 hover:bg-gray-100"
                            >
                                모든 게시글
                            </button>
                            <button
                                onClick={() => router.push(`/feed/${currentUserId}`)}
                                disabled={!user}
                                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                                    isMyProfile
                                        ? "bg-blue-500 text-white"
                                        : !user
                                            ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                내 게시글
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 max-w-md">
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            다시 시도
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto flex gap-4">
            {/* 왼쪽 사이드바 - 필터 버튼 */}
            <div className="w-48 flex-shrink-0">
                <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => router.push('/feed')}
                            className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left bg-gray-50 text-gray-700 hover:bg-gray-100"
                        >
                            모든 게시글
                        </button>
                        <button
                            onClick={() => router.push(`/feed/${currentUserId}`)}
                            disabled={!user}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                                isMyProfile
                                    ? "bg-blue-500 text-white"
                                    : !user
                                        ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            내 게시글
                        </button>
                    </div>
                </div>
            </div>

            {/* 오른쪽 메인 콘텐츠 */}
            <div className="flex-1 max-w-md min-h-screen">
                {posts.length === 0 && pendingPosts.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">
                            {isMyProfile
                                ? "작성한 게시글이 없습니다."
                                : "해당 사용자의 게시글이 없습니다."
                            }
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Pending 게시글들 먼저 표시 (내 프로필일 때만) */}
                        {isMyProfile && pendingPosts.map((pendingPost) => (
                            <PendingPostComponent
                                key={pendingPost.tempId}
                                post={pendingPost}
                            />
                        ))}

                        {/* 사용자 프로필 헤더 - 고정 */}
                        {posts.length > 0 && (
                            <div className="bg-white sticky top-16 z-10 border-b border-gray-200">
                                <UserProfileHeader
                                    user={posts[0].user}
                                    postCount={posts.length}
                                    isMyProfile={isMyProfile}
                                />
                            </div>
                        )}

                        {/* 그리드 뷰 - 스크롤 가능 */}
                        <div className="bg-white">
                            <div className="grid grid-cols-3 gap-1">
                                {posts.map((post) => (
                                    <GridPost
                                        key={post.postId}
                                        post={post}
                                        onClick={handlePostClick}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* 무한 스크롤 로딩 시 스켈레톤 표시 */}
                        {loading && posts.length > 0 && (
                            <div className="grid grid-cols-3 gap-1 mt-1">
                                {Array.from({length: 6}).map((_, index) => (
                                    <div key={index} className="aspect-square bg-gray-300 animate-pulse rounded"></div>
                                ))}
                            </div>
                        )}

                        {/* 모든 게시글 로드 완료 표시 */}
                        {!hasMore && posts.length > 0 && (
                            <div className="text-center py-8 mb-16">
                                <p className="text-gray-500 text-sm">모든 게시글을 확인했습니다.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 게시글 상세 모달 */}
            {selectedPostId && (
                <PostDetailModal
                    isOpen={true}
                    postId={selectedPostId}
                    onClose={handleCloseModal}
                    onPostDelete={handlePostDelete}
                />
            )}

            {/* 플로팅 버튼들 */}
            <CreatePostButton isScrollToTopVisible={isScrollToTopVisible}/>
            <ScrollToTopButton onVisibilityChange={setIsScrollToTopVisible}/>
        </div>
    );
}
