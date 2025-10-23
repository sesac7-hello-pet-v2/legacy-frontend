"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function MyPets() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [showModal, setShowModal] = useState(false);
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
    const router = useRouter();

    useEffect(() => {
        fetchMyPets();
    }, []);

    async function fetchMyPets() {
        try {
            console.log("🐾 [MyPets] API 호출 시작");
            console.log("  - URL:", "/v1/pets");
            console.log("  - Cookie 사용 (withCredentials: true)");

            const res = await api.get("/v1/pets");

            console.log("✅ [MyPets] API 호출 성공");
            console.log("  - 응답 데이터:", res.data);

            // 백엔드가 바로 배열을 반환
            setPets(res.data || []);
        } catch (err) {
            console.error("❌ [MyPets] 펫 목록 불러오기 실패", err);
            console.error("  - 에러 상세:", err.response || err);
            alert("펫 목록을 불러올 수 없습니다. 콘솔을 확인해주세요.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchPetDetail(petId) {
        try {
            const res = await api.get(`/v1/pets/${petId}`);
            const petData = res.data;
            setSelectedPet(petData);
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
            setShowModal(false);
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
            await api.delete(`/v1/pets/${selectedPetId}`);
            alert("삭제 완료!");
            setShowModal(false);
            setSelectedPetId(null);
            setSelectedPet(null);
            fetchMyPets();
        } catch (err) {
            console.error("삭제 실패", err);
            alert("삭제 실패");
        }
    }

    async function handleSave() {
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
            await api.patch(`/v1/pets/${selectedPetId}`, formData);
            alert("수정 완료!");
            setIsEditMode(false);
            fetchPetDetail(selectedPetId);
            fetchMyPets();
        } catch (err) {
            console.error("수정 실패", err);
            alert("수정에 실패했습니다.");
        }
    }

    function openDateModal() {
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
                petId: selectedPetId,
                endDate: selectedEndDate,
            });
            alert("공고 등록 완료!");
            setShowDateModal(false);
            setSelectedEndDate("");
            fetchPetDetail(selectedPetId);
            fetchMyPets();
        } catch (err) {
            console.error("공고 등록 실패", err);
            alert("공고 등록에 실패했습니다.");
        }
    }

    function handleCancel() {
        setIsEditMode(false);
        if (selectedPet) {
            setFormData({
                animalType: selectedPet.animalType,
                breed: selectedPet.breed,
                gender: selectedPet.gender,
                health: selectedPet.health,
                personality: selectedPet.personality,
                age: selectedPet.age,
                imageUrl: selectedPet.imageUrl || "",
            });
        }
    }

    function handleOpenModal(petId) {
        setSelectedPetId(petId);
        setShowModal(true);
        setIsEditMode(false);
        fetchPetDetail(petId);
    }

    function handleCloseModal() {
        setShowModal(false);
        setSelectedPetId(null);
        setSelectedPet(null);
        setIsEditMode(false);
        setShowDateModal(false);
    }

    if (loading) return <p className="text-center mt-20 text-lg">불러오는 중…</p>;

    return (
        <div className="min-h-screen bg-white-50 py-10 px-4">
            <h1 className="text-center text-yellow-600 text-3xl font-extrabold mb-10">동물 관리</h1>
            <div className="text-center mb-10">
                <Link
                    href="/pets/create"
                    className="inline-block rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 transition"
                >
                    동물 등록하기
                </Link>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {pets.map((pet) => (
                    <li
                        key={pet.id}
                        className="bg-yellow-100 p-5 rounded-2xl shadow-lg hover:shadow-xl transition relative"
                    >
                        <div
                            className="block group transition cursor-pointer"
                            onClick={() => handleOpenModal(pet.id)}
                        >
                            {pet.imageUrl ? (
                                <img
                                    src={pet.imageUrl}
                                    alt={pet.breed}
                                    className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:opacity-90"
                                />
                            ) : (
                                <div className="w-full h-48 bg-yellow-200 flex items-center justify-center rounded-2xl text-yellow-400 mb-4">
                                    이미지 없음
                                </div>
                            )}

                            {/* 동물 종류와 배지 */}
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-orange-500 text-sm font-semibold">
                                    {animalTypeKo[pet.animalType] || pet.animalType}
                                </p>
                                {pet.announced && (
                                    <span className="px-2 py-1 bg-lime-500 text-white text-xs font-bold rounded-full">
                                        공고 등록
                                    </span>
                                )}
                            </div>
                            <h3 className="text-gray-800 text-2xl font-extrabold mb-3">
                                {pet.breed}
                            </h3>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-600">
                                    나이: <span className="text-gray-700">{pet.age}세</span>
                                </p>
                                <p className="text-xs text-gray-600">
                                    성별:{" "}
                                    <span className="text-gray-700">
                                        {genderKo[pet.gender] || pet.gender}
                                    </span>
                                </p>
                                <p className="text-xs text-gray-600">
                                    건강:{" "}
                                    <span className="text-gray-700">
                                        {healthKo[pet.health] || pet.health}
                                    </span>
                                </p>
                            </div>
                            <p className="text-xs text-gray-600 mt-3 line-clamp-2">
                                {pet.personality}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
            {pets.length === 0 && (
                <p className="text-center text-gray-500 mt-10">등록된 동물이 없습니다.</p>
            )}

            {/* 동물 상세 모달 */}
            {showModal && selectedPet && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col pointer-events-auto">
                        {/* 모달 헤더 */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-800">동물 상세 정보</h2>
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
                                            <p className="text-yellow-500 text-xl font-semibold">
                                                이미지 없음
                                            </p>
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
                                                {/* 동물 종류와 배지 */}
                                                <div className="flex items-center mb-2">
                                                    <p className="text-orange-500 text-xl font-semibold">
                                                        {animalTypeKo[selectedPet.animalType] ||
                                                            selectedPet.animalType}
                                                    </p>
                                                    {selectedPet.announced && (
                                                        <span className="ml-auto inline-block px-4 py-2 bg-lime-500 text-white text-sm font-bold rounded-full shadow-md">
                                                            ✓ 공고 등록됨
                                                        </span>
                                                    )}
                                                </div>
                                                <h1 className="text-4xl font-extrabold text-gray-800">
                                                    {selectedPet.breed}
                                                </h1>
                                            </>
                                        )}
                                    </div>

                                    <div className="space-y-3 mb-8">
                                        {/* 나이 */}
                                        <div className="flex items-center border-b border-gray-200 pb-3">
                                            <span className="text-gray-600 font-medium text-sm w-24">
                                                나이
                                            </span>
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
                                                <span className="text-gray-700 text-sm">
                                                    {selectedPet.age}세
                                                </span>
                                            )}
                                        </div>

                                        {/* 성별 */}
                                        <div className="flex items-center border-b border-gray-200 pb-3">
                                            <span className="text-gray-600 font-medium text-sm w-24">
                                                성별
                                            </span>
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
                                                    {genderKo[selectedPet.gender] ||
                                                        selectedPet.gender}
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
                                                    {healthKo[selectedPet.health] ||
                                                        selectedPet.health}
                                                </span>
                                            )}
                                        </div>

                                        {/* 성격 및 특징 */}
                                        <div className="pt-4">
                                            <h3 className="text-gray-600 font-medium text-sm mb-3">
                                                성격 및 특징
                                            </h3>
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
                                                    {selectedPet.personality}
                                                </p>
                                            )}
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
                                                {!selectedPet.announced && (
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
                        </div>
                    </div>
                </div>
            )}

            {/* 공고 등록 날짜 선택 모달 */}
            {showDateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
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
