import { BoardResponse } from "@/app/lib/boardTypes";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import Pagination from "../Pagination";
import { categories, petTypes } from "@/app/lib/boardConstants";
import { changeResponse } from "@/app/lib/boardUtils";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation"; //

export default function MyBoardsList() {
  const searchParams = useSearchParams(); //
  const router = useRouter();

  const page = parseInt(searchParams.get("page") || "1"); //

  const [totalPages, setTotalPages] = useState(1);
  const [boards, setBoards] = useState<BoardResponse[]>([]);

  useEffect(() => {
    fetchBoard();
  }, [page]);

  const fetchBoard = async () => {
    try {
      const params = new URLSearchParams({
        page: String(page - 1),
        size: "5",
      });
      const res = await api.get(`/me/boards?${params.toString()}`);
      setBoards(res.data.boardList);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      alert("게시글 내역을 불러오지 못했습니다.");
    }
  };

  return (
    <>
      {boards.length === 0 ? (
        <div className="text-center text-gray-500 py-20 text-lg">
          검색 결과가 없습니다.
        </div>
      ) : (
        <ul className="px-7 max-w-5xl mx-auto divide-y divide-gray-300">
          {boards.map((board) => (
            <Link
              href={`boards/${board.id}`}
              key={board.id}
              className="flex justify-between items-start py-4"
            >
              {/* 본문 */}
              <div className="flex-1 flex flex-col justify-between pr-4">
                {/* 라벨 */}
                <div className="flex gap-4 mb-1">
                  <span
                    className="text-xs px-2 py-1 text-yellow-800 rounded-full"
                    style={{ backgroundColor: "#FFDEA7" }}
                  >
                    {changeResponse(categories, board.category)}
                  </span>
                  <span
                    className="text-xs px-2 py-1 text-yellow-800 rounded-full"
                    style={{ backgroundColor: "#FFF5C4" }}
                  >
                    {changeResponse(petTypes, board.petType)}
                  </span>
                </div>

                <div className="font-semibold text-base text-gray-800">
                  {board.title}
                </div>
                <div className="text-sm text-gray-500">{board.content}</div>
                <div className="flex items-center text-xs text-gray-400 mt-2 gap-5">
                  <span>{board.createdAt.split("T")[0]}</span>
                </div>
              </div>

              {/* 이미지 */}
              {board.image_url && (
                <img
                  src={board.image_url}
                  alt="게시물 이미지"
                  className="w-24 h-24 object-cover rounded-xl"
                />
              )}
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
