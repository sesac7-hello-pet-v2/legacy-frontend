import {FeedPost as FeedPostType} from "../../../types/feed";
import ImageCarousel from "./ImageCarousel";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";
import PostContent from "./PostContent";
import {useRouter} from "next/navigation";
import api from "@/app/lib/api";
import {useState} from "react";
import {useAuth} from "@/app/hooks/useAuth";

interface FeedPostProps {
    post: FeedPostType;
    currentUserId?: number;
    onPostDelete?: (postId: string) => void;
}

export default function FeedPost({post, currentUserId, onPostDelete}: FeedPostProps) {
    const router = useRouter();
    const {isAuthenticated} = useAuth();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    if (!post) {
        return null;
    }

    const imageUrls = post.imageUrls || [];

    const handleEdit = () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        router.push(`/feed/edit/${post.postId}`);
    };

    const handleDeleteClick = () => {
        if (!isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        setShowDeleteConfirm(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await api.delete(`/posts/${post.postId}`);
            setShowDeleteConfirm(false);
            onPostDelete?.(post.postId);
        } catch (error) {
            console.error("게시글 삭제 실패:", error);
            setShowDeleteConfirm(false);
            setAlertMessage("게시글 삭제에 실패했습니다.");
            setShowAlert(true);
        }
    };

    return (
        <article className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm mb-6">
            <PostHeader user={post.user} postedAt={post.postedAt}/>

            {imageUrls.length > 0 && (
                <ImageCarousel images={imageUrls}/>
            )}

            <PostActions
                postId={post.postId}
                initialLikeCount={post.likeCount}
                initialIsLiked={post.isLiked}
                currentUserId={currentUserId}
                postUserId={post.user.userId}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
            />

            <PostContent content={post.content}/>

            {/* 삭제 확인 모달 */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">게시글 삭제</h3>
                        <p className="text-gray-600 mb-6">
                            이 게시글을 삭제하시겠습니까?<br/>
                            삭제된 게시글은 복구할 수 없습니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                삭제
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 알림 모달 */}
            {showAlert && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">알림</h3>
                        <p className="text-gray-600 mb-6">{alertMessage}</p>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}
        </article>
    );
}
