"use client";

import React, {useEffect, useState} from "react";
import {FeedPost as FeedPostType} from "../../../types/feed";
import {feedApi} from "@/app/lib/feedApi";
import FeedPost from "./FeedPost";

export default function Feed() {
    const [posts, setPosts] = useState<FeedPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const currentUserId = 1;

    const loadPosts = async (pageNum: number = 1, reset: boolean = false) => {
        try {
            setLoading(true);
            const response = await feedApi.getPosts({
                page: pageNum,
                size: 10,
            });

            if (reset) {
                setPosts(response.content);
            } else {
                setPosts(prev => [...prev, ...response.content]);
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
    }, []);

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            loadPosts(page + 1, false);
        }
    };

    const handleRefresh = () => {
        loadPosts(1, true);
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
            {posts.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">게시글이 없습니다.</p>
                </div>
            ) : (
                <div>
                    {posts.map((post) => (
                        <FeedPost key={post.postId} post={post} currentUserId={currentUserId}/>
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
