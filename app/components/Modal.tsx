"use client";

import React, {useEffect} from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
    closeOnBackdropClick?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
                                  isOpen,
                                  onClose,
                                  title,
                                  children,
                                  showCloseButton = true,
                                  closeOnBackdropClick = true,
                                  size = 'md'
                              }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl'
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnBackdropClick) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity"/>

            {/* Modal */}
            <div
                className={`relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all`}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="닫기"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-4">
                    {children}
                </div>
            </div>
        </div>
    );
}

// 확인/취소 버튼이 있는 확인 모달
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'info' | 'warning' | 'error' | 'success';
}

export function ConfirmModal({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 message,
                                 confirmText = '확인',
                                 cancelText = '취소',
                                 type = 'info'
                             }: ConfirmModalProps) {
    const iconColors = {
        info: 'text-blue-500',
        warning: 'text-yellow-500',
        error: 'text-red-500',
        success: 'text-green-500'
    };

    const buttonColors = {
        info: 'bg-blue-600 hover:bg-blue-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        error: 'bg-red-600 hover:bg-red-700',
        success: 'bg-green-600 hover:bg-green-700'
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="text-center">
                {/* Icon */}
                <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                    {type === 'error' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    )}
                    {type === 'warning' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    )}
                    {type === 'success' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    )}
                    {type === 'info' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    )}
                </div>

                {/* Message */}
                <div className="mb-6">
                    <p className="text-gray-700">{message}</p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors ${buttonColors[type]}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

// 알림 모달 (확인 버튼만)
interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
    buttonText?: string;
    type?: 'info' | 'warning' | 'error' | 'success';
}

export function AlertModal({
                               isOpen,
                               onClose,
                               title,
                               message,
                               buttonText = '확인',
                               type = 'info'
                           }: AlertModalProps) {
    const iconColors = {
        info: 'text-blue-500',
        warning: 'text-yellow-500',
        error: 'text-red-500',
        success: 'text-green-500'
    };

    const buttonColors = {
        info: 'bg-blue-600 hover:bg-blue-700',
        warning: 'bg-yellow-600 hover:bg-yellow-700',
        error: 'bg-red-600 hover:bg-red-700',
        success: 'bg-green-600 hover:bg-green-700'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <div className="text-center">
                {/* Icon */}
                <div className={`mx-auto flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                    {type === 'error' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    )}
                    {type === 'warning' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                    )}
                    {type === 'success' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                        </svg>
                    )}
                    {type === 'info' && (
                        <svg className={`w-6 h-6 ${iconColors[type]}`} fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    )}
                </div>

                {/* Message */}
                <div className="mb-6">
                    <p className="text-gray-700">{message}</p>
                </div>

                {/* Button */}
                <button
                    onClick={onClose}
                    className={`px-6 py-2 text-white rounded-lg transition-colors ${buttonColors[type]}`}
                >
                    {buttonText}
                </button>
            </div>
        </Modal>
    );
}
