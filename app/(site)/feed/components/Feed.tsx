"use client";

import React, {useEffect, useState} from "react";
import {FeedPost as FeedPostType} from "../../../types/feed";
import {feedApi} from "@/app/lib/feedApi";
import FeedPost from "./FeedPost";
import {usePostStore} from "@/app/store/PostStore";
import PendingPostComponent from "./PendingPost";

export default function Feed() {
    const [posts, setPosts] = useState<FeedPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [showMyPosts, setShowMyPosts] = useState(false);
    const {pendingPosts, isCreating} = usePostStore();

    const currentUserId = 1;

    const loadPosts = async (pageNum: number = 1, reset: boolean = false) => {
        try {
            setLoading(true);
            const response = await feedApi.getPosts({
                page: pageNum,
                size: 10,
                userId: showMyPosts ? currentUserId : undefined,
            });

            let postsData = response.content;

            // 클라이언트 사이드에서 내 게시글 필터링 (API에서 지원하지 않는 경우)
            if (showMyPosts) {
                postsData = postsData.filter(post => post.userId === currentUserId);
            }

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
    };

    useEffect(() => {
        loadPosts(1, true);
    }, [showMyPosts]);

    // pending 게시글의 상태 변화 감지해서 자동 새로고침
    useEffect(() => {
        const hasSuccessfulPosts = pendingPosts.some(post => post.status === 'success');
        if (hasSuccessfulPosts) {
            // 성공한 게시글이 있으면 잠시 후 새로고침
            const refreshTimer = setTimeout(() => {
                loadPosts(1, true);
            }, 1000);

            return () => clearTimeout(refreshTimer);
        }
    }, [pendingPosts]);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1, false);
        }
    };

    const handleRefresh = () => {
        loadPosts(1, true);
    };

    const handlePostDelete = (postId: string) => {
        setPosts(prev => prev.filter(post => post.postId !== postId));
    };

    if (loading && posts.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
        );
    }

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
        <div className="max-w-md mx-auto">
            {/* 필터 버튼 */}
            <div className="px-4 mb-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowMyPosts(false)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            !showMyPosts
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        모든 게시글
                    </button>
                    <button
                        onClick={() => setShowMyPosts(true)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            showMyPosts
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        내 게시글
                    </button>
                </div>
            </div>

            {posts.length === 0 && pendingPosts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        {showMyPosts ? "작성한 게시글이 없습니다." : "게시글이 없습니다."}
                    </p>
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

                    {/* 실제 게시글들 */}
                    {posts.map((post) => (
                        <FeedPost
                            key={post.postId}
                            post={post}
                            currentUserId={currentUserId}
                            onPostDelete={handlePostDelete}
                        />
                    ))}

                    {hasMore && (
                        <div className="text-center py-4">
                            <button
                                onClick={handleLoadMore}
                                disabled={loading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? "로딩 중..." : "더 보기"}
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
        </div>
    );
}
