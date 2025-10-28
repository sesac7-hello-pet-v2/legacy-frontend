import {Metadata} from "next";
import {getPostsSSR} from "@/app/lib/feedApi.server";
import FeedNavigation from "./components/FeedNavigation";
import FeedClient from "./components/FeedClient";

export const metadata: Metadata = {
    title: "피드 | Hello Pet",
    description: "반려동물 소셜 피드",
};

export default async function FeedPage() {
    // 서버에서 초기 데이터 가져오기
    const initialData = await getPostsSSR({
        page: 1,
        size: 10,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-md mx-auto px-4 py-3">
                    <h1 className="text-xl font-bold">피드</h1>
                </div>
            </div>

            <div className="py-4">
                <div className="max-w-4xl mx-auto flex gap-4">
                    {/* 왼쪽 사이드바 - 클라이언트 컴포넌트 */}
                    <FeedNavigation/>

                    {/* 오른쪽 메인 콘텐츠 */}
                    <div className="flex-1 max-w-md min-h-screen relative">
                        <FeedClient
                            initialPosts={initialData.content}
                            initialPage={initialData.page}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
