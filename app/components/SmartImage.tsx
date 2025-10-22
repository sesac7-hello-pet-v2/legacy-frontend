"use client";

import React from 'react';
import {type ImageSize, useImageWithFallback} from '@/app/lib/imageUtils';

interface SmartImageProps {
    src: string; // 원본 S3 URL
    size?: ImageSize; // 원하는 이미지 크기
    alt: string;
    className?: string;
    fallbackClassName?: string; // 로딩/에러 상태에서 사용할 클래스
}

export default function SmartImage({
                                       src,
                                       size = 'feed',
                                       alt,
                                       className = '',
                                       fallbackClassName = 'bg-gray-200 animate-pulse'
                                   }: SmartImageProps) {
    const {imageUrl, isLoading, hasError, onError, onLoad} = useImageWithFallback(src, size);

    if (hasError) {
        return (
            <div className={`${fallbackClassName} flex items-center justify-center ${className}`}>
                <span className="text-gray-500 text-sm">이미지를 불러올 수 없습니다</span>
            </div>
        );
    }

    return (
        <div className="relative">
            {isLoading && (
                <div className={`absolute inset-0 ${fallbackClassName} ${className}`}/>
            )}
            <img
                src={imageUrl}
                alt={alt}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
                onLoad={onLoad}
                onError={onError}
            />
        </div>
    );
}
