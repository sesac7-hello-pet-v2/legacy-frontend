import {create} from 'zustand';

interface PostCreationState {
    isCreating: boolean;
    pendingPosts: PendingPost[];
    addPendingPost: (post: PendingPost) => void;
    removePendingPost: (tempId: string) => void;
    updatePendingPost: (tempId: string, status: 'success' | 'error') => void;
    setCreating: (creating: boolean) => void;
}

export interface PendingPost {
    tempId: string;
    content: string;
    imageFiles: File[];
    status: 'pending' | 'success' | 'error';
    createdAt: Date;
    previewUrls: string[];
}

export const usePostStore = create<PostCreationState>((set) => ({
    isCreating: false,
    pendingPosts: [],

    addPendingPost: (post) => set((state) => ({
        pendingPosts: [post, ...state.pendingPosts]
    })),

    removePendingPost: (tempId) => set((state) => ({
        pendingPosts: state.pendingPosts.filter(p => p.tempId !== tempId)
    })),

    updatePendingPost: (tempId, status) => set((state) => ({
        pendingPosts: state.pendingPosts.map(p =>
            p.tempId === tempId ? {...p, status} : p
        )
    })),

    setCreating: (creating) => set({isCreating: creating})
}));
