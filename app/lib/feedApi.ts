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
        const response = await api.get("/posts", {params});
        return response.data;
    },

    async getPost(id: string): Promise<FeedPost> {
        const response = await api.get(`/posts/${id}`);
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

        await api.post("/posts", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },

    async deletePost(id: string): Promise<void> {
        await api.delete(`/posts/${id}`);
    },

    async likePost(id: string, data: PostLikeRequest): Promise<PostLikeResponse> {
        const response = await api.post(`/posts/${id}/like`, data);
        return response.data;
    },
};
