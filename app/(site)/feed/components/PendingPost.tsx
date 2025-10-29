"use client";

import {PendingPost} from "@/app/store/PostStore";

interface PendingPostProps {
    post: PendingPost;
}

export default function PendingPostComponent({post}: PendingPostProps) {
    const getStatusIcon = () => {
        switch (post.status) {
            case 'pending':
                return (
                    <div className="flex items-center text-yellow-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"/>
                        업로드 중...
                    </div>
                );
            case 'success':
                return (
                    <div className="flex items-center text-green-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"/>
                        </svg>
                        업로드 완료
                    </div>
                );
            case 'error':
                return (
                    <div className="flex items-center text-red-600">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"/>
                        </svg>
                        업로드 실패
                    </div>
                );
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border mb-4 p-4 ${
            post.status === 'pending' ? 'opacity-75' :
                post.status === 'error' ? 'border-red-200' : 'border-green-200'
        }`}>
            {/* 상태 표시 */}
            <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-medium">내 게시글</div>
                <div className="text-xs">
                    {getStatusIcon()}
                </div>
            </div>

            {/* 이미지 표시 */}
            {post.previewUrls.length > 0 && (
                <div className="mb-3">
                    {post.previewUrls.length === 1 ? (
                        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={post.previewUrls[0]}
                                alt="Preview"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <div className="grid grid-cols-2 gap-1 h-full p-1">
                                {post.previewUrls.slice(0, 4).map((url, index) => (
                                    <div key={index} className="relative bg-gray-200 rounded overflow-hidden">
                                        <img
                                            src={url}
                                            alt={`Preview ${index + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        {index === 3 && post.previewUrls.length > 4 && (
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    +{post.previewUrls.length - 4}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 내용 */}
            <div className="text-sm text-gray-800 mb-3">
                {post.content}
            </div>

            {/* 시간 */}
            <div className="text-xs text-gray-500">
                {post.createdAt.toLocaleString()}
            </div>

            {/* 에러 시 재시도 버튼 */}
            {post.status === 'error' && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <button
                        onClick={() => {
                            // 재시도 로직 구현 가능
                            console.log('재시도:', post.tempId);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                    >
                        다시 시도
                    </button>
                </div>
            )}
        </div>
    );
}
