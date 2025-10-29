"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/lib/api";
import AnnouncementApplicationItem from "./AnnouncementApplicationItem";
import ConfirmModal from "@/app/components/ConfirmModal";
import { AlertModal } from "@/app/components/Modal";
import Pagination from "@/app/components/Pagination";

export default function AnnouncementApplicationList({ announcementId }) {
    const [applications, setApplications] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [announcementCreatedAt, setAnnouncementCreatedAt] = useState("");
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showAlertModal, setShowAlertModal] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ message: "", type: "info" });

    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get("page")) || 1;
    const router = useRouter();

    const fetchApplications = async (pageNum) => {
        try {
            const res = await api.get(
                `/v1/applications/announcement/${announcementId}?page=${pageNum - 1}&size=10`
            );

            // 백엔드 필드명을 프론트엔드 필드명으로 매핑
            const mappedApplications = res.data.applications.map((app) => ({
                ...app,
                userPhoneNumber: app.phoneNumber, // phoneNumber → userPhoneNumber
                userEmail: app.email,
            }));

            setApplications(mappedApplications);
            setTotalPages(res.data.totalPages);
            setAnnouncementCreatedAt(res.data.announcementCreatedAt);
        } catch (e) {
            if (e.response?.status === 403) {
                setAlertConfig({
                    message: "해당 공고에 대한 접근 권한이 없습니다.",
                    type: "error"
                });
                setShowAlertModal(true);
                setTimeout(() => router.push("/"), 2000);
            } else {
                setAlertConfig({
                    message: "신청 내역을 불러오는 중 오류가 발생했습니다.",
                    type: "error"
                });
                setShowAlertModal(true);
            }
        }
    };

    useEffect(() => {
        fetchApplications(currentPage);
    }, [currentPage]);

    const handleApprove = async () => {
        if (selectedAppId === null) return;
        try {
            await api.patch(`/v1/applications/announcement/${announcementId}/${selectedAppId}/approve`);
            setAlertConfig({
                message: "신청이 승인되었습니다.",
                type: "success"
            });
            setShowAlertModal(true);
            await fetchApplications(currentPage);
        } catch (e) {
            setAlertConfig({
                message: "승인에 실패했습니다: " + (e.response?.data?.message || e.message),
                type: "error"
            });
            setShowAlertModal(true);
        } finally {
            setSelectedAppId(null);
        }
    };

    // 날짜 안전하게 포맷팅
    const formatDate = (dateStr) => {
        if (!dateStr) return "-";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "-";
            return date.toISOString().slice(0, 10);
        } catch {
            return "-";
        }
    };

    return (
        <div className="space-y-4">
            {/* 상단 공고 정보 */}
            <div className="flex justify-between items-center border-b pb-2 text-lg">
                <span className="font-semibold text-gray-700">공고 번호</span>
                <span>{announcementId}</span>
                <span>{formatDate(announcementCreatedAt)}</span>
            </div>

            {/* 신청자 리스트 또는 없음 안내 */}
            {applications.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    해당 공고에 접수된 신청 내역이 없습니다.
                </div>
            ) : (
                applications.map((app) => (
                    <AnnouncementApplicationItem
                        key={app.applicationId}
                        application={app}
                        onApprove={() => setSelectedAppId(app.applicationId)}
                    />
                ))
            )}

            {/* 페이지네이션 */}
            {totalPages > 1 && (
                <div className="mt-6">
                    <Pagination currentPage={currentPage} totalPages={totalPages} blockSize={5} />
                </div>
            )}

            {/* 승인 모달 */}
            {selectedAppId !== null && (
                <ConfirmModal
                    message="해당 신청서를 승인하시겠습니까?"
                    onConfirm={handleApprove}
                    onCancel={() => setSelectedAppId(null)}
                />
            )}

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