import {PostUser} from "../../../types/feed";
import {useRouter} from "next/navigation";

interface PostHeaderProps {
    user: PostUser;
    postedAt: string;
    currentUserId?: number;
    onEdit?: () => void;
    onDelete?: () => void;
    showActions?: boolean; // 수정/삭제 버튼 표시 여부
}

export default function PostHeader({
                                       user,
                                       postedAt,
                                       currentUserId,
                                       onEdit,
                                       onDelete,
                                       showActions = false
                                   }: PostHeaderProps) {
    const router = useRouter();
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
    const isMyPost = currentUserId && user.userId === currentUserId;

    // 사용자 클릭 핸들러 - 해당 사용자의 그리드 뷰로 이동
    const handleUserClick = () => {
        if (isMyPost) {
            router.push('/feed?user=my');
        } else {
            router.push(`/feed?user=${user.userId}`);
        }
    };

    return (
        <div className="flex items-center justify-between p-4">
            <div
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                onClick={handleUserClick}>
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
                    <p className="font-semibold text-sm hover:text-blue-600 transition-colors">{displayName}</p>
                    <p className="text-xs text-gray-500">{formatDate(postedAt)}</p>
                </div>
            </div>

            {isMyPost && showActions && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={onEdit}
                        className="text-gray-700 hover:text-blue-500 transition-colors p-1"
                        title="수정"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <button
                        onClick={onDelete}
                        className="text-gray-700 hover:text-red-500 transition-colors p-1"
                        title="삭제"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
}
