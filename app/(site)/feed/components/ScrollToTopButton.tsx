"use client";

import {useEffect, useState} from "react";
import {useAuth} from "@/app/hooks/useAuth";

interface ScrollToTopButtonProps {
    onVisibilityChange?: (isVisible: boolean) => void;
}

export default function ScrollToTopButton({onVisibilityChange}: ScrollToTopButtonProps) {
    const [isVisible, setIsVisible] = useState(false);
    const {isAuthenticated} = useAuth();

    useEffect(() => {
        const toggleVisibility = () => {
            const shouldShow = window.pageYOffset > 300;
            setIsVisible(shouldShow);
            onVisibilityChange?.(shouldShow);
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, [onVisibilityChange]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 로그인 상태에 따른 위치 결정 (푸터를 가리지 않도록 bottom 간격 증가)
    const getPositionClass = () => {
        if (!isAuthenticated) {
            // 비로그인 시: 숨김 (CreatePostButton이 이 위치에 있음)
            return "hidden";
        } else {
            // 로그인 시: 하단에 표시 (푸터 위)
            return "bottom-20";
        }
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className={`fixed right-6 z-40 w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${getPositionClass()}`}
            title="맨 위로 이동"
        >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18"/>
            </svg>
        </button>
    );
}
