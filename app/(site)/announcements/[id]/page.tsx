"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/app/lib/api";
import Link from "next/link";

interface AnnouncementDetailResponse {
    id: number;
    breed: string;
    announcementStatus: string;
    animalType: string;
    shelterName: string;
    createdAt: string;
    imageUrl: string;
    gender: string;
    health: string;
    personality: string;
    age: number;
    announcementPeriod: string;
    alreadyApplied: boolean;
}

const statusLabel: Record<"IN_PROGRESS" | "COMPLETED", string> = {
    IN_PROGRESS: "입양 중",
    COMPLETED: "입양 완료",
};

export default function AnnouncementDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const [detail, setDetail] = useState<AnnouncementDetailResponse | null>(null);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!id) return;

        api.get(`/announcements/${id}`)
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

    return (
        <main className="max-w-2xl mx-auto py-12 px-6 bg-white">
            <h1 className="text-4xl font-extrabold mb-8 text-yellow-600 text-center">
                {detail.breed} 상세정보
            </h1>

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
                    { label: "동물 종류", value: detail.animalType },
                    { label: "성별", value: detail.gender },
                    { label: "품종", value: detail.breed },
                    { label: "건강 상태", value: detail.health },
                    { label: "성격", value: detail.personality },
                    { label: "나이", value: `${detail.age}세` },
                    { label: "보호소", value: detail.shelterName },
                    {
                        label: "등록일",
                        value: new Date(detail.createdAt).toLocaleDateString(),
                    },
                    {
                        label: "공고 기간",
                        value: new Date(detail.announcementPeriod).toLocaleDateString(),
                    },
                    {
                        label: "상태",
                        value: statusLabel[
                            detail.announcementStatus as "IN_PROGRESS" | "COMPLETED"
                        ],
                    },
                ].map(({ label, value }, i) => (
                    <p key={i} className="flex items-center">
                        <strong className="w-28 text-orange-500">{label}:</strong>
                        <span className="ml-2 text-gray-900 font-normal">{value}</span>
                    </p>
                ))}
            </section>

            {/* 신청 여부에 따른 버튼 */}
            {detail.alreadyApplied ? (
                <button
                    className="mt-4 w-full rounded-full bg-gray-300 py-3 font-semibold text-white shadow-inner cursor-not-allowed block mx-auto text-center"
                    disabled
                >
                    이미 신청한 공고입니다
                </button>
            ) : (
                <Link
                    href={`/announcements/${detail.id}/apply`}
                    className="mt-4 w-full rounded-full bg-amber-400 py-3 font-semibold text-white shadow-md transition hover:bg-amber-500 block mx-auto text-center"
                >
                    입양 신청하기
                </Link>
            )}

            {/* 공고 목록으로 돌아가기 버튼 추가 */}
            <Link
                href="/announcements"
                className="mt-6 w-full rounded-full border border-yellow-500 text-yellow-600 py-3 font-semibold text-center block hover:bg-yellow-50 transition"
            >
                입양 게시판으로 돌아가기
            </Link>
        </main>
    );
}
