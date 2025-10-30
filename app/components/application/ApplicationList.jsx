"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/app/lib/api";
import ApplicationItem from "@/app/components/application/ApplicationItem";
import { ConfirmModal, AlertModal } from "@/app/components/Modal";
import Pagination from "@/app/components/Pagination";

export default function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedId, setSelectedId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ message: "", type: "info" });

    const searchParams = useSearchParams();
    const currentPage = useMemo(() => Number(searchParams.get("page")) || 1, [searchParams]);

    useEffect(() => {
        fetchApplications(currentPage);
    }, [searchParams]);

    const fetchApplications = async (pageNum) => {
        try {
            const res = await api.get(`/v1/applications/user?page=${pageNum - 1}&size=10`);
            setApplications(res.data.applications);
            setTotalPages(res.data.totalPages);
        } catch (e) {
            setAlertConfig({
                message: "신청 내역을 불러오지 못했습니다.",
                type: "error"
            });
            setShowAlertModal(true);
        }
    };

    const handleDelete = async () => {
        if (selectedId === null) return;
        try {
            await api.delete(`/v1/applications/${selectedId}`);
            setSelectedId(null);
            setShowConfirmModal(false);

            setAlertConfig({
                message: "신청서가 삭제되었습니다.",
                type: "success"
            });
            setShowAlertModal(true);

            fetchApplications(currentPage); // 현재 페이지로 재조회
        } catch (e) {
            setShowConfirmModal(false);

            const errorMessage = e.response?.data?.message || "신청서 삭제에 실패했습니다.";
            setAlertConfig({
                message: errorMessage,
                type: "error"
            });
            setShowAlertModal(true);
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
                            // 승인된 신청서는 삭제 불가
                            if (app.applicationStatusLabel === "승인") {
                                setAlertConfig({
                                    message: "승인된 신청서는 삭제할 수 없습니다.",
                                    type: "warning"
                                });
                                setShowAlertModal(true);
                                return;
                            }
                            setSelectedId(app.applicationId);
                            setShowConfirmModal(true);
                        }}
                    />
                ))
            )}

            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination currentPage={currentPage} totalPages={totalPages} blockSize={5} />
                </div>
            )}

            {/* 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => {
                    setShowConfirmModal(false);
                    setSelectedId(null);
                }}
                onConfirm={handleDelete}
                title="신청서 삭제"
                message="정말로 이 신청서를 삭제하시겠습니까?"
                confirmText="삭제"
                cancelText="취소"
                type="warning"
            />

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