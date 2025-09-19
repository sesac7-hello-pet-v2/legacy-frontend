"use client";

import api from "@/app/lib/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BoardResponse, Comment } from "@/app/lib/boardTypes";
import { categories, petTypes } from "@/app/lib/boardConstants";
import { changeResponse } from "@/app/lib/boardUtils";
import { useUserStore } from "@/app/store/UserStore";
import Pagination from "@/app/components/Pagination";

export default function BoardDetail() {
  const router = useRouter();
  const { id } = useParams();
  const user = useUserStore((s) => s.user);
  const [board, setBoard] = useState<BoardResponse | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likecounts, setLikecounts] = useState<number>(0);
  const [liked, setLiked] = useState(true);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");

  //////////////
  const searchParams = useSearchParams();
  const pageStr = searchParams.get("page") ?? "1";
  const currentPage = parseInt(pageStr, 10);

  // 한 페이지에 보여줄 댓글 수
  const commentsPerPage = 5;

  // 총 페이지 수 계산
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // 현재 페이지에 보여줄 댓글들만 추출
  const pagedComments = comments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  ///////
  useEffect(() => {
    getBoardDetail();
  }, [id]);

  useEffect(() => {
    if (board) {
      setLikecounts(board?.likesCount);
    }
  }, [board]);

  async function getBoardDetail() {
    if (!id) return;
    try {
      console.log("board", board?.email);
      console.log("USER", user?.email);

      setLoading(true);
      const res = await api.get(`/boards/${id}`);
      console.log("res data", res.data);
      setBoard(res.data.boardResponse ?? null);
      // 여기서 댓글을 createdAt 기준으로 정렬해서 setComments
      const sortedComments = (res.data.commentList ?? []).sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setComments(sortedComments);
      console.log("comment", res.data.commentList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>로딩중...</div>;
  if (!id) return <div>게시글을 찾을 수 없습니다.</div>;

  async function handleLike() {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikecounts((prev) => prev + (!newLiked ? +1 : -1));
    try {
      await api.put(`/boards/${id}/like`);
    } catch (err) {
      console.error("좋아요 실패", err);
      setLikecounts((prev) => prev + (!newLiked ? +1 : -1));
    }
  }

  async function handleComment(value: string) {
    setValue(value);
    try {
      await api.post(`/boards/${id}/comments`, { content: value });
      setValue("");
      getBoardDetail();
    } catch (err) {
      console.error("댓글이 정상적으로 등록되지 않았습니다.", err);
    }
  }

  async function boardUpdate() {
    try {
      if (!board) return;

      const queryString = new URLSearchParams({
        title: board.title,
        content: board.content,
        img_url: board.image_url ?? "",
        boardCategory: board.category,
        petType: board.petType,
      }).toString();

      router.push(`/boards/${id}/update?${queryString}`);
    } catch (err) {
      console.error(err);
    }
  }
  async function boardDelete() {
    const confirmed = window.confirm("게시글을 삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      await api.delete(`/boards/${id}`);
      router.push("/boards");
    } catch (err) {
      console.log(err);
    }
  }

  async function commentUpdate(commentId: number) {
    try {
      await api.put(`/boards/${id}/comments/${commentId}`, {
        content: editContent,
      });
      setEditCommentId(null);
      setEditContent("");
      getBoardDetail();
    } catch (err) {
      console.log(err);
    }
  }

  async function commentDelete(commentId: number) {
    const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmed) return;
    try {
      await api.delete(`/boards/${id}/comments/${commentId}`);
      getBoardDetail();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="max-w-4xl  mx-auto p-4 bg-white rounded shadow-sm">
        {board && (
          <div className="mb-4 flex gap-2 text-sm font-semibold text-yellow-700">
            <span
              className="text-xs px-2 py-1 text-yellow-800 rounded-full"
              style={{ backgroundColor: "#FFDEA7" }}
            >
              {changeResponse(categories, board?.category)}
            </span>
            <span
              className="text-xs px-2 py-1 text-yellow-800 rounded-full"
              style={{ backgroundColor: "#FFF5C4" }}
            >
              {changeResponse(petTypes, board?.petType)}
            </span>
          </div>
        )}

        <h1 className="text-2xl font-bold mb-1">
          {board ? board.title : "게시글 정보가 없습니다."}
        </h1>

        <div className="flex items-center text-gray-500 text-sm mb-0.05 space-x-4 justify-end">
          <span>조회수 {board?.viewsCount}</span>
          <span>{board?.createdAt.split("T")[0]}</span>
          {board?.updatedAt && board?.updatedAt !== board?.createdAt && (
            <span className="text-yellow-600">(수정됨)</span>
          )}
          <span>{board?.nickname}</span>
        </div>
        <div className="border-b mb-4 border-gray-400 pb-3 last:border-none"></div>

        {/* 좋아요 버튼 우측 정렬 */}
        <div className="flex justify-end items-center mb-4 space-x-2">
          <button
            onClick={handleLike}
            className={`text-2xl ${
              liked ? "text-yellow-500" : "text-gray-400"
            }`}
            aria-label="좋아요"
          >
            ❤️
          </button>
          <span className="text-yellow-700 font-semibold">{likecounts}</span>
        </div>

        <div className="mt-4 text-gray-800 whitespace-pre-wrap mb-20">
          {board?.content}
        </div>
        {board?.image_url && (
          <img
            src={board?.image_url}
            alt="게시글 이미지"
            className="mt-4 rounded-md max-h-64 object-cover"
          />
        )}

        {/* 수정, 삭제 버튼 우측 정렬 */}
        {board?.email === user?.email && (
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={boardUpdate}
              className="px-4 py-1 bg-[#FFDEA7] rounded-md hover:bg-[#e7d6bd] text-gray-800"
            >
              수정
            </button>
            <button
              onClick={boardDelete}
              className="px-4 py-1 bg-red-400 rounded-md hover:bg-red-300 text-white"
            >
              삭제
            </button>
          </div>
        )}

        <div className="mt-8 rounded-lg p-4">
          <div className="flex gap-2">
            <input
              value={value}
              placeholder="댓글을 입력해주세요."
              onChange={(e) => setValue(e.target.value)}
              className="flex-grow rounded-md  bg-[#F0EEE1] placeholder-gray-600 focus:outline-[#DFDDD1] h-14 px-4 py-3 "
            />
            <button
              onClick={() => handleComment(value)}
              className="px-4 py-2 bg-[#D3D5D4] rounded hover:bg-gray-400 text-gray-800"
            >
              등록
            </button>
          </div>

          <div className="text-sm  text-gray-800 mt-4">
            댓글 {comments.length}
          </div>

          <div className="mt-3 space-y-4">
            {pagedComments.length > 0 ? (
              pagedComments.map((com, index) => (
                <div
                  key={com.id ?? index}
                  className="border-b border-gray-400 pb-3 last:border-none"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-yellow-800 mr-4 whitespace-nowrap">
                      {com.nickname}
                    </div>

                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {com.createdAt.split("T")[0]}
                      {com.updatedAt && (
                        <span className="ml-2 text-yellow-600">수정됨</span>
                      )}
                    </div>
                  </div>

                  {editCommentId == com.id ? (
                    <>
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full rounded border border-yellow-300 p-2 mb-2"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => commentUpdate(com.id)}
                          className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500 text-white"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditCommentId(null);
                            setEditContent("");
                          }}
                          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          취소
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center space-x-2 whitespace-pre-wrap">
                      <div className="font-normal text-gray-800">
                        {com.content}
                      </div>

                      {/* 수정, 삭제 버튼은 기존처럼 우측 정렬 */}
                      {com?.email === user?.email &&
                        editCommentId !== com.id && (
                          <div className="flex gap-2 ml-auto">
                            <button
                              onClick={() => {
                                setEditCommentId(com.id);
                                setEditContent(com.content);
                              }}
                              className="px-3 py-1 bg-[#FFDEA7] rounded hover:bg-[#e7d6bd]"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => commentDelete(com.id)}
                              className="px-3 py-1 bg-red-400 rounded hover:bg-red-300 text-white"
                            >
                              삭제
                            </button>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-yellow-700 font-semibold">
                댓글이 없습니다.
              </div>
            )}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              blockSize={5}
            />
          </div>
        </div>
      </div>
    </>
  );
}
