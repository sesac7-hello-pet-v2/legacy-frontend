"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import api from "@/app/lib/api";
import {useAuth} from "@/app/hooks/useAuth";

interface PostData {
    postId: string;
    content: string;
    imageUrls: string[];
    userId: number;
}

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;
    const {isAuthenticated} = useAuth();

    const [post, setPost] = useState<PostData | null>(null);
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        fetchPost();
    }, [postId, isAuthenticated, router]);

    const fetchPost = async () => {
        try {
            const response = await api.get(`/api/v1/boards/${postId}`);
            const postData = response.data;
            setPost(postData);
            setContent(postData.content || "");
        } catch (error) {
            console.error("게시글 조회 실패:", error);
            alert("게시글을 불러올 수 없습니다.");
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        setIsSaving(true);

        try {
            await api.put(`/api/v1/boards/${postId}`, {
                content: content.trim(),
            });

            router.push("/feed");
        } catch (error) {
            console.error("게시글 수정 실패:", error);
            alert("게시글 수정에 실패했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-md mx-auto p-4">
                <div className="text-center">로딩 중...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-md mx-auto p-4">
                <div className="text-center">게시글을 찾을 수 없습니다.</div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-800"
                >
                    취소
                </button>
                <h1 className="text-lg font-semibold">게시물 수정</h1>
                <button
                    onClick={handleSave}
                    disabled={isSaving || !content.trim()}
                    className="text-blue-500 font-semibold disabled:text-gray-400"
                >
                    {isSaving ? "저장 중..." : "완료"}
                </button>
            </div>

            {/* 기존 이미지 표시 */}
            {post.imageUrls && post.imageUrls.length > 0 && (
                <div className="mb-4">
                    <div className="grid grid-cols-3 gap-2">
                        {post.imageUrls.map((imageUrl, index) => (
                            <div key={index} className="aspect-square">
                                <img
                                    src={imageUrl}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        * 이미지는 수정할 수 없습니다. 필요시 게시글을 삭제하고 다시 작성해주세요.
                    </p>
                </div>
            )}

            {/* 내용 수정 */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="문구를 입력하세요..."
                className="w-full min-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={1000}
            />

            <div className="text-right text-sm text-gray-500 mt-2">
                {content.length}/1000
            </div>
        </div>
    );
}
