"use client";

import api from "@/app/lib/api";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function BoardUpdate() {
  const { id } = useParams();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<string>("");
  const [petType, setPetType] = useState<string>("");
  const title = useRef<HTMLInputElement>(null);
  const content = useRef<HTMLTextAreaElement>(null);
  const imgText = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const changeButton = (state: string, current: string) =>
    `w-auto rounded-full text-xs px-2 py-1 font-medium shadow-sm transition border
        ${
          state == current
            ? "bg-[#FFDEA7] text-gray-700 border-transparent"
            : "bg-[#F1F5FF] text-gray-700 hover:bg-amber-100 border-transparent"
        }`;

  function clickCategory(selectd: string) {
    setCategory(selectd);
  }

  function clickPetType(selectd: string) {
    setPetType(selectd);
  }

  function deleteBtn() {
    if (imgText.current) {
      imgText.current.value = "";
    }
  }

  const categoryMap: Record<string, string> = {
    커뮤니티: "FREE",
    "Q & A": "QNA",
  };
  const petTypeMap: Record<string, string> = {
    강아지: "DOG",
    고양이: "CAT",
    기타: "ETC",
  };

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const res = await api.get(`/boards/${id}`);
    //     const data = res.data;

    //     if (title.current) title.current.value = data.title;
    //     if (content.current) content.current.value = data.content;
    //     if (imgText.current) imgText.current.value = data.img_url || "";
    //     console.log("서버받은 pettype", data.petType);

    //     setCategory(data.boardCategory === "QNA" ? "Q & A" : "커뮤니티");
    //     setPetType(
    //       data.petType === "DOG"
    //         ? "강아지"
    //         : data.petType === "CAT"
    //         ? "고양이"
    //         : "기타"
    //     );
    //   } catch (err) {
    //     console.error("게시글 로딩 실패", err);
    //     alert("게시글을 불러오지 못했습니다.");
    //   }
    // };

    // fetchData();
    if (!searchParams) return;

    const titleParam = searchParams.get("title") ?? "";
    const contentParam = searchParams.get("content") ?? "";
    const imgUrlParam = searchParams.get("img_url") ?? "";
    const categoryParam = searchParams.get("boardCategory") ?? "FREE";
    const petTypeParam = searchParams.get("petType") ?? "DOG";

    if (title.current) title.current.value = titleParam;
    if (content.current) content.current.value = contentParam;
    if (imgText.current) imgText.current.value = imgUrlParam;

    // 쿼리의 boardCategory 값에 따라 카테고리 상태 변경
    setCategory(categoryParam === "QNA" ? "Q & A" : "커뮤니티");

    // 쿼리의 petType 값에 따라 petType 상태 변경
    setPetType(
      petTypeParam === "DOG"
        ? "강아지"
        : petTypeParam === "CAT"
        ? "고양이"
        : "기타"
    );
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      title: title.current?.value,
      content: content.current?.value,
      img_url: imgText.current?.value,
      boardCategory: categoryMap[category],
      petType: petTypeMap[petType],
    };

    try {
      await api.put(`/boards/${id}`, payload);
      alert("게시글이 수정되었습니다.");
      router.push(`/boards/${id}`);
    } catch (err) {
      console.error("등록실패", err);
      alert("등록에 실패했습니다. 다시 시도해주세요");
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex items-start justify-center py-16">
      {/* 카드 */}
      <div className="w-full max-w-5xl rounded-3xl  bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-16 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── 카테고리 ───────────────────────────── */}
          <fieldset className="flex items-center gap-4">
            <legend className="text-sm font-semibold text-gray-700 w-24">
              카테고리
            </legend>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => clickCategory("커뮤니티")}
                className={changeButton("커뮤니티", category)}
              >
                커뮤니티
              </button>
              <button
                type="button"
                onClick={() => clickCategory("Q & A")}
                className={changeButton("Q & A", category)}
              >
                Q & A
              </button>
            </div>
          </fieldset>

          {/* ── 동물 종류 ─────────────────────────── */}
          <fieldset className="flex items-center gap-4">
            <legend className="text-sm font-semibold text-gray-700 w-24">
              동물 종류
            </legend>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => clickPetType("강아지")}
                className={changeButton("강아지", petType)}
              >
                강아지
              </button>
              <button
                type="button"
                onClick={() => clickPetType("고양이")}
                className={changeButton("고양이", petType)}
              >
                고양이
              </button>
              <button
                type="button"
                onClick={() => clickPetType("기타")}
                className={changeButton("기타", petType)}
              >
                기타
              </button>
            </div>
          </fieldset>

          {/* ── 제목 ─────────────────────────────── */}
          <input
            ref={title}
            type="text"
            placeholder="제목을 입력해주세요. (20자 내외)"
            className="w-full rounded-lg bg-[#F1F1E8] px-4 py-3 text-sm placeholder-gray-600 focus:border-amber-400 focus:ring-amber-400"
          />

          {/* ── 내용 ─────────────────────────────── */}
          <textarea
            ref={content}
            rows={8}
            placeholder="5자 이상의 내용을 입력해주세요."
            className="w-full rounded-lg bg-[#F1F1E8] px-4 py-3 text-sm placeholder-gray-600 focus:border-amber-400 focus:ring-amber-400"
          />

          {/* ── 사진 업로드 ───────────────────────── */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              사진 업로드
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={imgText}
                //onChange={loadImg}
                className="flex-1 rounded-lg  bg-[#F1F1E8] px-2 py-1 text-sm 
             file:mr-4 file:rounded-full file:border file:border-gray-300
             file:bg-[#F1F5FF] file:px-2 file:py-0.5 file:text-[12px]  file:text-gray-700 
             hover:bg-amber-100"
              />
              <button
                type="button"
                className="rounded-full border border-gray-300 bg-[#F1F5FF] px-4 py-1.5 text-sm text-gray-700 transition hover:bg-gray-100"
                onClick={() => deleteBtn()}
              >
                삭제
              </button>
            </div>
          </div>

          {/* ── 제출 ─────────────────────────────── */}
          <div className="pt-4 text-center">
            <button
              type="submit"
              className="inline-block rounded-full bg-[#FAD393] px-8 py-3 font-medium text-gray-700 
                         ring-2 ring-transparent transition hover:bg-amber-100 focus:outline-none focus:ring-amber-300
                         disabled:cursor-not-allowed disabled:opacity-40"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
