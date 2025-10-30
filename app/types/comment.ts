export interface Comment {
    commentId: string;
    postId: string;
    user: {
        userId: number;
        nickname: string;
        username: string;
        profileUrl: string | null;
    };
    content: string;
    createdAt: string;
    updatedAt: string;
    isMyComment: boolean;
}

export interface CommentCreateRequest {
    postId: string;
    content: string;
}

export interface CommentUpdateRequest {
    content: string;
}

export interface CommentGetRequest {
    page?: number;
    size?: number;
}

export interface CommentPageResponse {
    content: Comment[];
    page: {
        totalPages: number;
        totalElements: number;
        size: number;
        number: number;
    };
}