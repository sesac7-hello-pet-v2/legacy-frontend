"use client";

import React from 'react';
import {AlertModal, ConfirmModal} from '@/app/components/Modal';
import {createRoot} from 'react-dom/client';

interface AlertOptions {
    title?: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    buttonText?: string;
}

interface ConfirmOptions {
    title?: string;
    message: string;
    type?: 'info' | 'warning' | 'error' | 'success';
    confirmText?: string;
    cancelText?: string;
}

/**
 * alert() 대신 사용할 모달 알림 함수
 */
export function showAlert(options: AlertOptions): Promise<void> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            console.log(`[Alert] ${options.message}`);
            resolve();
            return;
        }

        const container = document.createElement('div');
        document.body.appendChild(container);

        const root = createRoot(container);

        const handleClose = () => {
            root.unmount();
            document.body.removeChild(container);
            resolve();
        };

        root.render(
            <AlertModal
                isOpen={true}
                onClose={handleClose}
                title={options.title}
                message={options.message}
                type={options.type || 'info'}
                buttonText={options.buttonText}
            />
        );
    });
}

/**
 * confirm() 대신 사용할 모달 확인 함수
 */
export function showConfirm(options: ConfirmOptions): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            console.log(`[Confirm] ${options.message}`);
            resolve(false);
            return;
        }

        const container = document.createElement('div');
        document.body.appendChild(container);

        const root = createRoot(container);

        const handleClose = () => {
            root.unmount();
            document.body.removeChild(container);
            resolve(false);
        };

        const handleConfirm = () => {
            root.unmount();
            document.body.removeChild(container);
            resolve(true);
        };

        root.render(
            <ConfirmModal
                isOpen={true}
                onClose={handleClose}
                onConfirm={handleConfirm}
                title={options.title}
                message={options.message}
                type={options.type || 'info'}
                confirmText={options.confirmText}
                cancelText={options.cancelText}
            />
        );
    });
}

/**
 * alert() 함수를 대체하는 간단한 래퍼
 */
export function modalAlert(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info'): Promise<void> {
    return showAlert({message, type});
}

/**
 * confirm() 함수를 대체하는 간단한 래퍼
 */
export function modalConfirm(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'warning'): Promise<boolean> {
    return showConfirm({message, type});
}
