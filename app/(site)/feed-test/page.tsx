"use client";

import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {feedApi} from "@/app/lib/feedApi";
import {FeedPost as FeedPostType} from "../../types/feed";
import {useAuth} from "@/app/hooks/useAuth";
import GridPost from './components/GridPost';
import PostDetailModal from "../feed/components/PostDetailModal";

export default function FeedTestPage() {
    const [posts, setPosts] = useState<FeedPostType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const {user} = useAuth();

    const userParam = searchParams.get('user');
    const currentUserId = user?.id;

    // URL 파라미터에 따른 필터 상태 결정
    const showMyPosts = userParam === 'my';
    const targetUserId = userParam && userParam !== 'my' && userParam !== 'all' ? userParam : undefined;
    const filterUserId = showMyPosts ? currentUserId : targetUserId;

    const loadPosts = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await feedApi.getPosts({
                page: 1,
                size: 50, // 그리드 표시를 위해 더 많은 게시글 로드
                userId: filterUserId,
            });

            let postsData = response.content;

            // 클라이언트 사이드에서 추가 필터링
            if (filterUserId) {
                const filteredPosts = postsData.filter(post => post.user.userId === parseInt(filterUserId.toString()));
                postsData = filteredPosts;
            }

            // 이미지가 있는 게시글만 필터링
            const postsWithImages = postsData.filter(post => post.imageUrls && post.imageUrls.length > 0);

            // 디버깅 정보
            console.log('Total posts loaded:', postsData.length);
            console.log('Posts with images:', postsWithImages.length);
            console.log('Sample post:', postsWithImages[0]);

            setPosts(postsWithImages);
        } catch (err) {
            setError("게시글을 불러오는데 실패했습니다.");
            console.error("Failed to load posts:", err);
        } finally {
            setLoading(false);
        }
    }, [filterUserId]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const handlePostClick = (postId: string) => {
        setSelectedPostId(postId);
    };

    const handleCloseModal = () => {
        setSelectedPostId(null);
    };

    const handlePostDelete = (postId: string) => {
        setPosts(prev => prev.filter(post => post.postId !== postId));
        setSelectedPostId(null);
    };

    const getHeaderTitle = () => {
        if (userParam === 'my') return '내 게시글';
        if (targetUserId) return `사용자 ${targetUserId}의 게시글`;
        return '모든 게시글';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white min-h-screen">
                    <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                        <div className="px-4 py-4">
                            <h1 className="text-xl font-bold text-center">{getHeaderTitle()}</h1>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-1">
                            {Array.from({length: 9}).map((_, index) => (
                                <div key={index} className="aspect-square bg-gray-300 animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto bg-white min-h-screen">
                    <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                        <div className="px-4 py-4">
                            <h1 className="text-xl font-bold text-center">{getHeaderTitle()}</h1>
                        </div>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">{error}</p>
                        <button
                            onClick={loadPosts}
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
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto bg-white min-h-screen">
                {/* 헤더 */}
                <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                    <div className="px-4 py-4">
                        <h1 className="text-xl font-bold text-center">{getHeaderTitle()}</h1>
                        <p className="text-center text-sm text-gray-500 mt-1">
                            {posts.length}개의 게시글
                        </p>
                    </div>
                </div>

                {/* 그리드 컨텐츠 */}
                <div className="p-1">
                    {posts.length === 0 ? (
                        <div className="text-center py-16">
                            <div
                                className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">게시글이 없습니다</h3>
                            <p className="text-gray-500 text-sm">
                                {userParam === 'my'
                                    ? "아직 작성한 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!"
                                    : targetUserId
                                        ? "이 사용자가 작성한 게시글이 없습니다."
                                        : "표시할 게시글이 없습니다."
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1">
                            {posts.map((post) => (
                                <GridPost
                                    key={post.postId}
                                    post={post}
                                    onClick={handlePostClick}
                                />
                            ))}
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
            </div>
        </div>
    );
}
