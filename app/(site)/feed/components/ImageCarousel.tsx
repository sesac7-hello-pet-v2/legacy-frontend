"use client";

import {useState} from "react";

interface ImageCarouselProps {
    images: string[];
}

export default function ImageCarousel({images}: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full aspect-square bg-gray-100">
            <img
                src={images[currentIndex]}
                alt={`Post image ${currentIndex + 1}`}
                className="w-full h-full object-cover"
            />

            {images.length > 1 && (
                <>
                    <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                        ←
                    </button>
                    <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                        →
                    </button>

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((image, index) => (
                            <button
                                key={`${image}-${index}`}
                                onClick={() => goToImage(index)}
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
