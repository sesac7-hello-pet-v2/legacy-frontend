import {FeedPost as FeedPostType} from "../../../types/feed";
import ImageCarousel from "./ImageCarousel";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import {useRouter} from "next/navigation";
import api from "@/app/lib/api";
import {useAuth} from "@/app/hooks/useAuth";
import {modalAlert, modalConfirm} from "@/app/utils/alertUtils";

interface FeedPostProps {
    post: FeedPostType;
    currentUserId?: number;
    onPostDelete?: (postId: string) => void;
    onPostClick?: (postId: string) => void;
    onCommentClick?: (postId: string) => void;
}

export default function FeedPost({post, currentUserId, onPostDelete, onPostClick, onCommentClick}: FeedPostProps) {
    const router = useRouter();
    const {isAuthenticated} = useAuth();

    if (!post) {
        return null;
    }

    const imageUrls = post.imageUrls || [];

    const handleEdit = () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        router.push(`/feed/edit/${post.postId}`);
    };

    const handleDeleteClick = async () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }

        const confirmed = await modalConfirm(
            "이 게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다.",
            "warning"
        );

        if (confirmed) {
            try {
                await api.delete(`/posts/${post.postId}`);

              // 캐시 무효화
              try {
                const revalidateFeed = (await import("@/app/actions/revalidate")).default;
                await revalidateFeed({userId: currentUserId, forceRevalidate: true});
                console.log("✅ 피드 캐시 무효화 완료");
              } catch (cacheError) {
                console.warn("⚠️ 캐시 무효화 실패:", cacheError);
              }

                onPostDelete?.(post.postId);
            } catch (error) {
                console.error("게시글 삭제 실패:", error);
                await modalAlert("게시글 삭제에 실패했습니다.", "error");
            }
        }
    };

    const handlePostClick = () => {
        onPostClick?.(post.postId);
    };

    return (
        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
            <PostHeader
                user={post.user}
                postedAt={post.postedAt}
                currentUserId={currentUserId}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            {imageUrls.length > 0 && (
                <div onClick={handlePostClick} className="cursor-pointer">
                    <ImageCarousel images={imageUrls}/>
                </div>
            )}

            <PostActions
                postId={post.postId}
                initialLikeCount={post.likeCount}
                initialCommentCount={post.commentCount}
                initialIsLiked={post.isLiked}
                currentUserId={currentUserId}
                postUserId={post.user.userId}
                onCommentClick={() => onCommentClick?.(post.postId)}
            />

            <div onClick={handlePostClick} className="cursor-pointer">
                <PostContent content={post.content}/>
            </div>
        </article>
    );
}
