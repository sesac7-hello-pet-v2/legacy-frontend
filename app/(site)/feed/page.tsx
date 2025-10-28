"use client";

import dynamic from "next/dynamic";
import CreatePostButton from "./components/CreatePostButton";

const Feed = dynamic(() => import("./components/Feed"), {
    ssr: false,
    loading: () => (
        <div className="max-w-4xl mx-auto flex gap-4">
            <div className="w-48 flex-shrink-0">
                <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col gap-2">
                        <div className="px-4 py-3 rounded-lg bg-gray-100 animate-pulse h-12"></div>
                        <div className="px-4 py-3 rounded-lg bg-gray-100 animate-pulse h-12"></div>
                    </div>
                </div>
            </div>
            <div className="flex-1 max-w-md">
                <div className="space-y-4">
                    {Array.from({length: 3}).map((_, i) => (
                        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                            <div className="h-40 bg-gray-200 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
});

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
