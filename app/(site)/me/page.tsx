"use client";

import ApplicationList from "@/app/components/application/ApplicationList";
import CommentsList from "@/app/components/boards/CommentsList";
import MyBoardsList from "@/app/components/boards/MyBoardList";
import UserDetail from "@/app/components/UserDetail";
import UserList from "@/app/components/UserList";
import { useUserStore } from "@/app/store/UserStore";
import { useState, useEffect } from "react";
import MyAnnouncementsPage from "@/app/components/MyAnnouncements";
import MyPets from "@/app/components/MyPets";
import { useRouter } from "next/navigation";

export default function MyPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 [MyPage] user 상태:", user);
    if (!user) {
      console.log("⚠️ [MyPage] 로그인되지 않음, 로그인 페이지로 이동");
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
    } else {
      setIsLoading(false);
    }
  }, [user, router]);

  const [myPage, setMyPage] = useState(true);
  const [roleChangedBtn, setRoleChangedBtn] = useState(false);
  const [myBoard, setMyBoard] = useState(false);
  const [myComment, setMyComment] = useState(false);
  const [myPets, setMyPets] = useState(false);

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-gray-500">로딩 중...</p>
      </div>
    );
  }

  /* ---------------- 탭 전환 ---------------- */
  const toggle = (tab: "page" | "role" | "board" | "comment" | "pets") => {
    setMyPage(tab === "page");
    setRoleChangedBtn(tab === "role");
    setMyBoard(tab === "board");
    setMyComment(tab === "comment");
    setMyPets(tab === "pets");
  };

  return (
    <div className="flex flex-col items-center bg-gray-50 pt-[5vh] min-h-screen">
        {/* --- 프로필 --- */}
        <img
          src={user?.profileUrl || "/basic_profile.jpg"}
          alt="Profile"
          className="h-32 w-32 rounded-full object-cover shadow"
        />
        <div className="mt-6 text-center">
          <p className="text-xl font-semibold text-gray-800">
            {user?.nickname}
          </p>
          <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
        </div>

        {/* --- 본문 영역 --- */}
        <div className="mt-12 flex w-full max-w-[960px] items-start gap-2 px-2">
          {/* 사이드 메뉴 */}
          <nav className="flex flex-col space-y-5">
            <button
              onClick={() => toggle("page")}
              className={`w-40 rounded-lg py-2 font-semibold shadow-sm transition ${
                myPage
                  ? "bg-amber-400 text-white"
                  : "bg-amber-50 text-amber-300 hover:bg-amber-100"
              }`}
            >
              개인정보수정
            </button>
            {user?.role === "ADMIN" ? (
              <button
                onClick={() => toggle("role")}
                className={`w-40 rounded-lg py-2 font-semibold shadow-sm transition ${
                  roleChangedBtn
                    ? "bg-amber-400 text-white"
                    : "bg-amber-50 text-amber-300 hover:bg-amber-100"
                }`}
              >
                유저목록
              </button>
            ) : user?.role === "SHELTER" ? (
              <>
                <button
                  onClick={() => toggle("role")}
                  className={`w-40 rounded-lg py-2 font-semibold shadow-sm transition ${
                    roleChangedBtn
                      ? "bg-amber-400 text-white"
                      : "bg-amber-50 text-amber-300 hover:bg-amber-100"
                  }`}
                >
                  공고내역
                </button>
                <button
                  onClick={() => toggle("pets")}
                  className={`w-40 rounded-lg py-2 font-semibold shadow-sm transition ${
                    myPets
                      ? "bg-amber-400 text-white"
                      : "bg-amber-50 text-amber-300 hover:bg-amber-100"
                  }`}
                >
                  동물관리
                </button>
              </>
            ) : (
              <button
                onClick={() => toggle("role")}
                className={`w-40 rounded-lg py-2 font-semibold shadow-sm transition ${
                  roleChangedBtn
                    ? "bg-amber-400 text-white"
                    : "bg-amber-50 text-amber-300 hover:bg-amber-100"
                }`}
              >
                입양신청내역
              </button>
            )}
            <button
              onClick={() => toggle("board")}
              className={`w-40 rounded-lg py-2 font-semibold shadow-sm transition ${
                myBoard
                  ? "bg-amber-400 text-white"
                  : "bg-amber-50 text-amber-300 hover:bg-amber-100"
              }`}
            >
              내가 쓴 게시글
            </button>
            <button
              onClick={() => toggle("comment")}
              className={`w-40 rounded-lg py-2 font-semibold shadow-sm transition ${
                myComment
                  ? "bg-amber-400 text-white"
                  : "bg-amber-50 text-amber-300 hover:bg-amber-100"
              }`}
            >
              내가 쓴 댓글
            </button>
          </nav>

          {/* 컨텐츠 패널 */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex-none min-w-[720px] rounded-2xl border border-gray-300 bg-white p-8 shadow-md space-y-8">
              {myPage && <UserDetail />}
              {roleChangedBtn &&
                (user?.role === "ADMIN" ? (
                  <UserList />
                ) : user?.role === "SHELTER" ? (
                  <MyAnnouncementsPage />
                ) : (
                  <ApplicationList />
                ))}
              {myBoard && <MyBoardsList />}
              {myComment && <CommentsList />}
              {myPets && <MyPets />}
            </div>
          </div>
        </div>
    </div>
  );
}
