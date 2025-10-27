"use client";

import ApplicationList from "@/app/components/application/ApplicationList";
// import CommentsList from "@/app/components/boards/CommentsList";
// import MyBoardsList from "@/app/components/boards/MyBoardList";
import UserDetail from "@/app/components/UserDetail";
import UserList from "@/app/components/UserList";
import { useUserStore } from "@/app/store/UserStore";
import { useState, useEffect } from "react";
import MyAnnouncementsPage from "@/app/components/MyAnnouncements";
import MyPets from "@/app/components/MyPets";
import { useRouter } from "next/navigation";
import { modalAlert } from "@/app/utils/alertUtils";

export default function MyPage() {
    const user = useUserStore((s) => s.user);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        console.log("🔍 [MyPage] user 상태:", user);
        setIsLoading(false);
        if (!user) {
            console.log("⚠️ [MyPage] 로그인되지 않음, 로그인 페이지로 이동");
            modalAlert("로그인이 필요합니다.", "warning").then(() => {
                router.push("/auth/login");
            });
        }
    }, [user, router]);

    const [myPage, setMyPage] = useState(true);
    const [roleChangedBtn, setRoleChangedBtn] = useState(false);
    // const [myBoard, setMyBoard] = useState(false);
    // const [myComment, setMyComment] = useState(false);
    const [myPets, setMyPets] = useState(false);

    if (isLoading || !user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-500">로딩 중...</p>
            </div>
        );
    }

    /* ---------------- 탭 전환 ---------------- */
    const toggle = (tab: "page" | "role" | "pets") => {
        setMyPage(tab === "page");
        setRoleChangedBtn(tab === "role");
        // setMyBoard(tab === "board");
        // setMyComment(tab === "comment");
        setMyPets(tab === "pets");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* --- 프로필 카드 --- */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <img
                            src={user?.profileUrl || "/basic_profile.jpg"}
                            alt="Profile"
                            className="h-32 w-32 rounded-full object-cover shadow-md ring-4 ring-amber-100"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.nickname}</h1>
                            <p className="text-gray-600 mb-3">{user?.email}</p>
                            <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                {user?.role === "ADMIN" ? "관리자" : user?.role === "SHELTER" ? "보호소" : "일반 사용자"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 메인 콘텐츠 영역 --- */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* 사이드 메뉴 */}
                    <nav className="lg:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
                            <button
                                onClick={() => toggle("page")}
                                className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 ${
                                    myPage
                                        ? "bg-amber-500 text-white shadow-md hover:bg-amber-600"
                                        : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                }`}
                            >
                                개인정보수정
                            </button>
                            {user?.role === "ADMIN" ? (
                                <button
                                    onClick={() => toggle("role")}
                                    className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 ${
                                        roleChangedBtn
                                            ? "bg-amber-500 text-white shadow-md hover:bg-amber-600"
                                            : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                    }`}
                                >
                                    유저목록
                                </button>
                            ) : user?.role === "SHELTER" ? (
                                <>
                                    <button
                                        onClick={() => toggle("role")}
                                        className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 ${
                                            roleChangedBtn
                                                ? "bg-amber-500 text-white shadow-md hover:bg-amber-600"
                                                : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                        }`}
                                    >
                                        공고관리
                                    </button>
                                    <button
                                        onClick={() => toggle("pets")}
                                        className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 ${
                                            myPets
                                                ? "bg-amber-500 text-white shadow-md hover:bg-amber-600"
                                                : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                        }`}
                                    >
                                        동물관리
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => toggle("role")}
                                    className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 ${
                                        roleChangedBtn
                                            ? "bg-amber-500 text-white shadow-md hover:bg-amber-600"
                                            : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                    }`}
                                >
                                    입양신청내역
                                </button>
                            )}
                            {/* <button
                                onClick={() => toggle("board")}
                                className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 ${
                                    myBoard
                                        ? "bg-amber-500 text-white shadow-md hover:bg-amber-600"
                                        : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                }`}
                            >
                                내가 쓴 게시글
                            </button>
                            <button
                                onClick={() => toggle("comment")}
                                className={`w-full rounded-xl py-3 px-4 font-semibold transition-all duration-200 ${
                                    myComment
                                        ? "bg-amber-500 text-white shadow-md hover:bg-amber-600"
                                        : "bg-gray-50 text-gray-700 hover:bg-amber-50 hover:text-amber-600"
                                }`}
                            >
                                내가 쓴 댓글
                            </button> */}
                        </div>
                    </nav>

                    {/* 컨텐츠 패널 */}
                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {myPage && <UserDetail />}
                            {roleChangedBtn &&
                                (user?.role === "ADMIN" ? (
                                    <UserList />
                                ) : user?.role === "SHELTER" ? (
                                    <MyAnnouncementsPage />
                                ) : (
                                    <ApplicationList />
                                ))}
                            {/* {myBoard && <MyBoardsList />}
                            {myComment && <CommentsList />} */}
                            {myPets && <MyPets />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
