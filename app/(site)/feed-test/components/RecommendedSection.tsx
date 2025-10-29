"use client";

import React, {useState} from 'react';

// 가짜 사용자 데이터
const recommendedUsers = [
    {
        id: 1,
        name: "멍멍이집사",
        username: "@golden_retriever_mom",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616c332e2c2?w=150&h=150&fit=crop&crop=face",
        followers: "1.2k",
        petType: "골든 리트리버",
        isFollowing: false,
    },
    {
        id: 2,
        name: "고양이왕국",
        username: "@cat_kingdom",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        followers: "856",
        petType: "페르시안 고양이",
        isFollowing: false,
    },
    {
        id: 3,
        name: "토끼애호가",
        username: "@bunny_lover",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        followers: "623",
        petType: "네덜란드 드워프",
        isFollowing: true,
    },
    {
        id: 4,
        name: "햄스터마을",
        username: "@hamster_village",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        followers: "445",
        petType: "시리안 햄스터",
        isFollowing: false,
    },
];

export default function RecommendedSection() {
    const [users, setUsers] = useState(recommendedUsers);

    const handleFollow = (userId: number) => {
        setUsers(prev => prev.map(user =>
            user.id === userId
                ? {...user, isFollowing: !user.isFollowing}
                : user
        ));
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                    추천 친구들 🐾
                </h3>
                <button className="text-blue-500 text-sm font-medium hover:text-blue-600">
                    모두 보기
                </button>
            </div>

            {/* 사용자 리스트 */}
            <div className="space-y-4">
                {users.map(user => (
                    <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {/* 아바타 */}
                            <div className="relative">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div
                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs">🐕</span>
                                </div>
                            </div>

                            {/* 사용자 정보 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900 truncate">
                                        {user.name}
                                    </p>
                                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {user.followers} 팔로워
                                    </p>
                                </div>
                                <p className="text-sm text-gray-500 truncate">
                                    {user.petType} • {user.username}
                                </p>
                            </div>
                        </div>

                        {/* 팔로우 버튼 */}
                        <button
                            onClick={() => handleFollow(user.id)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                user.isFollowing
                                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                        >
                            {user.isFollowing ? "팔로잉" : "팔로우"}
                        </button>
                    </div>
                ))}
            </div>

            {/* 더보기 버튼 */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full text-center text-blue-500 text-sm font-medium hover:text-blue-600">
                    더 많은 친구 찾기
                </button>
            </div>
        </div>
    );
}
