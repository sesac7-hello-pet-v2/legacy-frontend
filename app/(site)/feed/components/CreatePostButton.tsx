"use client";

import {useAuth} from "@/app/hooks/useAuth";
import {useRouter} from "next/navigation";

export default function CreatePostButton() {
    const {isAuthenticated} = useAuth();
    const router = useRouter();

    const handleClick = () => {
        if (isAuthenticated) {
            router.push("/feed/create");
        } else {
            router.push("/auth/login");
        }
    };

    // 로그인한 사용자만 표시
    if (!isAuthenticated) {
        return null;
    }

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="새 게시물 작성"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
            </svg>
        </button>
    );
}
