import Pagination from "@/app/components/Pagination";
import BoardListClient from "./BoardListClient";
import Head from "next/head";
import api from "@/app/lib/api";

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

// 클라이언트 컴포넌트에 넘겨주는 모든 데이터 타입
interface Props {
  boards: Board[];
  currentPage: number;
  totalPages: number;
  filters: Filters;
}

function getQureyParam(
  searchParams: { [key: string]: string | string[] | undefined },
  key: string,
  defaultValue: string
) {
  const raw = searchParams[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value ?? defaultValue;
}

export default async function BoardListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  const category = getQureyParam(params, "category", "TOTAL");
  const searchType = getQureyParam(params, "searchType", "TOTAL");
  const keyword = getQureyParam(params, "keyword", "");
  const sortType = getQureyParam(params, "sortType", "CURRENT");
  const pageStr = getQureyParam(params, "page", "1");
  const page = parseInt(pageStr);

  const res = await api.get(
    `/api/v1/boards?category=${category}&searchType=${searchType}&keyword=${keyword}&sortType=${sortType}&page=${
      page - 1
    }&size=10`
  );

  const data: BoardPageResponse = res.data;
  const filters: Filters = {
    category,
    searchType,
    keyword,
    sortType,
    page: pageStr,
  };

  return (
    <>
      <Head>
        <title>Hello Pet</title>
        <meta name="description" content="자유게시판" />
      </Head>
      <BoardListClient
        boards={data.boardList}
        currentPage={data.page + 1}
        totalPages={data.totalPages}
        filters={filters}
      />
    </>
  );
}
