export interface PostUser {
    userId: number;
    nickname: string | null;
    username: string | null;
    profileUrl: string | null;
}

export interface FeedPost {
    postId: string;
    user: PostUser;
    content: string;
    imageUrls: string[];
    postedAt: string;
    likeCount: number;
    commentCount: number;
    isLiked: boolean;
}

export interface FeedImages {
    displayOrder?: number;
    s3Key: string;
}

export interface FeedGetRequest {
    page?: number;
    size?: number;
    userId?: number;
    currentUserId?: number;
}

export interface FeedCreateRequest {
    content: string;
    images?: File[];
}

export interface PostLikeRequest {
    userId: number;
}

export interface PostLikeResponse {
    postId: string;
    isLiked: boolean;
    likeCount: number;
}
