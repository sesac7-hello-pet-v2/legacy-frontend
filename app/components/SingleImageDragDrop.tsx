"use client";

import React, {useCallback, useRef, useState} from 'react';
import {AlertModal} from './Modal';

interface SingleImageDragDropProps {
    onFileChange: (file: File | null) => void;
    className?: string;
}

export default function SingleImageDragDrop({
                                                onFileChange,
                                                className = ""
                                            }: SingleImageDragDropProps) {
    const [image, setImage] = useState<{ file: File; preview: string } | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateFile = useCallback((newImage: { file: File; preview: string } | null) => {
        setImage(newImage);
        onFileChange(newImage?.file || null);
    }, [onFileChange]);

    const processFile = useCallback((file: File) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

        if (!allowedTypes.includes(file.type.toLowerCase())) {
            setModalMessage(`지원하지 않는 파일 형식입니다. JPG, JPEG, PNG 파일만 업로드 가능합니다.`);
            setShowModal(true);
            return;
        }

        // Clean up previous image URL
        if (image) {
            URL.revokeObjectURL(image.preview);
        }

        const newImage = {
            file,
            preview: URL.createObjectURL(file)
        };

        updateFile(newImage);
    }, [image, updateFile]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [processFile]);

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

        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const removeImage = useCallback(() => {
        if (image) {
            URL.revokeObjectURL(image.preview);
            updateFile(null);
        }
    }, [image, updateFile]);

    const triggerFileSelect = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Drag and Drop Zone */}
            {!image && (
                <div
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200
                        ${isDragOver
                            ? 'border-yellow-400 bg-yellow-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }
                    `}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <div className="flex flex-col items-center justify-center space-y-2">
                        <svg
                            className={`w-12 h-12 ${isDragOver ? 'text-yellow-400' : 'text-gray-400'}`}
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

                        <div className="text-gray-600">
                            <p className="text-sm font-medium">
                                이미지를 드래그하거나 클릭하여 업로드
                            </p>
                            <p className="text-xs text-gray-500">
                                JPG, JPEG, PNG (선택사항)
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Preview */}
            {image && (
                <div className="relative">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                            src={image.preview}
                            alt="Preview"
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    </div>

                    {/* Remove button */}
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-red-600 transition-colors shadow-lg"
                        aria-label="이미지 제거"
                    >
                        ×
                    </button>

                    {/* File info */}
                    <div className="mt-2 text-sm text-gray-600 text-center">
                        <p className="truncate">{image.file.name}</p>
                        <p className="text-xs text-gray-500">
                            {(image.file.size / 1024 / 1024).toFixed(2)}MB
                        </p>
                    </div>

                    {/* Change image button */}
                    <button
                        type="button"
                        onClick={triggerFileSelect}
                        className="mt-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                    >
                        다른 이미지 선택
                    </button>
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
