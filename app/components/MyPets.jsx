"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
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

export default function MyPets() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ message: "", type: "info" });

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
            setAlertConfig({
                message: "펫 목록을 불러올 수 없습니다. 콘솔을 확인해주세요.",
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
                        <Link href={`/pets/${pet.id}`} className="block group transition">
                            {pet.thumbnailUrl ? (
                                <img
                                    src={pet.thumbnailUrl}
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
                        </Link>
                    </li>
                ))}
            </ul>
            {pets.length === 0 && (
                <p className="text-center text-gray-500 mt-10">등록된 동물이 없습니다.</p>
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
