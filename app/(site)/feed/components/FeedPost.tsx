import {FeedPost as FeedPostType} from "../../../types/feed";
import ImageCarousel from "./ImageCarousel";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import {useRouter} from "next/navigation";
import api from "@/app/lib/api";

interface FeedPostProps {
    post: FeedPostType;
    currentUserId: number;
    onPostDelete?: (postId: string) => void;
}

export default function FeedPost({post, currentUserId, onPostDelete}: FeedPostProps) {
    const router = useRouter();

    if (!post) {
        return null;
    }

    const imageUrls = post.imageUrls || [];

    const handleEdit = () => {
        router.push(`/feed/edit/${post.postId}`);
    };

    const handleDelete = async () => {
        if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
            return;
        }

        try {
            await api.delete(`/api/v1/boards/${post.postId}`);
            onPostDelete?.(post.postId);
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            alert("게시글 삭제에 실패했습니다.");
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
                onDelete={handleDelete}
            />

            <PostContent content={post.content}/>
        </article>
    );
}
