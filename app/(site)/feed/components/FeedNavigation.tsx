"use client";

import {useRouter} from "next/navigation";
import {useAuth} from "@/app/hooks/useAuth";

export default function FeedNavigation() {
    const router = useRouter();
    const {user} = useAuth();

    const currentUserId = user?.id;

    return (
        <div className="w-48 flex-shrink-0">
            <div className="sticky top-20 bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => router.push('/feed')}
                        className="px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left bg-blue-500 text-white"
                    >
                        모든 게시글
                    </button>
                    <button
                        onClick={() => router.push(`/feed/${currentUserId}`)}
                        disabled={!user}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left ${
                            !user
                                ? "bg-gray-50 text-gray-400 cursor-not-allowed"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                        내 게시글
                    </button>
                </div>
            </div>
        </div>
    );
}