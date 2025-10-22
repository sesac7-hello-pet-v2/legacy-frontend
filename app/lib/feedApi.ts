import api from "./api";
import {FeedCreateRequest, FeedGetRequest, FeedPost, PostLikeRequest, PostLikeResponse} from "../types/feed";

interface FeedResponse {
    content: FeedPost[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

export const feedApi = {
    async getPosts(params: FeedGetRequest = {}): Promise<FeedResponse> {
        const response = await api.get("/api/posts", {params});
        return response.data;
    },

    async getPost(id: string): Promise<FeedPost> {
        const response = await api.get(`/api/posts/${id}`);
        return response.data;
    },

    async createPost(data: FeedCreateRequest): Promise<void> {
        const formData = new FormData();
        formData.append("content", data.content);

        if (data.images) {
            data.images.forEach((image) => {
                formData.append("images", image);
            });
        }

        await api.post("/api/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    async deletePost(id: string): Promise<void> {
        await api.delete(`/api/posts/${id}`);
    },

    async likePost(id: string, data: PostLikeRequest): Promise<PostLikeResponse> {
        const response = await api.post(`/api/posts/${id}/like`, data);
        return response.data;
    },
};
