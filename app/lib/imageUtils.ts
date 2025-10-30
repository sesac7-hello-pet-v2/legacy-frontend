import React from 'react';

// 이미지 크기 타입 정의
export type ImageSize = 'original' | 'feed' | 'thumb';

// S3 설정 (환경변수나 설정에서 가져올 수 있음)
const S3_BASE_URL = 'https://sesac-hello-pet-image-bucket.s3.ap-northeast-2.amazonaws.com';

/**
 * 전체 S3 URL에서 S3 키만 추출
 * @param fullUrl - 전체 S3 URL (예: "https://bucket.s3.region.amazonaws.com/userId/postId/filename.jpg")
 * @returns S3 키 (예: "userId/postId/filename.jpg")
 */
export const extractS3Key = (fullUrl: string): string => {
    const url = new URL(fullUrl);
    return url.pathname.substring(1); // 맨 앞의 '/' 제거
};

/**
 * S3 키를 기반으로 리사이징된 이미지 키를 생성
 * @param originalKey - 원본 S3 키 (예: "userId/postId/filename.jpg")
 * @param size - 이미지 크기 ("feed", "thumb", "original")
 * @returns 리사이징된 이미지 키
 */
export const generateImageKey = (originalKey: string, size: ImageSize): string => {
    if (size === 'original') {
        return originalKey;
    }

    const lastDotIndex = originalKey.lastIndexOf('.');
    if (lastDotIndex > 0) {
        const baseName = originalKey.substring(0, lastDotIndex);
        const extension = originalKey.substring(lastDotIndex);
        return `${baseName}_${size}${extension}`;
    }

    return `${originalKey}_${size}`;
};

/**
 * 전체 S3 URL을 받아서 리사이징된 버전의 URL을 생성
 * @param originalUrl - 원본 S3 URL
 * @param size - 원하는 이미지 크기
 * @returns 리사이징된 이미지 URL
 */
export const getResizedImageUrl = (originalUrl: string, size: ImageSize = 'original'): string => {
    if (size === 'original') {
        return originalUrl;
    }

    const s3Key = extractS3Key(originalUrl);
    const resizedKey = generateImageKey(s3Key, size);
    return `${S3_BASE_URL}/${resizedKey}`;
};

/**
 * S3 키를 기반으로 이미지 URL을 생성 (하위 호환성)
 * @param s3Key - S3 키
 * @param size - 원하는 이미지 크기
 * @returns 이미지 URL
 */
export const getImageUrl = (s3Key: string, size: ImageSize = 'original'): string => {
    const imageKey = generateImageKey(s3Key, size);
    return `${S3_BASE_URL}/${imageKey}`;
};

/**
 * 폴백 기능이 있는 이미지 컴포넌트 훅
 * 리사이징된 이미지가 없으면 자동으로 원본으로 폴백
 */
export const useImageWithFallback = (originalUrl: string, preferredSize: ImageSize = 'feed') => {
    const [currentSize, setCurrentSize] = React.useState<ImageSize>(preferredSize);
    const [isLoading, setIsLoading] = React.useState(true);
    const [hasError, setHasError] = React.useState(false);
    const [imageKey, setImageKey] = React.useState(0); // 강제 리렌더링용

    const imageUrl = React.useMemo(() => getResizedImageUrl(originalUrl, currentSize), [originalUrl, currentSize]);

    const handleError = React.useCallback(() => {
        if (currentSize !== 'original') {
            // 리사이징된 이미지 로드 실패 시 원본으로 폴백
            setCurrentSize('original');
            setHasError(false);
            setIsLoading(true);
            setImageKey(prev => prev + 1); // 강제 리렌더링
        } else {
            // 원본도 실패하면 에러 상태로 설정
            setHasError(true);
            setIsLoading(false);
        }
    }, [currentSize, imageUrl, originalUrl]);

    const handleLoad = React.useCallback(() => {
        setIsLoading(false);
        setHasError(false);
    }, [currentSize, imageUrl]);

    // originalUrl이나 preferredSize가 변경되면 초기화
    React.useEffect(() => {
        setCurrentSize(preferredSize);
        setIsLoading(true);
        setHasError(false);
        setImageKey(prev => prev + 1);
    }, [originalUrl, preferredSize]);

    return {
        imageUrl,
        isLoading,
        hasError,
        currentSize,
        imageKey, // 강제 리렌더링용 키 추가
        onError: handleError,
        onLoad: handleLoad,
    };
};
