"use client";

import React, {useState} from 'react';
import {Comment} from '../types/comment';
import {commentApi} from '../lib/commentApi';
import {useAuth} from '../hooks/useAuth';
import {modalAlert} from '../utils/alertUtils';

interface CommentFormProps {
    postId: string;
    onCommentAdded: (comment: Comment) => void;
    editingComment?: Comment;
    onEditCancel?: () => void;
    onCommentUpdated?: (comment: Comment) => void;
    autoFocus?: boolean;
    onFocused?: () => void;
}

export default function CommentForm({
                                        postId,
                                        onCommentAdded,
                                        editingComment,
                                        onEditCancel,
                                        onCommentUpdated,
                                        autoFocus = false,
                                        onFocused
                                    }: CommentFormProps) {
    const [content, setContent] = useState(editingComment?.content || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {user} = useAuth();
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    React.useEffect(() => {
        if (autoFocus && textareaRef.current) {
            textareaRef.current.focus();
            onFocused?.();
        }
    }, [autoFocus, onFocused]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim() || !user) return;

        setIsSubmitting(true);

        try {
            if (editingComment) {
                // 댓글 수정
                const updatedComment = await commentApi.updateComment(
                    postId,
                    editingComment.commentId,
                    {content: content.trim()}
                );
                onCommentUpdated?.(updatedComment);
                onEditCancel?.();
            } else {
                // 댓글 작성
                const newComment = await commentApi.createComment(postId, {
                    content: content.trim()
                });
                onCommentAdded(newComment);
                setContent('');
            }
        } catch (error) {
            console.error('댓글 처리 실패:', error);
            await modalAlert(editingComment ? '댓글 수정에 실패했습니다.' : '댓글 작성에 실패했습니다.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (content.trim() && !isSubmitting) {
                const form = e.currentTarget.form;
                if (form) {
                    const submitEvent = new Event('submit', {bubbles: true, cancelable: true});
                    form.dispatchEvent(submitEvent);
                }
            }
        }
    };

    const handleCancel = () => {
        if (editingComment) {
            setContent(editingComment.content);
            onEditCancel?.();
        } else {
            setContent('');
        }
    };

    if (!user) {
        return (
            <div className="p-4 bg-gray-50 text-center">
                <p className="text-gray-500 text-sm">로그인 후 댓글을 작성할 수 있습니다.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 pt-0 bg-white border-b border-gray-100">
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    {user.profileUrl ? (
                        <img
                            src={user.profileUrl}
                            alt={user.nickname}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-600">
                            {user.nickname.charAt(0)}
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={editingComment ? "댓글을 수정하세요..." : "댓글을 작성하세요... (Enter로 등록, Shift+Enter로 줄바꿈)"}
                        className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={editingComment ? 3 : 2}
                        maxLength={500}
                        disabled={isSubmitting}
                    />

                    <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                            {content.length}/500
                        </span>

                        <div className="flex gap-2">
                            {editingComment && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
                                >
                                    취소
                                </button>
                            )}

                            <button
                                type="submit"
                                disabled={!content.trim() || isSubmitting}
                                className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting
                                    ? (editingComment ? '수정 중...' : '작성 중...')
                                    : (editingComment ? '수정' : '댓글')
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
