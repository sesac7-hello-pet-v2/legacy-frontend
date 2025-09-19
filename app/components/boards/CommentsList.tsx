import { Comment } from "@/app/lib/boardTypes";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import Pagination from "../Pagination";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function CommentsList() {
  const searchParams = useSearchParams(); //
  const router = useRouter();

  // ✅ URL에서 page 쿼리 추출 (useMemo로 최적화)
  const page = parseInt(searchParams.get("page") || "1"); //

  const [totalPages, setTotalPages] = useState(1);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    fetchComment();
  }, [page]);

  const fetchComment = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page - 1),
        size: "5",
        sort: "createdAt,desc",
      });
      const res = await api.get(`/me/comments?${params.toString()}`);
      setComments(res.data.commentList);
      setTotalPages(res.data.totalPage);
      console.log("✅ 댓글 응답:", res.data); // 👈 이걸 추가하세요
    } catch (e) {
      alert("댓글 내역을 불러오지 못했습니다.");
    }
  };

  return (
    <>
      {comments.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-lg">
          검색 결과가 없습니다.
        </div>
      ) : (
        <ul className="px-7 max-w-5xl mx-auto divide-y divide-gray-300">
          {comments.map((comment) => (
            <Link
              href={`boards/${comment.boardId}`}
              key={comment.id}
              className="flex justify-between items-start py-4"
            >
              <div className="text-sm text-gray-500">{comment.content}</div>
              <div className="flex items-center text-xs text-gray-400 mt-2 gap-5">
                <span>{comment.createdAt.split("T")[0]}</span>
              </div>
            </Link>
          ))}
        </ul>
      )}
      <hr className="border-t border-gray-400 my-6" />

      <div className="mt-4 mb-12 px-5 max-w-4xl mx-auto">
        <Pagination currentPage={page} totalPages={totalPages} blockSize={5} />
      </div>
    </>
  );
}
