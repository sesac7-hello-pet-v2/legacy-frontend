"use client";

import api from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/UserStore";

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
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
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
            const sorted = (res.data.announcements || []).sort((a, b) => {
                return statusOrder[a.status] - statusOrder[b.status];
            });

            setAnnouncements(sorted);
        } catch (err) {
            console.error("공고 목록 불러오기 실패", err);
            alert("공고 목록을 불러올 수 없습니다.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p className="text-center mt-20 text-lg">불러오는 중…</p>;

    return (
        <div className="min-h-screen bg-white-50 py-10 px-4">
            <h1 className="text-center text-yellow-600 text-3xl font-extrabold mb-10">공고 관리</h1>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {announcements.map((announcement) => (
                    <li
                        key={announcement.id}
                        className="bg-yellow-100 p-5 rounded-2xl shadow-lg hover:shadow-xl transition relative cursor-pointer"
                        onClick={() => router.push(`/my-announcements/${announcement.id}`)}
                    >
                        {/* 상태 배지 */}
                        <div className="absolute top-3 right-3 z-10">
                            <span
                                className={`inline-block px-3 py-1 ${
                                    statusColor[announcement.status]
                                } text-white text-xs font-bold rounded-full shadow-lg`}
                            >
                                {statusKo[announcement.status]}
                            </span>
                        </div>

                        {announcement.imageUrl ? (
                            <img
                                src={announcement.imageUrl}
                                alt={announcement.breed}
                                className="w-full h-48 object-cover rounded-2xl mb-4"
                            />
                        ) : (
                            <div className="w-full h-48 bg-yellow-200 flex items-center justify-center rounded-2xl text-yellow-400 mb-4">
                                이미지 없음
                            </div>
                        )}

                        <h3 className="text-gray-800 text-2xl font-extrabold mb-2">
                            {announcement.breed}
                        </h3>

                        <div className="space-y-1">
                            <p className="text-xs text-gray-600">
                                등록일:{" "}
                                <span className="text-gray-700">
                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                </span>
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            {announcements.length === 0 && (
                <p className="text-center text-gray-500 mt-10">등록된 공고가 없습니다.</p>
            )}
        </div>
    );
}
