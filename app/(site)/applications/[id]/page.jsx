"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/api";
import AgreementSection from "@/app/components/application/form/section/AgreementSection";
import ApplicationInfoSection from "@/app/components/application/form/section/ApplicationInfoSection";
import HousingSection from "@/app/components/application/form/section/HousingSection";
import FamilySection from "@/app/components/application/form/section/FamilySection";
import CareSection from "@/app/components/application/form/section/CareSection";
import FinancialSection from "@/app/components/application/form/section/FinancialSection";
import PetExperienceSection from "@/app/components/application/form/section/PetExperienceSection";
import FuturePlanSection from "@/app/components/application/form/section/FuturePlanSection";
import AlertModal from "@/app/components/common/AlertModal";

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const applicationId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [data, setData] = useState(null);
    const [shelterInfo, setShelterInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ isOpen: false, title: "", message: "", type: "success" });

    useEffect(() => {
        async function fetchData() {
            try {
                console.log("Fetching application with ID:", applicationId);
                const res = await api.get(`/v1/applications/${applicationId}`);
                console.log("Application data received:", res.data);

                // 백엔드에서 모든 정보를 포함해서 응답하므로 추가 병합 없이 그대로 사용
                setData({
                    ...res.data,
                    name: res.data.userName,
                });

                // 보호소 정보 설정
                if (res.data.shelterName) {
                    setShelterInfo({
                        name: res.data.shelterName,
                    });
                }
            } catch (e) {
                console.error("Error fetching application:", e);
                console.error("Error response:", e.response);
                setModal({
                    isOpen: true,
                    title: "오류",
                    message: "신청서를 불러오지 못했습니다: " + (e.response?.data?.message || e.message),
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [applicationId, router]);

    const handleApprove = async () => {
        try {
            await api.patch(`/v1/applications/announcement/${data.announcementId}/${applicationId}/approve`);
            setModal({
                isOpen: true,
                title: "승인 완료",
                message: "신청이 승인되었습니다.",
                type: "success",
            });
        } catch (e) {
            setModal({
                isOpen: true,
                title: "승인 실패",
                message: "승인에 실패했습니다: " + (e.response?.data?.message || e.message),
                type: "error",
            });
        }
    };

    const handleModalClose = () => {
        setModal({ isOpen: false, title: "", message: "", type: "success" });
        if (modal.type === "success" && modal.title === "승인 완료") {
            router.push(`/`);
        } else if (modal.type === "error" && modal.message.includes("신청서를 불러오지 못했습니다")) {
            router.back();
        }
    };

    if (loading) return <div className="p-6">로딩 중...</div>;
    if (!data) return null;

    // 제출일 안전하게 포맷팅
    const formatSubmittedDate = (dateStr) => {
        if (!dateStr) return "알 수 없음";
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return "알 수 없음";
            return date.toISOString().slice(0, 10);
        } catch {
            return "알 수 없음";
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#FFFDF0] shadow rounded-xl space-y-6 my-10">
            <h1 className="text-xl font-bold text-center">입양 신청서 상세</h1>
            <div className="text-sm text-gray-500 text-center mb-10 space-y-1">
                <p>공고 번호: {data.announcementId}</p>
                <p>제출일: {formatSubmittedDate(data.createdAt)}</p>
            </div>

            {/* 상세 정보 섹션들 */}
            <ApplicationInfoSection
                name={data.name}
                phoneNumber={data.phoneNumber}
                email={data.email}
                reason={data.reason}
                shelterInfo={shelterInfo}
                isReadOnly
            />
            <HousingSection housingInfo={data.housing} isReadOnly />
            <FamilySection familyInfo={data.family} isReadOnly />
            <CareSection careInfo={data.care} isReadOnly />
            <FinancialSection financialInfo={data.financial} isReadOnly />
            <PetExperienceSection petExperienceInfo={data.petExperience} isReadOnly />
            <FuturePlanSection futurePlanInfo={data.futurePlan} isReadOnly />
            <AgreementSection agreement={data.agreement} isReadOnly />

            <div className="flex justify-center gap-3 mt-6">
                <button
                    onClick={() => router.back()}
                    className="bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-full hover:bg-gray-400"
                >
                    목록으로
                </button>
                <button
                    onClick={handleApprove}
                    className="bg-amber-400 text-white font-semibold py-2 px-6 rounded-full hover:bg-amber-500"
                >
                    승인
                </button>
            </div>

            <AlertModal
                isOpen={modal.isOpen}
                onClose={handleModalClose}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}