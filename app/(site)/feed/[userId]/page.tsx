"use client";

import React from "react";
import dynamic from "next/dynamic";

const UserFeed = dynamic(() => import("./components/UserFeed"), {
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
                {/* 그리드 뷰 스켈레톤 */}
                <div className="bg-white border-b border-gray-200 p-6 mb-4">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
                        <div className="flex-1">
                            <div className="w-32 h-6 bg-gray-300 rounded animate-pulse mb-3"></div>
                            <div className="flex gap-6">
                                <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                    {Array.from({length: 9}).map((_, index) => (
                        <div key={index} className="aspect-square bg-gray-300 animate-pulse rounded"></div>
                    ))}
                </div>
            </div>
        </div>
    )
});

interface UserFeedPageProps {
    params: Promise<{
        userId: string;
    }>;
}

export default function UserFeedPage({params}: UserFeedPageProps) {
    const {userId} = React.use(params);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="py-4">
                <UserFeed userId={userId}/>
            </div>
        </div>
    );
}
