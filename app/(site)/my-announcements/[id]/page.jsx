"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

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

export default function AnnouncementDetailPage() {
    const router = useRouter();
    const params = useParams();
    const announcementId = params?.id;

    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        endDate: "",
        status: "OPEN",
    });

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
                endDate: data.endDate ? data.endDate.slice(0, 16) : "",
                status: data.announcementStatus,
            });
        } catch (err) {
            console.error("공고 상세 정보 불러오기 실패", err);
            alert("공고 정보를 불러올 수 없습니다.");
            router.back();
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

    async function handleDelete() {
        const confirmed = confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await api.delete(`/v1/announcements/${announcementId}`);
            alert("삭제 완료!");
            router.push("/my-announcements");
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 실패");
        }
    }

    async function handleSave() {
        try {
            await api.put(`/v1/announcements/${announcementId}`, formData);
            alert("수정 완료!");
            setIsEditMode(false);
            fetchAnnouncementDetail();
        } catch (err) {
            console.error("수정 실패", err);
            alert("수정에 실패했습니다.");
        }
    }

    function handleCancel() {
        setIsEditMode(false);
        if (announcement) {
            setFormData({
                endDate: announcement.endDate ? announcement.endDate.slice(0, 16) : "",
                status: announcement.announcementStatus,
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
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* 이미지 영역 */}
                <div className="relative">
                    {announcement.imageUrl ? (
                        <div className="w-full h-96 bg-gray-200">
                            <img
                                src={announcement.imageUrl}
                                alt={announcement.breed}
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
                        <p className="text-orange-500 text-xl font-semibold mb-2">
                            {animalTypeKo[announcement.animalType] || announcement.animalType}
                        </p>
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            {announcement.breed}
                        </h1>
                    </div>

                    {/* 상태 배지 */}
                    <div className="mb-6">
                        {isEditMode ? (
                            <div>
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
                        ) : (
                            <span
                                className={`inline-block px-4 py-2 ${
                                    statusColor[announcement.announcementStatus]
                                } text-white text-sm font-bold rounded-full shadow-md`}
                            >
                                {statusKo[announcement.announcementStatus]}
                            </span>
                        )}
                    </div>

                    <div className="space-y-3 mb-8">
                        {/* 나이 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-32">나이</span>
                            <span className="text-gray-700 text-sm">{announcement.age}세</span>
                        </div>

                        {/* 성별 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-32">성별</span>
                            <span className="text-gray-700 text-sm">
                                {genderKo[announcement.gender] || announcement.gender}
                            </span>
                        </div>

                        {/* 건강 상태 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-32">
                                건강 상태
                            </span>
                            <span className="text-gray-700 text-sm">
                                {healthKo[announcement.health] || announcement.health}
                            </span>
                        </div>

                        {/* 보호소 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-32">보호소</span>
                            <span className="text-gray-700 text-sm">
                                {announcement.shelterName}
                            </span>
                        </div>

                        {/* 등록일 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-32">등록일</span>
                            <span className="text-gray-700 text-sm">
                                {new Date(announcement.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* 공고 종료일 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-32">
                                공고 종료일
                            </span>
                            {isEditMode ? (
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            ) : (
                                <span className="text-gray-700 text-sm">
                                    {announcement.endDate
                                        ? new Date(announcement.endDate).toLocaleString()
                                        : "미정"}
                                </span>
                            )}
                        </div>

                        {/* 성격 및 특징 */}
                        <div className="pt-4">
                            <h3 className="text-gray-600 font-medium text-sm mb-3">성격 및 특징</h3>
                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {announcement.personality}
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
                                    onClick={() => router.push("/my-announcements")}
                                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition"
                                >
                                    목록으로
                                </button>
                                <button
                                    onClick={() => setIsEditMode(true)}
                                    className="flex-1 px-6 py-3 bg-yellow-400 text-white rounded-full font-semibold hover:bg-yellow-500 transition"
                                >
                                    수정
                                </button>
                                <button
                                    onClick={handleDelete}
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
    );
}
