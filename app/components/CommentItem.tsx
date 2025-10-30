"use client";

import React, {useState} from 'react';
import {Comment} from '../types/comment';
import {commentApi} from '../lib/commentApi';
import {useAuth} from '../hooks/useAuth';
import CommentForm from './CommentForm';
import {modalAlert, modalConfirm} from '../utils/alertUtils';

interface CommentItemProps {
    comment: Comment;
    postId: string;
    onCommentUpdated: (comment: Comment) => void;
    onCommentDeleted: (commentId: string) => void;
}

export default function CommentItem({
                                        comment,
                                        postId,
                                        onCommentUpdated,
                                        onCommentDeleted
                                    }: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const {user} = useAuth();

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleEditCancel = () => {
        setIsEditing(false);
    };

    const handleDelete = async () => {
        const confirmed = await modalConfirm('댓글을 삭제하시겠습니까?', 'warning');
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await commentApi.deleteComment(postId, comment.commentId);
            onCommentDeleted(comment.commentId);
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            await modalAlert('댓글 삭제에 실패했습니다.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return '방금 전';
        if (diffInMinutes < 60) return `${diffInMinutes}분 전`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}시간 전`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}일 전`;

        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isEditing) {
        return (
            <CommentForm
                postId={postId}
                onCommentAdded={() => {
                }}
                editingComment={comment}
                onEditCancel={handleEditCancel}
                onCommentUpdated={(updatedComment) => {
                    onCommentUpdated(updatedComment);
                    setIsEditing(false);
                }}
            />
        );
    }

    return (
        <div className="p-4">
            <div className="flex gap-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    {comment.user.profileUrl ? (
                        <img
                            src={comment.user.profileUrl}
                            alt={comment.user.nickname}
                            className="w-full h-full rounded-full object-cover"
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-600">
                            {comment.user.nickname.charAt(0)}
                        </span>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-gray-900">
                            {comment.user.nickname}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatDate(comment.createdAt)}
                        </span>
                        {comment.createdAt !== comment.updatedAt && (
                            <span className="text-xs text-gray-400">(수정됨)</span>
                        )}
                    </div>

                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {comment.content}
                    </p>

                    {comment.isMyComment && (
                        <div className="flex gap-3 mt-2">
                            <button
                                onClick={handleEdit}
                                className="text-xs text-gray-500 hover:text-gray-700"
                            >
                                수정
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-xs text-gray-500 hover:text-red-600 disabled:opacity-50"
                            >
                                {isDeleting ? '삭제 중...' : '삭제'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
