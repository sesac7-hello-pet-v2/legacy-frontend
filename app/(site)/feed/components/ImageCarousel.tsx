"use client";

import {useEffect, useState} from "react";
import SmartImage from "@/app/components/SmartImage";

interface ImageCarouselProps {
    images: string[];
    isModal?: boolean;
}

export default function ImageCarousel({images, isModal}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([0]));
    const [isTransitioning, setIsTransitioning] = useState(false);

    // 이미지 프리로딩
    useEffect(() => {
        if (!images || images.length === 0) return;
        const preloadImage = (index: number) => {
            if (preloadedImages.has(index)) return;

            const img = new Image();
            img.onload = () => {
                setPreloadedImages(prev => new Set([...prev, index]));
            };
            img.src = images[index];
        };

        // 현재 이미지 주변 이미지들 프리로딩
        if (currentIndex < images.length - 1) {
            preloadImage(currentIndex + 1);
        }
        if (currentIndex > 0) {
            preloadImage(currentIndex - 1);
        }
    }, [currentIndex, images, preloadedImages]);

    if (!images || images.length === 0) {
        return null;
    }

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isTransitioning || currentIndex >= images.length - 1) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isTransitioning || currentIndex <= 0) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev - 1);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    const goToImage = (index: number, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (isTransitioning) return;
        setIsTransitioning(true);
        setCurrentIndex(index);
        setTimeout(() => setIsTransitioning(false), 300);
    };

    return (
        <div
            className={`relative w-full overflow-hidden ${isModal ? 'h-full bg-transparent' : 'aspect-square bg-gray-100'}`}>
            <div
                className={`flex transition-transform duration-300 ease-in-out ${isModal ? 'h-full' : 'h-full'}`}
                style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`flex-shrink-0 w-full ${isModal ? 'h-full flex items-center justify-center' : 'h-full'}`}
                    >
                        <SmartImage
                            src={image}
                            size={isModal ? "original" : "feed"}
                            alt={`Post image ${index + 1}`}
                            className={isModal ? "max-w-full max-h-full object-contain" : "w-full h-full object-cover"}
                            isModal={isModal}
                        />
                    </div>
                ))}
            </div>

            {images.length > 1 && (
                <>
                    {currentIndex > 0 && (
                        <button
                            onClick={(e) => prevImage(e)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                            ←
                        </button>
                    )}
                    {currentIndex < images.length - 1 && (
                        <button
                            onClick={(e) => nextImage(e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                        >
                            →
                        </button>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((image, index) => (
                            <button
                                key={`${image}-${index}`}
                                onClick={(e) => goToImage(index, e)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentIndex ? "bg-white" : "bg-white/50"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                        {currentIndex + 1} / {images.length}
                    </div>
                </>
            )}
        </div>
    );
}
