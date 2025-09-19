"use client";

import { formatPhoneNumber } from "@/app/lib/formatPhoneNumber";
import { useRouter } from "next/navigation";

interface Props {
    application: {
        applicationId: number;
        applicationStatusLabel: string;
        userName: string;
        userPhoneNumber: string;
        userEmail: string;
    };
    onApprove: () => void;
}

export default function AnnouncementApplicationItem({ application, onApprove }: Props) {
    const router = useRouter();

    return (
        <div className="flex justify-between items-center border-b border-gray-300 py-2">
            <div className="flex-1 flex space-x-6 text-base items-center">
                {/* 상태 뱃지 */}
                <span className="px-3 py-0.5 text-sm rounded-xl bg-gray-200 text-gray-700 font-semibold">
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
