"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/UserStore";
import { ConfirmModal, AlertModal } from "@/app/components/Modal";

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
  IN_PROGRESS: "입양 진행중",
  COMPLETED: "입양 완료",
  CLOSED: "종료",
};

const statusColor = {
  OPEN: "bg-lime-500",
  IN_PROGRESS: "bg-blue-500",
  COMPLETED: "bg-gray-500",
  CLOSED: "bg-red-500",
};

export default function MyAnnouncementsPage() {
  const [myAnnouncements, setMyAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    endDate: "",
    status: "OPEN",
  });
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ message: "", type: "info" });
  const router = useRouter();
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

      // 상태별 정렬: OPEN > IN_PROGRESS > COMPLETED > CLOSED
      const statusOrder = { OPEN: 1, IN_PROGRESS: 2, COMPLETED: 3, CLOSED: 4 };
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

  async function fetchAnnouncementDetail(announcementId) {
    try {
      const res = await api.get(`/v1/announcements/${announcementId}`);
      const data = res.data;
      setSelectedAnnouncement(data);
      setFormData({
        endDate: data.endDate ? data.endDate.split("T")[0] : "",
        status: data.announcementStatus,
      });
    } catch (err) {
      console.error("공고 상세 정보 불러오기 실패", err);
      setAlertConfig({
        message: "공고 정보를 불러올 수 없습니다.",
        type: "error"
      });
      setShowAlertModal(true);
      setShowModal(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  function confirmDelete() {
    setShowDeleteConfirmModal(true);
  }

  async function handleDelete() {
    try {
      await api.delete(`/v1/announcements/${selectedAnnouncementId}`);
      setAlertConfig({
        message: "삭제가 완료되었습니다!",
        type: "success"
      });
      setShowAlertModal(true);
      setShowModal(false);
      setSelectedAnnouncementId(null);
      setSelectedAnnouncement(null);
      fetchMyAnnouncements();
    } catch (err) {
      console.error("삭제 실패", err);
      setAlertConfig({
        message: "삭제에 실패했습니다.",
        type: "error"
      });
      setShowAlertModal(true);
    }
  }

  async function handleSave() {
    try {
      await api.put(`/v1/announcements/${selectedAnnouncementId}`, formData);
      setAlertConfig({
        message: "수정이 완료되었습니다!",
        type: "success"
      });
      setShowAlertModal(true);
      setIsEditMode(false);
      fetchAnnouncementDetail(selectedAnnouncementId);
      fetchMyAnnouncements();
    } catch (err) {
      console.error("수정 실패", err);
      setAlertConfig({
        message: "수정에 실패했습니다.",
        type: "error"
      });
      setShowAlertModal(true);
    }
  }

  function handleCancel() {
    setIsEditMode(false);
    if (selectedAnnouncement) {
      setFormData({
        endDate: selectedAnnouncement.endDate ? selectedAnnouncement.endDate.split("T")[0] : "",
        status: selectedAnnouncement.announcementStatus,
      });
    }
  }

  function handleOpenModal(announcementId) {
    setSelectedAnnouncementId(announcementId);
    setShowModal(true);
    setIsEditMode(false);
    fetchAnnouncementDetail(announcementId);
  }

  function handleCloseModal() {
    setShowModal(false);
    setSelectedAnnouncementId(null);
    setSelectedAnnouncement(null);
    setIsEditMode(false);
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
            <div
              className="block group transition cursor-pointer"
              onClick={() => handleOpenModal(item.id)}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
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
                <span className={`ml-auto px-2 py-1 ${statusColor[item.status]} text-white text-xs font-bold rounded-full`}>
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
            </div>
          </li>
        ))}
      </ul>

      {myAnnouncements.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          등록된 공고가 없습니다.
        </p>
      )}

      {/* 공고 상세 모달 */}
      {showModal && selectedAnnouncement && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
            {/* 모달 헤더 */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">공고 상세 정보</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* 모달 컨텐츠 */}
            <div className="flex-1 overflow-auto">
              <div className="bg-gray-50">
                {/* 이미지 영역 */}
                <div className="relative">
                  {selectedAnnouncement.imageUrl ? (
                    <div className="w-full h-96 bg-gray-200">
                      <img
                        src={selectedAnnouncement.imageUrl}
                        alt={selectedAnnouncement.breed}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-96 bg-yellow-200 flex items-center justify-center">
                      <p className="text-yellow-500 text-xl font-semibold">이미지 없음</p>
                    </div>
                  )}
                </div>

                {/* 정보 영역 */}
                <div className="p-8">
                  {/* 동물 종류 및 품종 */}
                  <div className="mb-8">
                    {/* 동물 종류와 배지 */}
                    <div className="flex items-center mb-2">
                      <p className="text-orange-500 text-xl font-semibold">
                        {animalTypeKo[selectedAnnouncement.animalType] || selectedAnnouncement.animalType}
                      </p>
                      {!isEditMode && (
                        <span className={`ml-auto px-4 py-2 ${statusColor[selectedAnnouncement.announcementStatus]} text-white text-sm font-bold rounded-full shadow-md`}>
                          {statusKo[selectedAnnouncement.announcementStatus]}
                        </span>
                      )}
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800">
                      {selectedAnnouncement.breed}
                    </h1>
                  </div>

                  {/* 상태 배지 (수정 모드) */}
                  {isEditMode && (
                    <div className="mb-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        공고 상태
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      >
                        <option value="OPEN">공고 중</option>
                        <option value="IN_PROGRESS">입양 진행중</option>
                        <option value="COMPLETED">입양 완료</option>
                        <option value="CLOSED">종료</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-3 mb-8">
                    {/* 나이 */}
                    <div className="flex items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium text-sm w-32">나이</span>
                      <span className="text-gray-700 text-sm">{selectedAnnouncement.age}세</span>
                    </div>

                    {/* 성별 */}
                    <div className="flex items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium text-sm w-32">성별</span>
                      <span className="text-gray-700 text-sm">
                        {genderKo[selectedAnnouncement.gender] || selectedAnnouncement.gender}
                      </span>
                    </div>

                    {/* 건강 상태 */}
                    <div className="flex items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium text-sm w-32">건강 상태</span>
                      <span className="text-gray-700 text-sm">
                        {healthKo[selectedAnnouncement.health] || selectedAnnouncement.health}
                      </span>
                    </div>

                    {/* 보호소 */}
                    <div className="flex items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium text-sm w-32">보호소</span>
                      <span className="text-gray-700 text-sm">{selectedAnnouncement.shelterName}</span>
                    </div>

                    {/* 등록일 */}
                    <div className="flex items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium text-sm w-32">등록일</span>
                      <span className="text-gray-700 text-sm">
                        {new Date(selectedAnnouncement.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* 공고 종료일 */}
                    <div className="flex items-center border-b border-gray-200 pb-3">
                      <span className="text-gray-600 font-medium text-sm w-32">공고 종료일</span>
                      {isEditMode ? (
                        <input
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                        />
                      ) : (
                        <span className="text-gray-700 text-sm">
                          {selectedAnnouncement.endDate
                            ? new Date(selectedAnnouncement.endDate).toLocaleDateString()
                            : "미정"}
                        </span>
                      )}
                    </div>

                    {/* 성격 및 특징 */}
                    <div className="pt-4">
                      <h3 className="text-gray-600 font-medium text-sm mb-3">
                        성격 및 특징
                      </h3>
                      <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                        {selectedAnnouncement.personality}
                      </p>
                    </div>
                  </div>

                  {/* 버튼 영역 */}
                  <div className="flex gap-4 pt-6">
                    {isEditMode ? (
                      <>
                        <button
                          onClick={handleCancel}
                          className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSave}
                          className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-full font-semibold hover:bg-yellow-500 transition"
                        >
                          저장
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => router.push(`/announcements/${selectedAnnouncementId}/applications`)}
                          className="flex-1 px-6 py-3 bg-blue-400 text-white rounded-full font-semibold hover:bg-blue-500 transition"
                        >
                          신청 내역
                        </button>
                        <button
                          onClick={() => setIsEditMode(true)}
                          className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-full font-semibold hover:bg-yellow-500 transition"
                        >
                          수정
                        </button>
                        <button
                          onClick={confirmDelete}
                          className="flex-1 px-6 py-3 bg-orange-400 text-white rounded-full font-semibold hover:bg-red-500 transition"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleDelete}
        title="삭제 확인"
        message="정말 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        type="error"
      />

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
