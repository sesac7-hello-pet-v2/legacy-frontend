"use client";

import React from 'react';
import {type ImageSize, useImageWithFallback} from '@/app/lib/imageUtils';

interface SmartImageProps {
    src: string; // 원본 S3 URL
    size?: ImageSize; // 원하는 이미지 크기
    alt: string;
    className?: string;
    fallbackClassName?: string; // 로딩/에러 상태에서 사용할 클래스
    isModal?: boolean; // 모달에서 사용되는지 여부
}

export default function SmartImage({
                                       src,
                                       size = 'feed',
                                       alt,
                                       className = '',
                                       fallbackClassName = 'bg-gray-200 animate-pulse',
                                       isModal = false
                                   }: SmartImageProps) {
    const {imageUrl, isLoading, hasError, imageKey, onError, onLoad} = useImageWithFallback(src, size);

    if (hasError) {
        return (
            <div className={`${fallbackClassName} flex items-center justify-center ${className}`}>
                <span className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</span>
            </div>
        );
    }

    if (isModal) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                {isLoading && (
                    <div className={`absolute inset-0 ${fallbackClassName}`}/>
                )}
                <img
                    key={imageKey}
                    src={imageUrl}
                    alt={alt}
                    className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                    onLoad={onLoad}
                    onError={onError}
                />
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            {/* 항상 표시되는 스켈레톤 배경 */}
            <div className={`absolute inset-0 ${fallbackClassName}`}/>

            {/* 실제 이미지 */}
            <img
                key={imageKey} // 강제 리렌더링을 위한 키
                src={imageUrl}
                alt={alt}
                className={`absolute inset-0 ${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
                onLoad={onLoad}
                onError={onError}
            />
        </div>
    );
}
