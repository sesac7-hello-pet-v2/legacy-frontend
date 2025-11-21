"use client";

import { formatPhoneNumber } from "@/app/lib/formatPhoneNumber";
import { useRouter } from "next/navigation";

const statusColor = {
    "신청서 제출": "bg-[rgb(255,245,196)] text-gray-800",
    "검토 중": "bg-[rgb(255,222,167)] text-gray-800",
    "승인": "bg-[rgb(160,177,135)] text-white",
    "거절": "bg-[rgb(231,116,116)] text-white",
};

const gradeColor = {
    "A": "bg-green-500 text-white",
    "B": "bg-blue-500 text-white",
    "C": "bg-yellow-500 text-white",
    "D": "bg-orange-500 text-white",
    "F": "bg-red-500 text-white",
};

const scoreStatusColor = {
    "정상": "text-green-600",
    "주의": "text-orange-600",
    "탈락": "text-red-600",
};

export default function AnnouncementApplicationItem({ application, onApprove }) {
    const router = useRouter();

    return (
        <div className="flex items-center border-b border-gray-300 py-3">
            {/* 상태 뱃지 - 너비 넓게 */}
            <div className="w-28 mr-6">
                <span className={`inline-block px-3 py-1 text-sm rounded-xl font-semibold ${statusColor[application.applicationStatusLabel] || 'bg-gray-200 text-gray-700'}`}>
                    {application.applicationStatusLabel}
                </span>
            </div>

            {/* 중간 영역 - 사용자 정보와 점수를 함께 배치 */}
            <div className="flex-1 flex justify-between items-center gap-4">
                {/* 사용자 정보 */}
                <div className="flex items-center gap-4">
                    <span className="w-20 text-sm">{application.userName}</span>
                    <span className="w-32 text-sm">{formatPhoneNumber(application.userPhoneNumber)}</span>
                    <span className="text-sm text-gray-600">{application.userEmail}</span>
                </div>

                {/* 버튼 및 점수 영역 */}
                <div className="flex items-center gap-4">
                    {/* 점수 정보 */}
                    {application.totalScore !== undefined && application.totalScore !== null && (
                        <div className="flex items-center gap-2 mr-2">
                            <span className={`px-2 py-0.5 text-xs rounded font-bold ${gradeColor[application.grade] || 'bg-gray-400 text-white'}`}>
                                {application.grade}
                            </span>
                            <span className={`font-bold text-sm ${scoreStatusColor[application.scoreStatus] || 'text-gray-700'}`}>
                                {application.totalScore}점
                            </span>
                        </div>
                    )}

                    {/* 버튼들 */}
                    <button
                        onClick={() => router.push(`/applications/${application.applicationId}`)}
                        className="bg-amber-400 text-white text-sm px-3 py-1 rounded-xl hover:bg-amber-500"
                    >
                        신청서 보기
                    </button>
                    <button
                        onClick={onApprove}
                        className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-xl hover:bg-amber-200 ml-1"
                    >
                        승인하기
                    </button>
                </div>
            </div>
        </div>
    );
}