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

export default function PetDetailPage() {
    const router = useRouter();
    const params = useParams();
    const petId = params?.id;

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [selectedEndDate, setSelectedEndDate] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ message: "", type: "info" });
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [formData, setFormData] = useState({
        animalType: "DOG",
        breed: "",
        gender: "MALE",
        health: "HEALTHY",
        personality: "",
        age: 1,
        imageUrl: "",
    });

    useEffect(() => {
        if (petId) {
            fetchPetDetail();
        }
    }, [petId]);

    async function fetchPetDetail() {
        try {
            const res = await api.get(`/v1/pets/${petId}`);
            const petData = res.data;
            setPet(petData);
            setFormData({
                animalType: petData.animalType,
                breed: petData.breed,
                gender: petData.gender,
                health: petData.health,
                personality: petData.personality,
                age: petData.age,
                imageUrl: petData.imageUrl || "",
            });
        } catch (err) {
            console.error("펫 상세 정보 불러오기 실패", err);
            setAlertConfig({
                message: "펫 정보를 불러올 수 없습니다.",
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
            [name]: name === "age" ? parseInt(value) || 1 : value,
        }));
    };

    function confirmDelete() {
        setShowDeleteConfirmModal(true);
    }

    async function handleDelete() {
        try {
            await api.delete(`/v1/pets/${petId}`);
            setAlertConfig({
                message: "삭제가 완료되었습니다!",
                type: "success"
            });
            setShowAlertModal(true);
            setTimeout(() => router.push("/me"), 1500);
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
        // 유효성 검사
        if (!formData.breed.trim()) {
            setAlertConfig({
                message: "품종을 입력해주세요.",
                type: "warning"
            });
            setShowAlertModal(true);
            return;
        }
        if (!formData.personality.trim()) {
            setAlertConfig({
                message: "성격/특징을 입력해주세요.",
                type: "warning"
            });
            setShowAlertModal(true);
            return;
        }
        if (formData.age < 0) {
            setAlertConfig({
                message: "올바른 나이를 입력해주세요.",
                type: "warning"
            });
            setShowAlertModal(true);
            return;
        }

        try {
            await api.patch(`/v1/pets/${petId}`, formData);
            setAlertConfig({
                message: "수정이 완료되었습니다!",
                type: "success"
            });
            setShowAlertModal(true);
            setIsEditMode(false);
            fetchPetDetail(); // 데이터 다시 불러오기
        } catch (err) {
            console.error("수정 실패", err);
            setAlertConfig({
                message: "수정에 실패했습니다.",
                type: "error"
            });
            setShowAlertModal(true);
        }
    }

    function openDateModal() {
        // 최소 날짜를 오늘로 설정
        const today = new Date();
        const minDate = today.toISOString().split("T")[0];
        setSelectedEndDate(minDate);
        setShowDateModal(true);
    }

    function handleConfirmAnnouncement() {
        if (!selectedEndDate) {
            setAlertConfig({
                message: "공고 종료일을 선택해주세요.",
                type: "warning"
            });
            setShowAlertModal(true);
            return;
        }
        // 확인 모달을 표시하기 전에 날짜 선택 모달 닫기
        setShowDateModal(false);
        setShowConfirmModal(true);
    }

    async function handleCreateAnnouncement() {
        try {
            await api.post("/v1/announcements", {
                petId: petId,
                endDate: selectedEndDate,
            });

            setSelectedEndDate("");
            setAlertConfig({
                message: "공고 등록이 완료되었습니다!",
                type: "success"
            });
            setShowAlertModal(true);

            // 데이터 갱신
            fetchPetDetail();
        } catch (err) {
            console.error("공고 등록 실패", err);

            // 백엔드 에러 메시지 처리
            const errorMessage = err.response?.data?.message || "공고 등록에 실패했습니다.";
            setAlertConfig({
                message: errorMessage,
                type: "error"
            });
            setShowAlertModal(true);
        }
    }

    function handleCancel() {
        setIsEditMode(false);
        // 원래 데이터로 되돌리기
        if (pet) {
            setFormData({
                animalType: pet.animalType,
                breed: pet.breed,
                gender: pet.gender,
                health: pet.health,
                personality: pet.personality,
                age: pet.age,
                imageUrl: pet.imageUrl || "",
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

    if (!pet) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-lg text-gray-500">펫 정보를 찾을 수 없습니다.</p>
            </div>
        );
    }

    return (
        <main className="max-w-6xl mx-auto py-12 px-6 bg-white">
            {/* 제목과 상태 배지 */}
            <div className="flex items-center justify-center mb-8">
                <h1 className="text-4xl font-extrabold text-yellow-600 text-center">
                    {pet.breed} 상세정보
                </h1>
                {pet.announced && (
                    <span className="ml-4 px-4 py-2 bg-lime-500 text-white text-sm font-bold rounded-full shadow-md">
                        ✓ 공고 등록됨
                    </span>
                )}
            </div>

            {/* 2단 레이아웃: 이미지 + 정보 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* 왼쪽: 이미지 */}
                <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-md sticky top-8">
                    {formData.imageUrl ? (
                        <img
                            src={formData.imageUrl}
                            alt={formData.breed}
                            className="w-full object-contain"
                            style={{ maxHeight: '600px' }}
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
                        {/* 동물 종류 및 품종 */}
                        <div>
                            {isEditMode ? (
                                <div className="space-y-3">
                                    <select
                                        name="animalType"
                                        value={formData.animalType}
                                        onChange={handleChange}
                                        className="text-xl font-semibold text-orange-500 w-full px-3 py-1 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                                    >
                                        <option value="DOG">강아지</option>
                                        <option value="CAT">고양이</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        placeholder="품종"
                                        className="text-2xl font-bold text-gray-800 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                    />
                                </div>
                            ) : (
                                <>
                                    <p className="flex items-center">
                                        <strong className="w-32 text-orange-500">동물 종류:</strong>
                                        <span className="ml-2 text-gray-900 font-normal">
                                            {animalTypeKo[pet.animalType] || pet.animalType}
                                        </span>
                                    </p>
                                    <p className="flex items-center mt-2">
                                        <strong className="w-32 text-orange-500">품종:</strong>
                                        <span className="ml-2 text-gray-900 font-normal">{pet.breed}</span>
                                    </p>
                                </>
                            )}
                        </div>

                        {/* 나이 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">나이:</strong>
                            {isEditMode ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="0"
                                    className="ml-2 flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            ) : (
                                <span className="ml-2 text-gray-900 font-normal">{pet.age}세</span>
                            )}
                        </p>

                        {/* 성별 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">성별:</strong>
                            {isEditMode ? (
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="ml-2 flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                >
                                    <option value="MALE">수컷</option>
                                    <option value="FEMALE">암컷</option>
                                    <option value="UNKNOWN">미상</option>
                                </select>
                            ) : (
                                <span className="ml-2 text-gray-900 font-normal">
                                    {genderKo[pet.gender] || pet.gender}
                                </span>
                            )}
                        </p>

                        {/* 건강 상태 */}
                        <p className="flex items-center">
                            <strong className="w-32 text-orange-500">건강 상태:</strong>
                            {isEditMode ? (
                                <select
                                    name="health"
                                    value={formData.health}
                                    onChange={handleChange}
                                    className="ml-2 flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                >
                                    <option value="HEALTHY">건강함</option>
                                    <option value="NORMAL">보통</option>
                                    <option value="UNDER_TREATMENT">치료 중</option>
                                    <option value="WEAK">허약함</option>
                                </select>
                            ) : (
                                <span className="ml-2 text-gray-900 font-normal">
                                    {healthKo[pet.health] || pet.health}
                                </span>
                            )}
                        </p>

                        {/* 성격 및 특징 */}
                        <div className="pt-4 border-t border-yellow-200">
                            <strong className="text-orange-500 block mb-2">성격 및 특징:</strong>
                            {isEditMode ? (
                                <>
                                    <textarea
                                        name="personality"
                                        value={formData.personality}
                                        onChange={handleChange}
                                        rows={6}
                                        maxLength={1000}
                                        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formData.personality.length} / 1000자
                                    </p>
                                </>
                            ) : (
                                <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                                    {pet.personality}
                                </p>
                            )}
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
                                {!pet.announced && (
                                    <button
                                        onClick={openDateModal}
                                        className="flex-1 px-6 py-3 bg-lime-500 text-white rounded-lg font-semibold hover:bg-lime-600 transition"
                                    >
                                        공고 등록
                                    </button>
                                )}
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
                    </div>
                </div>
            </div>

            {/* 목록으로 버튼 - 페이지 하단 중앙 */}
            <div className="mt-12 text-center">
                <button
                    onClick={() => router.back()}
                    className="px-8 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
                >
                    목록으로
                </button>
            </div>

            {/* 공고 등록 날짜 선택 모달 */}
            {showDateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            공고 종료일 선택
                        </h2>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                종료 날짜
                            </label>
                            <input
                                type="date"
                                value={selectedEndDate}
                                onChange={(e) => setSelectedEndDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                선택한 날짜:{" "}
                                {selectedEndDate
                                    ? new Date(selectedEndDate).toLocaleDateString("ko-KR")
                                    : "미선택"}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDateModal(false);
                                    setSelectedEndDate("");
                                }}
                                className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleConfirmAnnouncement}
                                className="flex-1 px-6 py-3 bg-lime-500 text-white rounded-full font-semibold hover:bg-lime-600 transition"
                            >
                                등록하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 공고 등록 확인 모달 */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleCreateAnnouncement}
                title="공고 등록 확인"
                message="선택한 날짜로 공고를 등록하시겠습니까?"
                confirmText="등록"
                cancelText="취소"
                type="info"
            />

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
        </main>
    );
}
