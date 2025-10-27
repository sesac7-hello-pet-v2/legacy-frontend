import FeedPostSkeleton from "./FeedPostSkeleton";

interface FeedSkeletonProps {
    count?: number;
}

export default function FeedSkeleton({count = 3}: FeedSkeletonProps) {
    return (
        <div className="space-y-6">
            {Array.from({length: count}, (_, index) => (
                <FeedPostSkeleton key={index}/>
            ))}
        </div>
    );
}
