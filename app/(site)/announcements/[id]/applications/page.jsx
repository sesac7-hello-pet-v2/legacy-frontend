"use client";

import AnnouncementApplicationList from "@/app/components/announcementApplications/AnnouncementApplicationList";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function AnnouncementApplicationsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [minScore, setMinScore] = useState("");
    const [orderBy, setOrderBy] = useState("createdAt");

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center mb-4">공고별 신청 내역</h1>

            <AnnouncementApplicationList
                announcementId={Number(id)}
                minScore={minScore}
                orderBy={orderBy}
            />

            {/* 필터링 컨트롤과 뒤로가기 버튼을 아래에 같은 라인에 */}
            <div className="flex justify-between items-center">
                {/* 필터링 및 정렬 */}
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">최소 점수</label>
                        <input
                            type="number"
                            value={minScore}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                    setMinScore('');
                                    return;
                                }
                                const numValue = parseInt(value);
                                if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                                    setMinScore(value);
                                }
                            }}
                            placeholder="0-100"
                            min="0"
                            max="100"
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">정렬</label>
                        <select
                            value={orderBy}
                            onChange={(e) => setOrderBy(e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
                        >
                            <option value="createdAt">최신순</option>
                            <option value="score">점수 높은순</option>
                        </select>
                    </div>
                </div>

                {/* 뒤로 가기 버튼 */}
                <button
                    onClick={() => router.back()}
                    className="text-sm text-gray-600 border border-gray-300 px-3 py-1 rounded hover:bg-gray-100 transition"
                >
                    뒤로 가기
                </button>
            </div>
        </div>
    );
}