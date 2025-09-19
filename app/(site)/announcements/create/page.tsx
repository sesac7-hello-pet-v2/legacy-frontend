"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 여기 추가
import api from "@/app/lib/api";

export default function Page() {
  const router = useRouter(); // router 선언

  const [breed, setBreed] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [gender, setGender] = useState("");
  const [healthStatus, setHealthStatus] = useState("");
  const [personality, setPersonality] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const onSubmit = async () => {
    try {
      const data = {
        breed,
        animalType,
        gender,
        health: healthStatus,
        personality,
        age: Number(age),
        image: image || null,
        selectedDate,
      };

      console.log("전송 데이터:", data);

      const res = await api.post("/announcements", data);
      console.log("등록이 되었습니다:", res.data);

      router.push("/me"); // router.push 호출 가능!

      alert("등록 성공!");
    } catch (err) {
      console.error("등록 실패", err);
      alert("등록 실패: " + (err instanceof Error ? err.message : "에러 발생"));
    }
  };

  return (
    <div className="min-h-screen bg-yellow-30 flex flex-col items-center py-10">
      <div className="bg-yellow-50 w-full max-w-2xl mt-10 p-10 rounded-xl shadow-md text-yellow-700 font-medium">
        <h2 className="text-center text-xl mb-8 font-bold">입양 동물 등록</h2>

        {/* 동물 종류 */}
        <div className="mb-4">
          <label className="block mb-1">동물 종류</label>
          <select
            className="w-full border-b border-yellow-300 bg-transparent outline-none py-2"
            value={animalType}
            onChange={(e) => setAnimalType(e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="강아지">강아지</option>
            <option value="고양이">고양이</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* 견종 */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="견종, 묘종을 입력해주세요."
            className="w-full border-b border-yellow-300 bg-transparent outline-none py-2"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
          />
        </div>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block mb-1">성별</label>
          <div className="flex space-x-6">
            {["남", "여"].map((g) => (
              <label key={g}>
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-1"
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        {/* 건강 상태, 성격, 나이 */}
        <input
          type="text"
          placeholder="건강상태"
          value={healthStatus}
          onChange={(e) => setHealthStatus(e.target.value)}
          className="w-full mb-2 border-b border-yellow-300 py-2 bg-transparent outline-none"
        />
        <input
          type="text"
          placeholder="성격"
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="w-full mb-2 border-b border-yellow-300 py-2 bg-transparent outline-none"
        />
        <input
          type="number"
          placeholder="나이"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full mb-4 border-b border-yellow-300 py-2 bg-transparent outline-none"
        />

        {/* 공고 종료일 */}
        <div className="mb-6">
          <label className="block mb-1">공고 종료일</label>
          <input
            type="datetime-local"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-yellow-300 rounded px-2 py-1 bg-white"
            min={new Date().toISOString().split("T")[0] + "T00:00"}
          />
        </div>

        {/* 이미지 URL */}
        <input
          type="text"
          placeholder="이미지 URL 입력 (선택)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full mb-6 border-b border-yellow-300 py-2 bg-transparent outline-none"
        />

        {/* 등록 버튼 */}
        <div className="text-center">
          <button
            className="bg-yellow-400 text-white px-6 py-2 rounded-full shadow hover:bg-yellow-500 transition"
            onClick={onSubmit}
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}
