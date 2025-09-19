"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/app/lib/api";

export default function EditAnnouncementPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    breed: "",
    animalType: "",
    gender: "",
    health: "",
    personality: "",
    age: "",
    image: "",
    selectedDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const announcementId = Array.isArray(id) ? id[0] : id;

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/announcements/${id}`);
        const data = res.data;

        setForm({
          breed: data.breed ?? "",
          animalType: data.animalType ?? "",
          gender: data.gender ?? "",
          health: data.health ?? "",
          personality: data.personality ?? "",
          age: data.age?.toString() ?? "",
          image: data.imageUrl ?? "",
          selectedDate: data.announcementPeriod?.slice(0, 16) ?? "", // ISO 8601 형태 처리
        });
      } catch (err) {
        console.error("수정 데이터 불러오기 실패", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("accessToken");
      const payload = {
        ...form,
        age: Number(form.age),
        announcementPeriod: form.selectedDate,
        image: form.image || null,
      };

      await api.put(`/announcements/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("수정 완료!");
      router.push("/me");
    } catch (err) {
      console.error("수정 실패", err);
      setError("수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-30 flex flex-col items-center py-10">
      <div className="bg-yellow-50 w-full max-w-2xl mt-10 p-10 rounded-xl shadow-md text-yellow-700 font-medium">
        <h2 className="text-center text-xl mb-8 font-bold">입양 공고 수정</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 동물 종류 */}
          <div>
            <label className="block mb-1">동물 종류</label>
            <select
              name="animalType"
              value={form.animalType}
              onChange={handleChange}
              className="w-full border-b border-yellow-300 bg-transparent outline-none py-2"
            >
              <option value="">선택하세요</option>
              <option value="강아지">강아지</option>
              <option value="고양이">고양이</option>
              <option value="기타">기타</option>
            </select>
          </div>

          {/* 견종 */}
          <input
            name="breed"
            value={form.breed}
            onChange={handleChange}
            placeholder="견종, 묘종을 입력해주세요."
            className="w-full border-b border-yellow-300 bg-transparent outline-none py-2"
          />

          {/* 성별 */}
          <div>
            <label className="block mb-1">성별</label>
            <div className="flex space-x-6">
              {["남", "여"].map((g) => (
                <label key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={form.gender === g}
                    onChange={handleChange}
                    className="mr-1"
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <input
            name="health"
            value={form.health}
            onChange={handleChange}
            placeholder="건강상태"
            className="w-full border-b border-yellow-300 bg-transparent outline-none py-2"
          />
          <input
            name="personality"
            value={form.personality}
            onChange={handleChange}
            placeholder="성격"
            className="w-full border-b border-yellow-300 bg-transparent outline-none py-2"
          />
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="나이"
            className="w-full border-b border-yellow-300 bg-transparent outline-none py-2"
          />

          {/* 공고 종료일 */}
          <input
            type="datetime-local"
            name="selectedDate"
            value={form.selectedDate}
            onChange={handleChange}
            className="border border-yellow-300 rounded px-2 py-1 bg-white"
            min={new Date().toISOString().slice(0, 16)}
          />

          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="이미지 URL 입력 (선택)"
            className="w-full border-b border-yellow-300 py-2 bg-transparent outline-none"
          />

          <div className="text-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-400 text-white px-6 py-2 rounded-full shadow hover:bg-yellow-500 transition disabled:bg-yellow-300"
            >
              {loading ? "수정 중..." : "수정 완료"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
