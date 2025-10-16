export interface FeedPost {
    id: string;
    userId: number;
    content: string;
    images: FeedImages[];
    createdAt: string;
    updatedAt: string;
}

export interface FeedImages {
    displayOrder?: number;
    s3Key: string;
}

export interface FeedGetRequest {
    page?: number;
    size?: number;
    userId?: number;
}

export interface FeedCreateRequest {
    content: string;
    images?: File[];
}
