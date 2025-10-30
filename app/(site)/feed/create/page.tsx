"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import api from "@/app/lib/api";
import ImageDragDrop from "@/app/components/ImageDragDrop";
import {AlertModal} from "@/app/components/Modal";
import {useAuth} from "@/app/hooks/useAuth";
import {PendingPost, usePostStore} from "@/app/store/PostStore";

export default function CreatePostPage() {
    const router = useRouter();
    const {isAuthenticated} = useAuth();
    const {addPendingPost, setCreating} = usePostStore();
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        type: 'info' as 'info' | 'warning' | 'error' | 'success'
    });

    const handleFilesChange = (files: File[]) => {
        setSelectedFiles(files);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/auth/login");
        }
    }, [isAuthenticated, router]);

    const showModalMessage = (title: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
        setModalConfig({title, message, type});
        setShowModal(true);
    };

    // 비동기 게시글 업로드 함수
    const uploadPostAsync = async (tempId: string, content: string, files: File[]) => {
        try {
            const formData = new FormData();
            formData.append("content", content);
            files.forEach((file) => {
                formData.append("images", file);
            });

            const response = await api.post("/posts", formData);

            // 게시글 생성 성공 시에만 캐시 무효화
            if (response.status === 200 || response.status === 201) {
                try {
                    const revalidateFeed = (await import('@/app/actions/revalidate')).default;

                    // 현재 사용자 정보 가져오기
                    const {useUserStore} = await import('@/app/store/UserStore');
                    const currentUser = useUserStore.getState().user;

                    const result = await revalidateFeed({
                        userId: currentUser?.id,
                        skipIfRecentlyRevalidated: true,
                        forceRevalidate: false
                    });

                    if (result.success && !result.skipped) {
                        console.log(`✅ 캐시 무효화 성공: ${result.message}`);
                    } else if (result.skipped) {
                        console.log(`⏭️ 캐시 무효화 스킵: ${result.message}`);
                    } else {
                        console.warn('⚠️ 캐시 무효화 실패:', result.error);
                    }
                } catch (revalidateError) {
                    console.warn('캐시 무효화 중 오류:', revalidateError);
                }
            } else {
                console.warn(`게시글 생성 실패 (${response.status}), 캐시 무효화 스킵`);
            }

            // 성공 시 상태 업데이트
            usePostStore.getState().updatePendingPost(tempId, 'success');

            // 2초 후 pending 게시글 제거
            setTimeout(() => {
                usePostStore.getState().removePendingPost(tempId);
            }, 2000);

        } catch (error) {
            console.error("게시글 업로드 실패:", error);
            usePostStore.getState().updatePendingPost(tempId, 'error');
        } finally {
            setCreating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            showModalMessage("입력 오류", "내용을 입력해주세요.", "warning");
            return;
        }

        if (selectedFiles.length === 0) {
            showModalMessage("입력 오류", "최소 1개의 이미지를 업로드해주세요.", "warning");
            return;
        }

        setIsLoading(true);
        setCreating(true);

        // 임시 ID 생성
        const tempId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // 이미지 미리보기 URL 생성
        const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));

        // 즉시 pending 게시글 추가 (optimistic UI)
        const pendingPost: PendingPost = {
            tempId,
            content: content.trim(),
            imageFiles: selectedFiles,
            status: 'pending',
            createdAt: new Date(),
            previewUrls
        };

        addPendingPost(pendingPost);

        // 백그라운드에서 비동기 업로드 시작
        uploadPostAsync(tempId, content.trim(), selectedFiles);

        // 즉시 피드로 이동
        setIsLoading(false);
        showModalMessage("업로드 중", "게시글을 업로드하고 있습니다. 피드에서 진행 상황을 확인하세요.", "info");

        setTimeout(() => {
            router.push("/feed");
        }, 1500);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-gray-600 hover:text-gray-800"
                >
                    취소
                </button>
                <h1 className="text-lg font-semibold">새 게시물</h1>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !content.trim()}
                    className="text-blue-500 font-semibold disabled:text-gray-400"
                >
                    {isLoading ? "게시 중..." : "공유"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 이미지 업로드 영역 - Drag & Drop */}
                <ImageDragDrop
                    onFilesChange={handleFilesChange}
                    maxFiles={5}
                    className="mb-4"
                />

                {/* 내용 입력 */}
                <div className="space-y-2">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="문구를 입력하세요..."
                        className="w-full min-h-[120px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={1000}
                    />
                    <div className="text-right text-sm text-gray-500">
                        {content.length}/1000
                    </div>
                </div>
            </form>

            {/* Modal */}
            <AlertModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
            />
        </div>
    );
}
