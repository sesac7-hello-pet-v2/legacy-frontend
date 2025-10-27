"use client";

import React, {useState} from 'react';

interface Story {
    id: string | number;
    name: string;
    avatar: string;
    isMyStory: boolean;
    hasStory: boolean;
    time: string | null;
    isViewed?: boolean;
}

// 가짜 스토리 데이터
const storiesData: Story[] = [
    {
        id: 'my-story',
        name: '내 스토리',
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
        isMyStory: true,
        hasStory: false,
        time: null,
    },
    {
        id: 1,
        name: '멍멍이집사',
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c332e2c2?w=150&h=150&fit=crop&crop=face",
        isMyStory: false,
        hasStory: true,
        time: '2시간 전',
        isViewed: false,
    },
    {
        id: 2,
        name: '고양이왕국',
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isMyStory: false,
        hasStory: true,
        time: '4시간 전',
        isViewed: true,
    },
    {
        id: 3,
        name: '토끼애호가',
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        isMyStory: false,
        hasStory: true,
        time: '6시간 전',
        isViewed: false,
    },
    {
        id: 4,
        name: '햄스터마을',
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        isMyStory: false,
        hasStory: true,
        time: '8시간 전',
        isViewed: true,
    },
    {
        id: 5,
        name: '댕댕이네',
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        isMyStory: false,
        hasStory: true,
        time: '12시간 전',
        isViewed: false,
    },
    {
        id: 6,
        name: '냥이마음',
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
        isMyStory: false,
        hasStory: true,
        time: '15시간 전',
        isViewed: true,
    },
];

export default function StoriesSection() {
    const [stories, setStories] = useState<Story[]>(storiesData);

    const handleStoryClick = (storyId: string | number) => {
        if (storyId === 'my-story') {
            // 내 스토리 클릭 - 스토리 생성 또는 보기
            console.log('My story clicked');
            return;
        }

        // 다른 사람 스토리 클릭 - 조회 상태로 변경
        setStories(prev => prev.map(story =>
            story.id === storyId
                ? {...story, isViewed: true}
                : story
        ));
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700">스토리</h3>
                <button className="text-blue-500 text-xs font-medium hover:text-blue-600">
                    모두 보기
                </button>
            </div>

            {/* 스토리 리스트 */}
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                {stories.map(story => (
                    <div
                        key={story.id}
                        onClick={() => handleStoryClick(story.id)}
                        className="flex flex-col items-center min-w-max cursor-pointer group"
                    >
                        {/* 아바타 컨테이너 */}
                        <div className="relative">
                            {/* 스토리 링 */}
                            <div
                                className={`w-16 h-16 rounded-full p-0.5 ${
                                    story.isMyStory
                                        ? 'bg-gray-300'
                                        : story.hasStory && !story.isViewed
                                            ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'
                                            : story.hasStory && story.isViewed
                                                ? 'bg-gray-300'
                                                : 'bg-gray-300'
                                }`}
                            >
                                <div className="w-full h-full bg-white rounded-full p-0.5">
                                    <img
                                        src={story.avatar}
                                        alt={story.name}
                                        className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-200"
                                    />
                                </div>
                            </div>

                            {/* 내 스토리의 + 버튼 */}
                            {story.isMyStory && !story.hasStory && (
                                <div
                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">+</span>
                                </div>
                            )}

                            {/* 온라인 상태 표시 */}
                            {!story.isMyStory && (
                                <div
                                    className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </div>

                        {/* 이름 */}
                        <span className="text-xs mt-2 truncate w-16 text-center text-gray-700">
                            {story.isMyStory ? '내 스토리' : story.name}
                        </span>

                        {/* 시간 */}
                        {story.time && (
                            <span className="text-xs text-gray-400 mt-0.5">
                                {story.time}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* 스토리 생성 제안 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">📸</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            첫 번째 스토리를 만들어보세요!
                        </p>
                        <p className="text-xs text-gray-600">
                            24시간 후 자동으로 사라져요
                        </p>
                    </div>
                    <button className="text-blue-500 text-sm font-medium hover:text-blue-600 whitespace-nowrap">
                        만들기
                    </button>
                </div>
            </div>
        </div>
    );
}
