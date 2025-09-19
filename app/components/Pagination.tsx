"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  blockSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  blockSize,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentBlock = useMemo(
    () => Math.ceil(currentPage / blockSize),
    [currentPage, blockSize]
  );

  const startPage = (currentBlock - 1) * blockSize + 1;
  const endPage = Math.min(startPage + blockSize - 1, totalPages);
  const totalBlocks = Math.ceil(totalPages / blockSize);

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      router.push(createPageUrl(page));
    }
  };

  // ✅ 이전 페이지 이동 함수 추가
  const goToPrevPage = () => goToPage(currentPage - 1);

  // ✅ 다음 페이지 이동 함수 추가
  const goToNextPage = () => goToPage(currentPage + 1);

  const goToFirst = () => goToPage(1);
  const goToLast = () => goToPage(totalPages);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* 처음 */}
      <button
        onClick={goToFirst}
        disabled={currentPage === 1}
        className={`px-2 text-sm transition ${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        }`}
      >
        «
      </button>

      {/* 이전 블록 */}
      <button
        onClick={goToPrevPage}
        disabled={currentPage === 1}
        className={`px-2 text-sm transition ${
          currentPage === 1
            ? "text-gray-300 cursor-not-allowed"
            : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        }`}
      >
        &lt;
      </button>

      {/* 페이지 번호 */}
      {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
        const page = startPage + i;
        const isCurrent = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => goToPage(page)}
            disabled={isCurrent}
            className={`px-3 py-1 text-sm rounded transition ${
              isCurrent
                ? "bg-[#F5C044] text-white font-semibold cursor-not-allowed"
                : "text-yellow-700 hover:bg-yellow-100 hover:font-semibold"
            }`}
          >
            {page}
          </button>
        );
      })}

      {/* 다음 블록 */}
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`px-2 text-sm transition ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        }`}
      >
        &gt;
      </button>

      {/* 마지막 */}
      <button
        onClick={goToLast}
        disabled={currentPage === totalPages}
        className={`px-2 text-sm transition ${
          currentPage === totalPages
            ? "text-gray-300 cursor-not-allowed"
            : "text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        }`}
      >
        »
      </button>
    </div>
  );
}
