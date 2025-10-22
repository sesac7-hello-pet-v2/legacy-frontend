import {Metadata} from "next";
import Feed from "./components/Feed";

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
                        <a
                            href="/feed/create"
                            className="text-blue-500 hover:text-blue-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="py-4">
                <Feed/>
            </div>
        </div>
    );
}
