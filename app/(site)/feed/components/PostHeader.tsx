import {PostUser} from "../../../types/feed";

interface PostHeaderProps {
    user: PostUser;
    postedAt: string;
}

export default function PostHeader({user, postedAt}: PostHeaderProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInHours = diffInMs / (1000 * 60 * 60);
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return `${diffInMinutes}분 전`;
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}시간 전`;
        } else if (diffInDays < 7) {
            return `${Math.floor(diffInDays)}일 전`;
        } else {
            return date.toLocaleDateString("ko-KR");
        }
    };

    // 사용자 정보 fallback 처리
    const displayName = user.nickname || user.username || `사용자 ${user.userId}`;
    const hasProfileImage = user.profileUrl && user.profileUrl.trim() !== '';

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
                {hasProfileImage ? (
                    <img
                        src={user.profileUrl!}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                            // 이미지 로드 실패 시 기본 아바타로 교체
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                ) : null}
                <div
                    className={`w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ${hasProfileImage ? 'hidden' : ''}`}>
                    <span className="text-sm font-medium text-gray-600">
                        {displayName.charAt(0).toUpperCase()}
                    </span>
                </div>
                <div>
                    <p className="font-semibold text-sm">{displayName}</p>
                    <p className="text-xs text-gray-500">{formatDate(postedAt)}</p>
                </div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
            </button>
        </div>
    );
}
