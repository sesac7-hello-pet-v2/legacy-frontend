"use client";

import {useState} from "react";

interface PostActionsProps {
    postId: string;
}

export default function PostActions({postId}: PostActionsProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleSave = () => {
        setIsSaved(!isSaved);
    };

    const handleComment = () => {
        console.log("Comment on post:", postId);
    };

    const handleShare = () => {
        console.log("Share post:", postId);
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleLike}
                        className={`hover:scale-110 transition-transform ${
                            isLiked ? "text-red-500" : "text-gray-700"
                        }`}
                    >
                        <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </button>
                    <button
                        onClick={handleComment}
                        className="text-gray-700 hover:scale-110 transition-transform"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                    </button>
                    <button
                        onClick={handleShare}
                        className="text-gray-700 hover:scale-110 transition-transform"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                    </button>
                </div>
                <button
                    onClick={handleSave}
                    className={`hover:scale-110 transition-transform ${
                        isSaved ? "text-gray-900" : "text-gray-700"
                    }`}
                >
                    <svg className="w-6 h-6" fill={isSaved ? "currentColor" : "none"} stroke="currentColor"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
