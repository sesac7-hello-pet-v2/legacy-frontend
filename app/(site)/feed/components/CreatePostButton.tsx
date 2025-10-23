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

    return (
        <button
            onClick={handleClick}
            className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
            title={isAuthenticated ? "새 게시물 작성" : "로그인"}
        >
            {isAuthenticated ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            ) : (
                <div className="flex items-center gap-1 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                    </svg>
                    <span>로그인</span>
                </div>
            )}
        </button>
    );
}
