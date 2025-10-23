import {FeedPost as FeedPostType} from "../../../types/feed";
import ImageCarousel from "./ImageCarousel";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import {useRouter} from "next/navigation";
import api from "@/app/lib/api";
import {useState} from "react";

interface FeedPostProps {
    post: FeedPostType;
    currentUserId: number;
    onPostDelete?: (postId: string) => void;
}

export default function FeedPost({post, currentUserId, onPostDelete}: FeedPostProps) {
    const router = useRouter();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    if (!post) {
        return null;
    }

    const imageUrls = post.imageUrls || [];

    const handleEdit = () => {
        router.push(`/feed/edit/${post.postId}`);
    };

    const handleDeleteClick = () => {
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/v1/posts/${post.postId}`);
            onPostDelete?.(post.postId);
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            setAlertMessage("게시글 삭제에 실패했습니다.");
            setShowAlert(true);
        }
    };

    return (
        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
            <PostHeader userId={post.userId} postedAt={post.postedAt}/>

            {imageUrls.length > 0 && (
                <ImageCarousel images={imageUrls}/>
            )}

            <PostActions
                postId={post.postId}
                initialLikeCount={post.likeCount}
                currentUserId={currentUserId}
                postUserId={post.userId}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <PostContent content={post.content}/>
        </article>
    );
}
