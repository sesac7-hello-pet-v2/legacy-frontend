import {FeedPost as FeedPostType} from "../../../types/feed";
import ImageCarousel from "./ImageCarousel";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostContent from "./PostContent";

interface FeedPostProps {
    post: FeedPostType;
    currentUserId: number;
}

export default function FeedPost({post, currentUserId}: FeedPostProps) {
    if (!post) {
        return null;
    }

    const imageUrls = post.imageUrls || [];

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
            />

            <PostContent content={post.content}/>
        </article>
    );
}
