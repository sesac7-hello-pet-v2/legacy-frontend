import {Metadata} from "next";
import Feed from "./components/Feed";
import CreatePostButton from "./components/CreatePostButton";

export const metadata: Metadata = {
    title: "피드 | Hello Pet",
    description: "반려동물 소셜 피드",
};

export default function FeedPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
                <div className="max-w-md mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">피드</h1>
                        <CreatePostButton/>
                    </div>
                </div>
            </div>

            <div className="py-4">
                <Feed/>
            </div>
        </div>
    );
}
