"use client";

import React, {useCallback, useRef, useState} from 'react';
import {AlertModal} from './Modal';

interface ImageFile {
    file: File;
    preview: string;
    id: string;
}

interface ImageDragDropProps {
    onFilesChange: (files: File[]) => void;
    maxFiles?: number;
    className?: string;
}

export default function ImageDragDrop({
                                          onFilesChange,
                                          maxFiles = 5,
                                          className = ""
                                      }: ImageDragDropProps) {
    const [images, setImages] = useState<ImageFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateFiles = useCallback((newImages: ImageFile[]) => {
        setImages(newImages);
        onFilesChange(newImages.map(img => img.file));
    }, [onFilesChange]);

    const processFiles = useCallback((files: FileList | File[]) => {
        const fileArray = Array.from(files);
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const imageFiles = fileArray.filter(file => allowedTypes.includes(file.type.toLowerCase()));

        if (fileArray.length > imageFiles.length) {
            setModalMessage(`지원하지 않는 파일 형식이 포함되어 있습니다. JPG, JPEG, PNG 파일만 업로드 가능합니다.`);
            setShowModal(true);
            return;
        }

        if (images.length + imageFiles.length > maxFiles) {
            setModalMessage(`최대 ${maxFiles}개의 이미지만 업로드할 수 있습니다.`);
            setShowModal(true);
            return;
        }

        const newImages = imageFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            id: Math.random().toString(36).substr(2, 9)
        }));

        updateFiles([...images, ...newImages]);
    }, [images, maxFiles, updateFiles]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            processFiles(files);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [processFiles]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files) {
            processFiles(files);
        }
    }, [processFiles]);

    const removeImage = useCallback((id: string) => {
        const newImages = images.filter(img => {
            if (img.id === id) {
                URL.revokeObjectURL(img.preview);
                return false;
            }
            return true;
        });
        updateFiles(newImages);
    }, [images, updateFiles]);

    const triggerFileSelect = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Drag and Drop Zone */}
            <div
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                    ${isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }
                    ${images.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={images.length < maxFiles ? triggerFileSelect : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={images.length >= maxFiles}
                />

                <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                        className={`w-12 h-12 ${isDragOver ? 'text-blue-400' : 'text-gray-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>

                    {images.length >= maxFiles ? (
                        <div className="text-gray-500">
                            <p className="text-sm font-medium">최대 업로드 개수에 도달했습니다</p>
                            <p className="text-xs">({images.length}/{maxFiles})</p>
                        </div>
                    ) : (
                        <div className="text-gray-600">
                            <p className="text-sm font-medium">
                                이미지를 드래그하거나 클릭하여 업로드
                            </p>
                            <p className="text-xs text-gray-500">
                                최대 {maxFiles}개 • JPG, JPEG, PNG
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((image) => (
                        <div key={image.id} className="relative group">
                            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img
                                    src={image.preview}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>

                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => removeImage(image.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold opacity-80 hover:opacity-100 transition-opacity"
                                aria-label="이미지 제거"
                            >
                                ×
                            </button>

                            {/* File info overlay */}
                            <div
                                className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="truncate">{image.file.name}</p>
                                <p>{(image.file.size / 1024 / 1024).toFixed(1)}MB</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* File count indicator */}
            {images.length > 0 && (
                <div className="text-center text-sm text-gray-500">
                    {images.length}/{maxFiles} 이미지 선택됨
                </div>
            )}

            {/* Modal */}
            <AlertModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="알림"
                message={modalMessage}
                type="warning"
            />
        </div>
    );
}
