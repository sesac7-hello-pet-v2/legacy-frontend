"use client";

import AnnouncementApplicationList from "@/app/components/announcementApplications/AnnouncementApplicationList";
import { useParams, useRouter } from "next/navigation";

export default function AnnouncementApplicationsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center mb-4">공고별 신청 내역</h1>

            <AnnouncementApplicationList announcementId={Number(id)} />

            {/* 이전 페이지로 돌아가기 버튼 */}
            <div className="text-right">
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
