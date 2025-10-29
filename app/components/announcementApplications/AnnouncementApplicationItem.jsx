"use client";

import { formatPhoneNumber } from "@/app/lib/formatPhoneNumber";
import { useRouter } from "next/navigation";

const statusColor = {
    "신청서 제출": "bg-[rgb(255,245,196)] text-gray-800",
    "검토 중": "bg-[rgb(255,222,167)] text-gray-800",
    "승인": "bg-[rgb(160,177,135)] text-white",
    "거절": "bg-[rgb(231,116,116)] text-white",
};

export default function AnnouncementApplicationItem({ application, onApprove }) {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center border-b border-gray-300 py-2">
            <div className="flex-1 flex space-x-6 text-base items-center">
                {/* 상태 뱃지 */}
                <span className={`px-3 py-0.5 text-sm rounded-xl font-semibold ${statusColor[application.applicationStatusLabel] || 'bg-gray-200 text-gray-700'}`}>
                    {application.applicationStatusLabel}
                </span>

                {/* 사용자 정보 */}
                <span className="w-24">{application.userName}</span>
                <span className="w-32">{formatPhoneNumber(application.userPhoneNumber)}</span>
                <span className="w-48">{application.userEmail}</span>
            </div>

            {/* 버튼 영역 */}
            <div className="flex space-x-3">
                <button
                    onClick={() => router.push(`/applications/${application.applicationId}`)}
                    className="bg-amber-400 text-white text-sm px-3 py-1 rounded-xl hover:bg-amber-500"
                >
                    신청서 보기
                </button>
                <button
                    onClick={onApprove}
                    className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-xl hover:bg-amber-200"
                >
                    승인하기
                </button>
            </div>
        </div>
    );
}