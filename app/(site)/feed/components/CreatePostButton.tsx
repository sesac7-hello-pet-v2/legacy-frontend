"use client";

import {useAuth} from "@/app/hooks/useAuth";
import {useRouter} from "next/navigation";

interface CreatePostButtonProps {
    isScrollToTopVisible?: boolean;
}

export default function CreatePostButton({isScrollToTopVisible = false}: CreatePostButtonProps) {
    const {isAuthenticated} = useAuth();
    const router = useRouter();

    const handleClick = () => {
        if (isAuthenticated) {
            router.push("/feed/create");
        } else {
            router.push("/auth/login");
        }
    };

    // 로그인 상태에 따른 위치 결정 (푸터를 가리지 않도록 bottom 간격 증가)
    const getPositionClass = () => {
        if (!isAuthenticated) {
            // 비로그인 시: ScrollToTop 버튼 위치에 생성 버튼 (푸터 위)
            return "bottom-20";
        } else {
            // 로그인 시: ScrollToTop 버튼이 보이면 그 위에, 안 보이면 기본 위치
            return isScrollToTopVisible ? "bottom-36" : "bottom-20";
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`fixed right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${getPositionClass()}`}
            title={isAuthenticated ? "새 게시물 작성" : "로그인하여 게시물 작성"}
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
