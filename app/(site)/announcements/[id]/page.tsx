"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import Link from "next/link";

interface AnnouncementDetailResponse {
    id: number;
    petId: number;
    breed: string;
    gender: string;
    health: string;
    personality: string;
    age: number;
    shelterId: number;
    shelterName: string;
    createdAt: string;
    endDate: string;
    imageUrl: string;
    announcementStatus: string;
    animalType: string;
    alreadyApplied: boolean;
}

const statusLabel: Record<string, string> = {
    OPEN: "공고 중",
    CLOSED: "마감됨",
    COMPLETED: "입양 완료",
    DELETED: "삭제됨",
};

const statusColor: Record<string, string> = {
    OPEN: "bg-lime-500",
    CLOSED: "bg-red-500",
    COMPLETED: "bg-gray-500",
    DELETED: "bg-gray-400",
};

const animalTypeLabel: Record<string, string> = {
    DOG: "강아지",
    CAT: "고양이",
};

const genderLabel: Record<string, string> = {
    MALE: "수컷",
    FEMALE: "암컷",
    UNKNOWN: "미상",
};

const healthLabel: Record<string, string> = {
    HEALTHY: "건강함",
    NORMAL: "보통",
    UNDER_TREATMENT: "치료 중",
    WEAK: "허약함",
};

export default function AnnouncementDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [detail, setDetail] = useState<AnnouncementDetailResponse | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!id) return;

        api.get(`/v1/announcements/${id}`)
            .then((res) => setDetail(res.data))
            .catch((err) => {
                console.error(err);
                setError("공고 정보를 불러오지 못했습니다.");
            });
    }, [id]);

    if (error) {
        return (
            <main className="max-w-2xl mx-auto py-12 px-6 text-center text-red-600">
                <h1 className="text-2xl font-bold">{error}</h1>
            </main>
        );
    }

    if (!detail) {
        return (
            <main className="max-w-2xl mx-auto py-12 px-6 text-center">
                <p>로딩 중...</p>
            </main>
        );
    }

    // 공고 상태에 따른 신청 가능 여부 판단
    const canApply = detail.announcementStatus === "OPEN" && !detail.alreadyApplied;
    const isClosedOrCompleted = ["CLOSED", "COMPLETED", "DELETED"].includes(detail.announcementStatus);

    return (
        <main className="max-w-2xl mx-auto py-12 px-6 bg-white">
            {/* 제목과 상태 배지 */}
            <div className="flex items-center justify-center mb-8">
                <h1 className="text-4xl font-extrabold text-yellow-600 text-center">
                    {detail.breed} 상세정보
                </h1>
                <span className={`ml-4 px-4 py-2 ${statusColor[detail.announcementStatus]} text-white text-sm font-bold rounded-full shadow-md`}>
                    {statusLabel[detail.announcementStatus]}
                </span>
            </div>

            {detail.imageUrl ? (
                <img
                    src={detail.imageUrl}
                    alt={detail.breed}
                    className="w-full max-w-md rounded-2xl mb-8 object-cover mx-auto shadow-md"
                />
            ) : (
                <div className="w-full max-w-md h-64 bg-gray-100 rounded-2xl mb-8 flex items-center justify-center text-gray-400 mx-auto font-semibold">
                    이미지 없음
                </div>
            )}

            <section className="bg-yellow-50 rounded-2xl p-8 shadow-inner space-y-5 text-gray-800 text-lg">
                {[
                    { label: "동물 종류", value: animalTypeLabel[detail.animalType] || detail.animalType },
                    { label: "성별", value: genderLabel[detail.gender] || detail.gender },
                    { label: "품종", value: detail.breed },
                    { label: "건강 상태", value: healthLabel[detail.health] || detail.health },
                    { label: "나이", value: `${detail.age}세` },
                    { label: "보호소", value: detail.shelterName },
                    {
                        label: "등록일",
                        value: new Date(detail.createdAt).toLocaleDateString(),
                    },
                    {
                        label: "공고 종료일",
                        value: detail.endDate ? new Date(detail.endDate).toLocaleDateString() : "미정",
                    },
                ].map(({ label, value }, i) => (
                    <p key={i} className="flex items-center">
                        <strong className="w-32 text-orange-500">{label}:</strong>
                        <span className="ml-2 text-gray-900 font-normal">{value}</span>
                    </p>
                ))}

                {/* 성격 및 특징 - 여러 줄로 표시 */}
                <div className="pt-4 border-t border-yellow-200">
                    <strong className="text-orange-500 block mb-2">성격 및 특징:</strong>
                    <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                        {detail.personality}
                    </p>
                </div>
            </section>

            {/* 신청 버튼 - 공고 상태에 따라 다르게 표시 */}
            {canApply ? (
                <Link
                    href={`/announcements/${detail.id}/apply`}
                    className="mt-6 w-full rounded-full bg-amber-400 py-3 font-semibold text-white shadow-md transition hover:bg-amber-500 block mx-auto text-center"
                >
                    입양 신청하기
                </Link>
            ) : detail.alreadyApplied ? (
                <button
                    className="mt-6 w-full rounded-full bg-gray-300 py-3 font-semibold text-white shadow-inner cursor-not-allowed block mx-auto text-center"
                    disabled
                >
                    이미 신청한 공고입니다
                </button>
            ) : isClosedOrCompleted ? (
                <button
                    className="mt-6 w-full rounded-full bg-gray-400 py-3 font-semibold text-white shadow-inner cursor-not-allowed block mx-auto text-center"
                    disabled
                >
                    {detail.announcementStatus === "CLOSED" && "마감된 공고입니다"}
                    {detail.announcementStatus === "COMPLETED" && "입양이 완료된 공고입니다"}
                    {detail.announcementStatus === "DELETED" && "삭제된 공고입니다"}
                </button>
            ) : null}

            {/* 공고 목록으로 돌아가기 버튼 */}
            <Link
                href="/announcements"
                className="mt-4 w-full rounded-full border border-yellow-500 text-yellow-600 py-3 font-semibold text-center block hover:bg-yellow-50 transition"
            >
                입양 게시판으로 돌아가기
            </Link>
        </main>
    );
}
