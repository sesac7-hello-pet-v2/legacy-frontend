"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/app/lib/api";
import RequireRole from "@/app/components/RequireRole";
import AgreementSection from "@/app/components/application/form/section/AgreementSection";
import ApplicationInfoSection from "@/app/components/application/form/section/ApplicationInfoSection";
import HousingSection from "@/app/components/application/form/section/HousingSection";
import FamilySection from "@/app/components/application/form/section/FamilySection";
import CareSection from "@/app/components/application/form/section/CareSection";
import FinancialSection from "@/app/components/application/form/section/FinancialSection";
import PetExperienceSection from "@/app/components/application/form/section/PetExperienceSection";
import FuturePlanSection from "@/app/components/application/form/section/FuturePlanSection";

export default function ApplicationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const applicationId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await api.get(`/applications/${applicationId}`);
                setData(res.data);
            } catch (e) {
                alert("신청서를 불러오지 못했습니다.");
                router.back();
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [applicationId, router]);

    const handleApprove = async () => {
        try {
            await api.put(`/announcements/${data.announcementId}/applications/${applicationId}`);
            alert("신청이 승인되었습니다.");
            router.push(`/`);
        } catch (e: any) {
            alert("승인에 실패했습니다: " + (e.response?.data?.message || e.message));
        }
    };

    if (loading) return <div className="p-6">로딩 중...</div>;
    if (!data) return null;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#FFFDF0] shadow rounded-xl space-y-6 my-10">
            <h1 className="text-xl font-bold text-center">입양 신청서 상세</h1>
            <p className="text-sm text-gray-500 text-center mb-10">
                제출일: {new Date(data.submittedAt).toISOString().slice(0, 10)}
            </p>

            {/* 상세 정보 섹션들 */}
            <ApplicationInfoSection
                id={data.announcementId}
                name={data.name}
                phoneNumber={data.phoneNumber}
                email={data.email}
                reason={data.reason}
                isReadOnly
            />
            <HousingSection housingInfo={data.housing} isReadOnly />
            <FamilySection familyInfo={data.family} isReadOnly />
            <CareSection careInfo={data.care} isReadOnly />
            <FinancialSection financialInfo={data.financial} isReadOnly />
            <PetExperienceSection petExperienceInfo={data.petExperience} isReadOnly />
            <FuturePlanSection futurePlanInfo={data.futurePlan} isReadOnly />
            <AgreementSection agreement={data.agreement} isReadOnly />

            <div className="flex justify-center mt-6">
                <button
                    onClick={handleApprove}
                    className="bg-amber-400 text-white font-semibold py-2 px-4 rounded hover:bg-amber-500"
                >
                    승인
                </button>
            </div>
        </div>
    );
}
