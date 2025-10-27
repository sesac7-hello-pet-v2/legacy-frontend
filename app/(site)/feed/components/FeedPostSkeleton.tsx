export default function FeedPostSkeleton() {
    return (
        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6 animate-pulse">
            {/* 헤더 스켈레톤 */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                    {/* 프로필 이미지 스켈레톤 */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    <div>
                        {/* 사용자명 스켈레톤 */}
                        <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                        {/* 시간 스켈레톤 */}
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                </div>
                {/* 더보기 버튼 스켈레톤 */}
                <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>

            {/* 이미지 스켈레톤 */}
            <div className="w-full h-64 bg-gray-300"></div>

            {/* 액션 버튼들 스켈레톤 */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        {/* 좋아요, 댓글, 공유 버튼 */}
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                        <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    </div>
                    {/* 저장 버튼 */}
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                </div>

                {/* 좋아요 수 스켈레톤 */}
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            </div>

            {/* 콘텐츠 스켈레톤 */}
            <div className="px-4 pb-4">
                <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-full"></div>
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        </article>
    );
}