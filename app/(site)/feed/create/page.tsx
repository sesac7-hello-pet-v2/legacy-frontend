"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import api from "@/app/lib/api";

export default function CreatePostPage() {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (files.length + selectedFiles.length > 5) {
            alert("최대 5개의 이미지만 업로드할 수 있습니다.");
            return;
        }

        setSelectedFiles(prev => [...prev, ...files]);

        // 미리보기 생성
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviews(prev => [...prev, e.target?.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        setIsLoading(true);

        try {
            // 이미지 업로드
            const imageUrls: string[] = [];

            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("userId", "1"); // TODO: 실제 사용자 ID로 변경
                formData.append("postId", Date.now().toString()); // 임시 postId

                const uploadResponse = await api.post("/api/v1/images/upload", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                imageUrls.push(uploadResponse.data.s3Key);
            }

            // 게시글 생성
            const postData = {
                content: content.trim(),
                imageUrls,
                userId: 1, // TODO: 실제 사용자 ID로 변경
            };

            await api.post("/api/v1/boards", postData);

            router.push("/feed");
        } catch (error) {
            console.error("게시글 작성 실패:", error);
            alert("게시글 작성에 실패했습니다.");
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

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 이미지 업로드 영역 */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="cursor-pointer flex flex-col items-center justify-center text-gray-500"
                    >
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                        </svg>
                        <span>사진/동영상 추가</span>
                    </label>
                </div>

                {/* 이미지 미리보기 */}
                {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative aspect-square">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 내용 입력 */}
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
            </form>
        </div>
    );
}
