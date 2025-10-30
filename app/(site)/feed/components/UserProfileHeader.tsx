import React from 'react';
import {PostUser} from "../../../types/feed";

interface UserProfileHeaderProps {
    user: PostUser;
    postCount: number;
    isMyProfile: boolean;
}

export default function UserProfileHeader({user, postCount, isMyProfile}: UserProfileHeaderProps) {
    const displayName = user.nickname || user.username || `사용자 ${user.userId}`;
    const hasProfileImage = user.profileUrl && user.profileUrl.trim() !== '';

    return (
        <div className="bg-white border-b border-gray-200 p-6 mb-4">
            <div className="flex items-center gap-6">
                {/* 프로필 이미지 */}
                <div className="flex-shrink-0">
                    {hasProfileImage ? (
                        <img
                            src={user.profileUrl!}
                            alt={displayName}
                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}
                    <div
                        className={`w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center border-2 border-gray-200 ${hasProfileImage ? 'hidden' : ''}`}>
                        <span className="text-2xl font-medium text-gray-600">
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>

                {/* 사용자 정보 */}
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-xl font-semibold">{displayName}</h1>
                        {isMyProfile && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                                내 프로필
                            </span>
                        )}
                    </div>

                    {/* 통계 정보 */}
                    <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                            <span className="font-semibold text-gray-900">{postCount}</span>
                            <span className="text-gray-500 ml-1">게시글</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 게시글 개수가 0개일 때 추가 메시지 */}
            {postCount === 0 && (
                <div className="mt-4 text-center py-4">
                    <p className="text-gray-500 text-sm">
                        {isMyProfile
                            ? "아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!"
                            : "이 사용자는 아직 게시글을 작성하지 않았습니다."
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
