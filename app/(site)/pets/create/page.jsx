"use client";

import api from "@/app/lib/api";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {modalAlert} from "@/app/utils/alertUtils";
import SingleImageDragDrop from "@/app/components/SingleImageDragDrop";

export default function CreatePetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    animalType: "DOG",
    breed: "",
    gender: "MALE",
    health: "HEALTHY",
    personality: "",
    age: 1,
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.breed.trim()) {
        modalAlert("품종을 입력해주세요.", "warning");
      return;
    }
    if (!formData.personality.trim()) {
        modalAlert("성격/특징을 입력해주세요.", "warning");
      return;
    }
    if (formData.age < 0) {
        modalAlert("올바른 나이를 입력해주세요.", "warning");
      return;
    }

    try {
      // FormData 생성
      const data = new FormData();

      // Spring Cloud Gateway MVC의 multipart 처리 문제로 인해
      // JSON Blob 대신 개별 필드로 전송
      // 이렇게 하면 Board 서비스처럼 정상 작동함
      data.append('animalType', formData.animalType);
      data.append('breed', formData.breed);
      data.append('gender', formData.gender);
      data.append('health', formData.health);
      data.append('personality', formData.personality);
      data.append('age', formData.age.toString());

      // 이미지 파일이 있으면 추가
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.post("/v1/pets", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

        modalAlert("반려동물이 성공적으로 등록되었습니다.", "success").then(() => {
            router.push("/me");
        });
    } catch (err) {
      console.error("등록 실패", err);
        modalAlert("등록 중 오류가 발생했습니다. 다시 시도해주세요.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
          동물 등록
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 동물 종류 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              동물 종류 <span className="text-red-500">*</span>
            </label>
            <select
              name="animalType"
              value={formData.animalType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="DOG">강아지</option>
              <option value="CAT">고양이</option>
            </select>
          </div>

          {/* 품종 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              품종 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              placeholder="예: 말티즈, 페르시안 등"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              성별 <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="MALE">수컷</option>
              <option value="FEMALE">암컷</option>
              <option value="UNKNOWN">미상</option>
            </select>
          </div>

          {/* 나이 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              나이 (세) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            />
          </div>

          {/* 건강 상태 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              건강 상태 <span className="text-red-500">*</span>
            </label>
            <select
              name="health"
              value={formData.health}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
            >
              <option value="HEALTHY">건강함</option>
              <option value="NORMAL">보통</option>
              <option value="UNDER_TREATMENT">치료 중</option>
              <option value="WEAK">허약함</option>
            </select>
          </div>

          {/* 성격/특징 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              성격 및 특징 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="personality"
              value={formData.personality}
              onChange={handleChange}
              placeholder="동물의 성격, 특징, 주의사항 등을 자유롭게 작성해주세요 (최대 1000자)"
              rows={6}
              maxLength={1000}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.personality.length} / 1000자
            </p>
          </div>

          {/* 이미지 업로드 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              반려동물 사진
            </label>
            <SingleImageDragDrop
              onFileChange={setImageFile}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-full font-semibold hover:bg-yellow-500 transition"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
