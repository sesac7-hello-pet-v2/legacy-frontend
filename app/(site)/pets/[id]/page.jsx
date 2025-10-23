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

export default function PetDetailPage() {
    const router = useRouter();
    const params = useParams();
    const petId = params?.id;

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    const [showDateModal, setShowDateModal] = useState(false);
    const [selectedEndDate, setSelectedEndDate] = useState("");
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
            alert("펫 정보를 불러올 수 없습니다.");
            router.back();
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

    async function handleDelete() {
        const confirmed = confirm("정말 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await api.delete(`/v1/pets/${petId}`);
            alert("삭제 완료!");
            router.push("/me");
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 실패");
        }
    }

    async function handleSave() {
        // 유효성 검사
        if (!formData.breed.trim()) {
            alert("품종을 입력해주세요.");
            return;
        }
        if (!formData.personality.trim()) {
            alert("성격/특징을 입력해주세요.");
            return;
        }
        if (formData.age < 0) {
            alert("올바른 나이를 입력해주세요.");
            return;
        }

        try {
            await api.patch(`/v1/pets/${petId}`, formData);
            alert("수정 완료!");
            setIsEditMode(false);
            fetchPetDetail(); // 데이터 다시 불러오기
        } catch (err) {
            console.error("수정 실패", err);
            alert("수정에 실패했습니다.");
        }
    }

    function openDateModal() {
        // 최소 날짜를 오늘로 설정
        const today = new Date();
        const minDate = today.toISOString().slice(0, 16);
        setSelectedEndDate(minDate);
        setShowDateModal(true);
    }

    async function handleCreateAnnouncement() {
        if (!selectedEndDate) {
            alert("공고 종료일을 선택해주세요.");
            return;
        }

        try {
            await api.post("/v1/announcements", {
                petId: petId,
                endDate: selectedEndDate,
            });
            alert("공고 등록 완료!");
            setShowDateModal(false);
            setSelectedEndDate("");
            fetchPetDetail(); // 데이터 다시 불러오기
        } catch (err) {
            console.error("공고 등록 실패", err);
            alert("공고 등록에 실패했습니다.");
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
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* 이미지 영역 */}
                <div className="relative">
                    {formData.imageUrl ? (
                        <div className="w-full h-96 bg-gray-200">
                            <img
                                src={formData.imageUrl}
                                alt={formData.breed}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-96 bg-yellow-200 flex items-center justify-center">
                            <p className="text-yellow-500 text-xl font-semibold">이미지 없음</p>
                        </div>
                    )}
                    {isEditMode && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
                            <input
                                type="url"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="이미지 URL을 입력하세요"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm"
                            />
                        </div>
                    )}
                </div>

                {/* 정보 영역 */}
                <div className="p-8">
                    {/* 동물 종류 및 품종 */}
                    <div className="mb-8">
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
                                    className="text-4xl font-extrabold text-gray-800 w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            </div>
                        ) : (
                            <>
                                <p className="text-orange-500 text-xl font-semibold mb-2">
                                    {animalTypeKo[pet.animalType] || pet.animalType}
                                </p>
                                <h1 className="text-4xl font-extrabold text-gray-800">
                                    {pet.breed}
                                </h1>
                            </>
                        )}
                    </div>

                    <div className="space-y-3 mb-8">
                        {/* 나이 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-24">나이</span>
                            {isEditMode ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="0"
                                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                />
                            ) : (
                                <span className="text-gray-700 text-sm">{pet.age}세</span>
                            )}
                        </div>

                        {/* 성별 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-24">성별</span>
                            {isEditMode ? (
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                >
                                    <option value="MALE">수컷</option>
                                    <option value="FEMALE">암컷</option>
                                    <option value="UNKNOWN">미상</option>
                                </select>
                            ) : (
                                <span className="text-gray-700 text-sm">
                                    {genderKo[pet.gender] || pet.gender}
                                </span>
                            )}
                        </div>

                        {/* 건강 상태 */}
                        <div className="flex items-center border-b border-gray-200 pb-3">
                            <span className="text-gray-600 font-medium text-sm w-24">
                                건강 상태
                            </span>
                            {isEditMode ? (
                                <select
                                    name="health"
                                    value={formData.health}
                                    onChange={handleChange}
                                    className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                                >
                                    <option value="HEALTHY">건강함</option>
                                    <option value="NORMAL">보통</option>
                                    <option value="UNDER_TREATMENT">치료 중</option>
                                    <option value="WEAK">허약함</option>
                                </select>
                            ) : (
                                <span className="text-gray-700 text-sm">
                                    {healthKo[pet.health] || pet.health}
                                </span>
                            )}
                        </div>

                        {/* 성격 및 특징 */}
                        <div className="pt-4">
                            <h3 className="text-gray-600 font-medium text-sm mb-3">성격 및 특징</h3>
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
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                    {pet.personality}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 공고 등록 배지 */}
                    {pet.announced && (
                        <div className="mb-4 text-center">
                            <span className="inline-block px-4 py-2 bg-lime-500 text-white text-sm font-bold rounded-full shadow-md">
                                ✓ 공고 등록됨
                            </span>
                        </div>
                    )}

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
                                    onClick={() => router.back()}
                                    className="flex-1 px-6 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-400 transition"
                                >
                                    목록으로
                                </button>
                                {!pet.announced && (
                                    <button
                                        onClick={openDateModal}
                                        className="flex-1 px-6 py-3 bg-lime-500 text-white rounded-full font-semibold hover:bg-lime-600 transition"
                                    >
                                        공고 등록
                                    </button>
                                )}
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

            {/* 공고 등록 날짜 선택 모달 */}
            {showDateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            공고 종료일 선택
                        </h2>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                종료 날짜 및 시간
                            </label>
                            <input
                                type="datetime-local"
                                value={selectedEndDate}
                                onChange={(e) => setSelectedEndDate(e.target.value)}
                                min={new Date().toISOString().slice(0, 16)}
                                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                선택한 날짜:{" "}
                                {selectedEndDate
                                    ? new Date(selectedEndDate).toLocaleString("ko-KR")
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
                                onClick={handleCreateAnnouncement}
                                className="flex-1 px-6 py-3 bg-lime-500 text-white rounded-full font-semibold hover:bg-lime-600 transition"
                            >
                                등록하기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
