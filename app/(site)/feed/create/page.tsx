"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import api from "@/app/lib/api";
import ImageDragDrop from "@/app/components/ImageDragDrop";
import {AlertModal} from "@/app/components/Modal";

export default function CreatePostPage() {
    const router = useRouter();
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

    const showModalMessage = (title: string, message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
        setModalConfig({title, message, type});
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            showModalMessage("입력 오류", "내용을 입력해주세요.", "warning");
            return;
        }

        setIsLoading(true);

        try {
            // board-service를 통해 이미지 업로드
            const imageUrls: string[] = [];

            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("file", file);

                // board-service의 이미지 업로드 엔드포인트 호출
                const uploadResponse = await api.post("/posts/upload-image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                imageUrls.push(uploadResponse.data.imageUrl);
            }

            // 게시글 생성
            const postData = {
                content: content.trim(),
                imageUrls,
            };

            await api.post("/posts", postData);

            showModalMessage("완료", "게시글이 성공적으로 작성되었습니다.", "success");
            setTimeout(() => {
                router.push("/feed");
            }, 1500);
        } catch (error) {
            console.error("게시글 작성 실패:", error);
            showModalMessage("오류", "게시글 작성에 실패했습니다.", "error");
        } finally {
            setIsLoading(false);
        }
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
