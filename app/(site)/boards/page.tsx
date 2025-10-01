"use client";

import BoardListClient from "./BoardListClient";
import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Board {
  id: number;
  nickname: string;
  title: string;
  content: string;
  image_url: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  category: string;
  petType: string;
}

// 백엔드 응답 구조
interface BoardPageResponse {
  boardList: Board[];
  page: number;
  size: number;
  totalPages: number;
  totalCount: number;
}

interface Filters {
  category: string;
  searchType: string;
  keyword: string;
  sortType: string;
  page: string;
}

export default function BoardListPage() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<BoardPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const category = searchParams.get("category") || "TOTAL";
  const searchType = searchParams.get("searchType") || "TOTAL";
  const keyword = searchParams.get("keyword") || "";
  const sortType = searchParams.get("sortType") || "CURRENT";
  const pageStr = searchParams.get("page") || "1";
  const page = parseInt(pageStr);

  useEffect(() => {
    fetchBoards();
  }, [category, searchType, keyword, sortType, page]);

  async function fetchBoards() {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(
        `/api/v1/boards?category=${category}&searchType=${searchType}&keyword=${keyword}&sortType=${sortType}&page=${
          page - 1
        }&size=10`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <h1 className="text-center mt-20 text-xl">로딩 중...</h1>;
  if (error || !data) return <h1 className="text-center mt-20 text-xl">조회 실패</h1>;

  const filters: Filters = {
    category,
    searchType,
    keyword,
    sortType,
    page: pageStr,
  };

  return (
    <BoardListClient
      boards={data.boardList}
      currentPage={data.page + 1}
      totalPages={data.totalPages}
      filters={filters}
    />
  );
}
