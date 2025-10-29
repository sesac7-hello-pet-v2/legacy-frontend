import {
    Comment,
    CommentCreateRequest,
    CommentGetRequest,
    CommentPageResponse,
    CommentUpdateRequest
} from '../types/comment';
import api from './api';

export const commentApi = {
    // 댓글 작성
    async createComment(postId: string, request: Omit<CommentCreateRequest, 'postId'>): Promise<void> {
        await api.post(`/posts/${postId}/comments`, {
            postId,
            content: request.content
        });
    },

    // 게시글별 댓글 조회
    async getComments(postId: string, request: CommentGetRequest = {}): Promise<CommentPageResponse> {
        const response = await api.get(`/posts/${postId}/comments`, {
            params: request
        });
        return response.data;
    },

    // 댓글 수정
    async updateComment(postId: string, commentId: string, request: CommentUpdateRequest): Promise<Comment> {
        const response = await api.put(`/posts/${postId}/comments/${commentId}`, request);
        return response.data;
    },

    // 댓글 삭제
    async deleteComment(postId: string, commentId: string): Promise<void> {
        await api.delete(`/posts/${postId}/comments/${commentId}`);
    }
};
