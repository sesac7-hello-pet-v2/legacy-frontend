import {FeedPost as FeedPostType} from "../../../types/feed";
import ImageCarousel from "./ImageCarousel";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostContent from "./PostContent";

interface FeedPostProps {
    post: FeedPostType;
}

export default function FeedPost({post}: FeedPostProps) {
    if (!post) {
        return null;
    }

    const imageUrls = post.images?.map(img => img.s3Key) || [];

    return (
        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
            <PostHeader userId={post.userId} postedAt={post.createdAt}/>

            {imageUrls.length > 0 && (
                <ImageCarousel images={imageUrls}/>
            )}

            <PostActions postId={post.id}/>

            <PostContent content={post.content}/>
        </article>
    );
}
