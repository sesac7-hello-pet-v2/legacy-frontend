"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { useRouter } from "next/navigation";
import RequireRole from "./RequireRole";

interface User {
  id: number;
  email: string;
  role: string;
  nickname: string;
  username: string;
  phoneNumber: string;
  activation: boolean;
}

const SEARCH_TYPES = ["TOTAL", "USERNAME", "EMAIL", "NICKNAME"] as const;
const SORT_TYPES = [
  "ID",
  "ROLE",
  "USERNAME",
  "EMAIL",
  "NICKNAME",
  "PHONENUMBER",
] as const;
const ORDER_TYPES = ["ASC", "DESC"] as const;

export default function UserList() {
  /* ─────────── 상태 ─────────── */
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  /* 검색·정렬 조건 */
  const [searchType, setSearchType] =
    useState<(typeof SEARCH_TYPES)[number]>("TOTAL");
  const [sortType, setSortType] = useState<(typeof SORT_TYPES)[number]>("ID");
  const [orderType, setOrderType] =
    useState<(typeof ORDER_TYPES)[number]>("ASC");

  /* 키워드: 입력용 / 확정용 분리 */
  const [keywordInput, setKeywordInput] = useState(""); // 입력창에 표시되는 값
  const [keyword, setKeyword] = useState(""); // 실제 쿼리에 쓰는 값

  const pageSize = 10;
  const maxPageButtons = 5;

  /* 페이지 또는 검색 조건(확정된 keyword) 바뀔 때만 fetch */
  useEffect(() => {
    fetchUsers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchType, sortType, orderType, keyword]);

  async function fetchUsers(page: number) {
    const res = await api.get("/admin/users", {
      params: {
        page: page - 1,
        size: pageSize,
        userSearchType: searchType,
        userSortType: sortType,
        userAscDesc: orderType,
        keyword, // ← 확정된 키워
      },
    });
    setUsers(res.data.adminUserList);
    setTotalPages(res.data.totalPages);
  }

  async function handleDeactivate(userId: number) {
    if (window.confirm("정말로 이 사용자를 비활성화하시겠습니까?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        alert("사용자가 비활성화되었습니다.");
        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === userId ? { ...user, activation: false } : user
          )
        );
        router.refresh();
      } catch (err) {
        alert("비활성화 실패: " + (err as Error).message);
      }
    }
  }

  function goTo(page: number) {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  }

  /* 페이지 버튼 계산 */
  const startPage =
    Math.floor((currentPage - 1) / maxPageButtons) * maxPageButtons + 1;
  const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  /* 검색 버튼 누르면 keyword 확정 */
  function handleSearch() {
    setKeyword(keywordInput); // ← 여기서만 keyword 업데이트
    setCurrentPage(1); // 검색 시 1페이지부터
  }

  /* 초기화 */
  function resetSearch() {
    setKeywordInput("");
    setKeyword("");
    setSearchType("TOTAL");
    setCurrentPage(1);
    setSortType("ID");
    setOrderType("ASC");
  }

  /* ─────────── UI ─────────── */
  return (
    <RequireRole allow={["ADMIN"]}>
      <div className="bg-white px-4 py-6 sm:px-8">
        <div className="w-full rounded-2xl bg-white p-8 shadow-[0_0_0_4px_rgba(253,224,71,0.25)] space-y-8">
          {/* ----------- 정렬 옵션 ----------- */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* 왼쪽: 정렬 기준 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                정렬 기준:
              </label>
              <select
                value={sortType}
                onChange={(e) => {
                  setSortType(e.target.value as (typeof SORT_TYPES)[number]);
                  setCurrentPage(1);
                }}
                className="rounded-lg border px-3 py-2 text-sm shadow focus:ring-2 focus:ring-amber-400"
              >
                {SORT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* 오른쪽: 오름/내림 */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                정렬 방향:
              </label>
              <select
                value={orderType}
                onChange={(e) => {
                  setOrderType(e.target.value as (typeof ORDER_TYPES)[number]);
                  setCurrentPage(1);
                }}
                className="rounded-lg border px-3 py-2 text-sm shadow focus:ring-2 focus:ring-amber-400"
              >
                {ORDER_TYPES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ----------- 검색 바 ----------- */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={searchType}
              onChange={(e) =>
                setSearchType(e.target.value as (typeof SEARCH_TYPES)[number])
              }
              className="rounded-lg border px-3 py-2 text-sm shadow focus:ring-2 focus:ring-amber-400"
            >
              {SEARCH_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="검색어"
              className="flex-1 rounded-lg border px-4 py-2 text-sm shadow placeholder-gray-400 focus:ring-2 focus:ring-amber-400"
            />

            <button
              onClick={handleSearch}
              className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-amber-500"
            >
              검색
            </button>

            <button
              onClick={resetSearch}
              className="rounded-lg bg-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 shadow transition hover:bg-gray-400"
            >
              초기화
            </button>
          </div>

          {/* ----------- 리스트 ----------- */}
          <ul className="divide-y divide-gray-200 rounded-lg border">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <span className="flex-1 text-sm text-gray-700">
                  {u.role} / {u.username} / {u.email} / {u.nickname} /{" "}
                  {u.phoneNumber}
                </span>
                <button
                  onClick={() => handleDeactivate(u.id)}
                  disabled={u.role === "ADMIN" || !u.activation}
                  className={`rounded-lg px-3 py-1 text-sm font-bold transition
                    ${
                      u.role === "ADMIN" || !u.activation
                        ? "cursor-not-allowed bg-gray-300 text-gray-500"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }
                  `}
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>

          {/* ----------- 페이지 네비게이션 ----------- */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => goTo(1)}
              disabled={currentPage === 1}
              className="rounded px-2 py-1 text-sm disabled:opacity-50"
            >
              {"<<"}
            </button>
            <button
              onClick={() => goTo(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded px-2 py-1 text-sm disabled:opacity-50"
            >
              {"<"}
            </button>

            {pageNumbers.map((p) => (
              <button
                key={p}
                onClick={() => goTo(p)}
                className={`rounded px-3 py-1 text-sm transition hover:bg-amber-100 ${
                  p === currentPage
                    ? "font-bold text-amber-500 underline"
                    : "text-gray-700"
                }`}
              >
                {p}
              </button>
            ))}

            {endPage < totalPages && (
              <span className="text-sm text-gray-500">…</span>
            )}

            <button
              onClick={() => goTo(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded px-2 py-1 text-sm disabled:opacity-50"
            >
              {">"}
            </button>
            <button
              onClick={() => goTo(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded px-2 py-1 text-sm disabled:opacity-50"
            >
              {">>"}
            </button>
          </div>
        </div>
      </div>
    </RequireRole>
  );
}
