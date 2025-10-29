"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

export default function AnnouncementDetailPage() {
    const router = useRouter();
    const params = useParams();
    const announcementId = params?.id;

    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        endDate: "",
    });
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ message: "", type: "info" });

    useEffect(() => {
        if (announcementId) {
            fetchAnnouncementDetail();
        }
    }, [announcementId]);

    async function fetchAnnouncementDetail() {
        try {
            const res = await api.get(`/v1/announcements/${announcementId}`);
            const data = res.data;
            setAnnouncement(data);
            setFormData({
                endDate: data.endDate ? data.endDate.split("T")[0] : "",
            });
        } catch (err) {
            console.error("공고 상세 정보 불러오기 실패", err);
            setAlertConfig({
                message: "공고 정보를 불러올 수 없습니다.",
                type: "error"
            });
            setShowAlertModal(true);
            setTimeout(() => router.back(), 2000);
        } finally {
            setLoading(false);
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
            await api.delete(`/v1/announcements/${announcementId}`);
            setAlertConfig({
                message: "삭제가 완료되었습니다!",
                type: "success"
            });
            setShowAlertModal(true);
            fetchAnnouncementDetail(); // 삭제 후 데이터 새로고침
        } catch (err) {
            console.error("삭제 실패", err);
            setAlertConfig({
                message: "삭제에 실패했습니다.",
                type: "error"
            });
            setShowAlertModal(true);
        }
    }

    function handleAlertClose() {
        setShowAlertModal(false);
    }

    async function handleSave() {
        try {
            await api.put(`/v1/announcements/${announcementId}`, formData);
            setAlertConfig({
                message: "수정이 완료되었습니다!",
                type: "success"
            });
            setShowAlertModal(true);
            setIsEditMode(false);
            fetchAnnouncementDetail();
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
        if (announcement) {
            setFormData({
                endDate: announcement.endDate ? announcement.endDate.split("T")[0] : "",
            });
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-500">불러오는 중...</p>
            </div>
        );
    }

    if (!announcement) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-500">공고 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <main className="max-w-6xl mx-auto py-12 px-6 bg-white">
            {/* 제목과 상태 배지 */}
            <div className="flex items-center justify-center mb-8">
                <h1 className="text-4xl font-extrabold text-yellow-600 text-center">
                    {announcement.breed} 상세정보
                </h1>
                <span className={`ml-4 px-4 py-2 ${statusColor[announcement.announcementStatus]} ${announcement.announcementStatus === "OPEN" ? "text-gray-800" : "text-white"} text-sm font-bold rounded-full shadow-md`}>
                    {statusKo[announcement.announcementStatus]}
                </span>
            </div>

            {/* 2단 레이아웃: 이미지 + 정보 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* 왼쪽: 이미지 */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-md sticky top-8">
                    {announcement.imageUrl ? (
                        <img
                            src={announcement.imageUrl}
                            alt={announcement.breed}
                            className="w-full object-contain"
                            style={{ maxHeight: "600px" }}
                        />
                    ) : (
                        <div className="w-full flex items-center justify-center text-gray-400 font-semibold h-96">
                            이미지 없음
                        </div>
                    )}
                </div>

                {/* 오른쪽: 정보 + 버튼 */}
                <div className="flex flex-col">
                    {/* 동물 정보 */}
                    <section className="bg-yellow-50 rounded-2xl p-6 shadow-inner space-y-4 text-gray-800 flex-1">
                        {/* 동물 종류 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">동물 종류:</strong>
                            <span className="ml-2 text-gray-900 font-normal">
                                {animalTypeKo[announcement.animalType] || announcement.animalType}
                            </span>
                        </p>

                        {/* 품종 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">품종:</strong>
                            <span className="ml-2 text-gray-900 font-normal">{announcement.breed}</span>
                        </p>

                        {/* 나이 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">나이:</strong>
                            <span className="ml-2 text-gray-900 font-normal">{announcement.age}세</span>
                        </p>

                        {/* 성별 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">성별:</strong>
                            <span className="ml-2 text-gray-900 font-normal">
                                {genderKo[announcement.gender] || announcement.gender}
                            </span>
                        </p>

                        {/* 건강 상태 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">건강 상태:</strong>
                            <span className="ml-2 text-gray-900 font-normal">
                                {healthKo[announcement.health] || announcement.health}
                            </span>
                        </p>

                        {/* 보호소 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">보호소:</strong>
                            <span className="ml-2 text-gray-900 font-normal">
                                {announcement.shelterName}
                            </span>
                        </p>

                        {/* 등록일 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">등록일:</strong>
                            <span className="ml-2 text-gray-900 font-normal">
                                {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                        </p>

                        {/* 공고 종료일 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">공고 종료일:</strong>
                            {isEditMode ? (
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="ml-2 flex-1 px-3 py-2 text-sm border-2 border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-600"
                                />
                            ) : (
                                <span className="ml-2 text-gray-900 font-normal">
                                    {announcement.endDate
                                        ? new Date(announcement.endDate).toLocaleDateString()
                                        : "미정"}
                                </span>
                            )}
                        </p>

                        {/* 성격 및 특징 */}
                        <div className="pt-4 border-t border-yellow-200">
                            <strong className="text-orange-500 block mb-2">성격 및 특징:</strong>
                            <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                                {announcement.personality}
                            </p>
                        </div>
                    </section>

                    {/* 버튼들 - 나란히 배치 */}
                    <div className="mt-6 flex gap-3">
                        {isEditMode ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition"
                                >
                                    저장
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => router.push(`/announcements/${announcementId}/applications`)}
                                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                                >
                                    신청 내역
                                </button>
                                {announcement.announcementStatus === "OPEN" && (
                                    <>
                                        <button
                                            onClick={() => setIsEditMode(true)}
                                            className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-500 transition"
                                        >
                                            수정
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className="flex-1 px-6 py-3 bg-orange-400 text-white rounded-lg font-semibold hover:bg-red-500 transition"
                                        >
                                            삭제
                                        </button>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* 목록으로 버튼 - 페이지 하단 중앙 */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => router.push("/me")}
                    className="px-8 py-3 rounded-full border-2 border-yellow-500 text-yellow-600 font-bold hover:bg-yellow-50 transition"
                >
                    목록으로
                </button>
            </div>

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
                onClose={handleAlertClose}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </main>
    );
}
