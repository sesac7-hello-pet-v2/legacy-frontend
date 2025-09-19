"use client";

import api from "@/app/lib/api";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";

export default function BoardCreate() {
  const [category, setCategory] = useState<string>("커뮤니티");
  const [petType, setPetType] = useState<string>("강아지");
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

  async function createBoard(e: React.FormEvent) {
    e.preventDefault();

    const checkTitle = title.current?.value ?? "";
    const checkContent = content.current?.value ?? "";

    // 유효성 검사
    if (!checkTitle || !checkContent) {
      alert("제목과 내용을 모두 입력해주세요!!");
      return;
    }

    const payload = {
      title: checkTitle,
      content: checkContent,
      img_url: imgText.current?.value,
      boardCategory: categoryMap[category],
      petType: petTypeMap[petType],
    };

    try {
      const res = await api.post("/boards", payload);
      alert("글이 등록되었습니다!!");
      router.push(`/boards/${res.data.id}`);
    } catch (err) {
      console.error("등록실패", err);
      alert("등록에 실패했습니다. 다시 시도해주세요");
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex items-start justify-center py-16">
      {/* 카드 */}
      <div className="w-full max-w-5xl rounded-3xl  bg-white shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-16 py-10">
        <form onSubmit={createBoard} className="space-y-8">
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
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
