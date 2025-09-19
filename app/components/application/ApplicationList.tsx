"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/app/lib/api";
import ApplicationItem from "@/app/components/application/ApplicationItem";
import ConfirmModal from "@/app/components/ConfirmModal";
import Pagination from "@/app/components/Pagination";

interface Application {
    applicationId: number;
    announcementId: number;
    applicationStatusLabel: string;
    submittedAt: string;
    petImageUrl: string;
}

export default function ApplicationList() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const searchParams = useSearchParams();
    const currentPage = useMemo(() => Number(searchParams.get("page")) || 1, [searchParams]);

    useEffect(() => {
        fetchApplications(currentPage);
    }, [searchParams]);

    const fetchApplications = async (pageNum: number) => {
        try {
            const res = await api.get(`/me/applications?page=${pageNum - 1}&size=10`);
            setApplications(res.data.applications);
            setTotalPages(res.data.totalPages);
        } catch (e) {
            alert("신청 내역을 불러오지 못했습니다.");
        }
    };

    const handleDelete = async () => {
        if (selectedId === null) return;
        try {
            await api.delete(`/applications/${selectedId}`);
            alert("신청서가 삭제되었습니다.");
            setSelectedId(null);
            fetchApplications(currentPage); // 현재 페이지로 재조회
        } catch (e) {
            alert("신청서 삭제에 실패했습니다.");
        }
    };

    return (
        <div>
            {applications.length === 0 ? (
                <div className="text-center text-gray-500 py-10">입양 신청 내역이 없습니다.</div>
            ) : (
                applications.map((app) => (
                    <ApplicationItem
                        key={app.applicationId}
                        application={app}
                        onClick={() => {
                            if (app.applicationStatusLabel === "승인") {
                                alert("승인된 신청서는 삭제할 수 없습니다.");
                                return;
                            }
                            setSelectedId(app.applicationId);
                        }}
                    />
                ))
            )}

            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination currentPage={currentPage} totalPages={totalPages} blockSize={5} />
                </div>
            )}

            {selectedId !== null && (
                <ConfirmModal
                    message="신청서를 삭제하시겠습니까?"
                    onConfirm={handleDelete}
                    onCancel={() => setSelectedId(null)}
                />
            )}
        </div>
    );
}
