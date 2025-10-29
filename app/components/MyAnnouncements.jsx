"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/app/store/UserStore";
import { AlertModal } from "@/app/components/Modal";

const animalTypeKo = {
  DOG: "강아지",
  CAT: "고양이",
};

const genderKo = {
  MALE: "수컷",
  FEMALE: "암컷",
  UNKNOWN: "미상",
};

const healthKo = {
  HEALTHY: "건강함",
  NORMAL: "보통",
  UNDER_TREATMENT: "치료 중",
  WEAK: "허약함",
};

const statusKo = {
  OPEN: "공고 중",
  CLOSED: "마감됨",
  COMPLETED: "입양 완료",
  DELETED: "삭제됨",
};

const statusColor = {
  OPEN: "bg-[rgb(255,222,167)]",
  CLOSED: "bg-[rgb(231,116,116)]",
  COMPLETED: "bg-[rgb(160,177,135)]",
  DELETED: "bg-[rgb(231,116,116)]",
};

export default function MyAnnouncementsPage() {
  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ message: "", type: "info" });
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    fetchMyAnnouncements();
  }, []);

  async function fetchMyAnnouncements() {
    try {
      const res = await api.get("/v1/announcements/my", {
        headers: {
          "X-User-Id": user?.id
        }
      });

      // 상태별 정렬: OPEN > CLOSED > COMPLETED > DELETED
      const statusOrder = { OPEN: 1, CLOSED: 2, COMPLETED: 3, DELETED: 4 };
      const sorted = (res.data.announcements ?? []).sort((a, b) => {
        const statusA = a.status;
        const statusB = b.status;
        return (statusOrder[statusA] || 999) - (statusOrder[statusB] || 999);
      });

      setMyAnnouncements(sorted);
    } catch (err) {
      console.error("공고 불러오기 실패", err);
      setAlertConfig({
        message: "공고 목록을 불러올 수 없습니다.",
        type: "error"
      });
      setShowAlertModal(true);
    } finally {
      setLoading(false);
    }
  }


  if (loading) return <p className="text-center mt-20 text-lg">불러오는 중…</p>;

  return (
    <div className="min-h-screen bg-white-50 py-10 px-4">
      <h1 className="text-center text-yellow-600 text-3xl font-extrabold mb-10">
        공고 관리
      </h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {myAnnouncements.map((item) => (
          <li
            key={item.id}
            className="bg-yellow-100 p-5 rounded-2xl shadow-lg hover:shadow-xl transition relative"
          >
            <Link href={`/my-announcements/${item.id}`} className="block group transition">
              {item.thumbnailUrl ? (
                <img
                  src={item.thumbnailUrl}
                  alt={item.breed}
                  className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:opacity-90"
                />
              ) : (
                <div className="w-full h-48 bg-yellow-200 flex items-center justify-center rounded-2xl text-yellow-400 mb-4">
                  이미지 없음
                </div>
              )}

              {/* 동물 종류와 배지 */}
              <div className="flex items-center mb-1">
                <p className="text-orange-500 text-sm font-semibold">
                  {animalTypeKo[item.animalType] || item.animalType}
                </p>
                <span className={`ml-auto px-2 py-1 ${statusColor[item.status]} ${item.status === "OPEN" ? "text-gray-800" : "text-white"} text-xs font-bold rounded-full`}>
                  {statusKo[item.status]}
                </span>
              </div>
              <h3 className="text-gray-800 text-2xl font-extrabold mb-3">
                {item.breed}
              </h3>
              <div className="space-y-1">
                <p className="text-xs text-gray-600">
                  나이: <span className="text-gray-700">{item.age}세</span>
                </p>
                <p className="text-xs text-gray-600">
                  성별: <span className="text-gray-700">{genderKo[item.gender] || item.gender}</span>
                </p>
                <p className="text-xs text-gray-600">
                  건강: <span className="text-gray-700">{healthKo[item.health] || item.health}</span>
                </p>
              </div>
              <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                {item.personality}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      {myAnnouncements.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          등록된 공고가 없습니다.
        </p>
      )}

      {/* 알림 모달 */}
      <AlertModal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
}
