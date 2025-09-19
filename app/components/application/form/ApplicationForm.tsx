"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/app/lib/api";
import { UserDetailData, useUserStore } from "@/app/store/UserStore";
import {
    initialHousingInfo,
    initialFamilyInfo,
    initialCareInfo,
    initialFinancialInfo,
    initialPetExperienceInfo,
    initialFuturePlanInfo,
    initialAgreement,
} from "@/app/components/application/form/initialStates";
import { ApplicationPayload } from "@/app/types/application";
import AgreementSection from "./section/AgreementSection";
import ApplicationInfoSection from "./section/ApplicationInfoSection";
import HousingSection from "./section/HousingSection";
import FamilySection from "./section/FamilySection";
import CareSection from "./section/CareSection";
import FinancialSection from "./section/FinancialSection";
import PetExperienceSection from "./section/PetExperienceSection";
import FuturePlanSection from "./section/FuturePlanSection";
import RequireRole from "../../RequireRole";

interface AnnouncementDetailResponse {
    shelterName: string;
    shelterId: number;
}

export default function ApplicationForm() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id ?? "0";
    const announcementId = Number(id);

    const { user } = useUserStore();
    const [userDetail, setUserDetail] = useState<UserDetailData | null>(null);
    const [shelterInfo, setShelterInfo] = useState<AnnouncementDetailResponse | null>(null);

    const [reason, setReason] = useState("");
    const [housingInfo, setHousingInfo] = useState(initialHousingInfo);
    const [familyInfo, setFamilyInfo] = useState(initialFamilyInfo);
    const [careInfo, setCareInfo] = useState(initialCareInfo);
    const [financialInfo, setFinancialInfo] = useState(initialFinancialInfo);
    const [petExperienceInfo, setPetExperienceInfo] = useState(initialPetExperienceInfo);
    const [futurePlanInfo, setFuturePlanInfo] = useState(initialFuturePlanInfo);
    const [agreement, setAgreement] = useState(initialAgreement);

    // 사용자 정보 조회
    useEffect(() => {
        if (user) {
            api.get<UserDetailData>("/me")
                .then((res) => setUserDetail(res.data))
                .catch((err) => console.error("사용자 상세 조회 실패", err));
        }
    }, [user]);

    // 공고 상세 정보 조회 → 보호소 정보 포함
    useEffect(() => {
        api.get<AnnouncementDetailResponse>(`/announcements/${announcementId}`)
            .then((res) => {
                const { shelterName, shelterId } = res.data;
                setShelterInfo({ shelterName, shelterId });
            })
            .catch((err) => console.error("공고 상세 조회 실패", err));
    }, [announcementId]);

    const handleSubmit = async () => {
        if (!agreement.agreedToAccuracy || !agreement.agreedToCare || !agreement.agreedToPrivacy) {
            alert("모든 동의 항목에 체크해주세요.");
            return;
        }

        const payload: ApplicationPayload = {
            announcementId,
            reason,
            housingInfo,
            familyInfo,
            careInfo,
            financialInfo,
            petExperienceInfo,
            futurePlanInfo,
            agreement,
        };

        try {
            await api.post("/applications", payload);
            alert("입양 신청이 접수되었습니다.");
            router.push(`/announcements/${announcementId}`);
        } catch (error: any) {
            alert("신청에 실패했습니다: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <RequireRole allow={["USER"]} fallback="/auth/login">
            <div className="max-w-2xl mx-auto p-6 bg-[#FFFDF0] shadow rounded-xl space-y-6 my-10">
                <h1 className="text-xl font-bold text-center mb-8">입양 신청서</h1>

                <ApplicationInfoSection
                    reason={reason}
                    setReason={setReason}
                    name={userDetail?.nickname || user?.nickname || "-"}
                    phoneNumber={userDetail?.phoneNumber || "-"}
                    email={user?.email || "-"}
                    shelterInfo={
                        shelterInfo
                            ? { nickname: shelterInfo.shelterName, id: shelterInfo.shelterId }
                            : undefined
                    }
                />

                <HousingSection housingInfo={housingInfo} setHousingInfo={setHousingInfo} />
                <FamilySection familyInfo={familyInfo} setFamilyInfo={setFamilyInfo} />
                <CareSection careInfo={careInfo} setCareInfo={setCareInfo} />
                <FinancialSection
                    financialInfo={financialInfo}
                    setFinancialInfo={setFinancialInfo}
                />
                <PetExperienceSection
                    petExperienceInfo={petExperienceInfo}
                    setPetExperienceInfo={setPetExperienceInfo}
                />
                <FuturePlanSection
                    futurePlanInfo={futurePlanInfo}
                    setFuturePlanInfo={setFuturePlanInfo}
                />

                <AgreementSection agreement={agreement} setAgreement={setAgreement} />

                <button
                    onClick={handleSubmit}
                    className="bg-amber-400 text-white font-semibold py-1 px-5 rounded-xl hover:bg-amber-500 mx-auto block mt-20"
                >
                    입양 신청
                </button>
            </div>
        </RequireRole>
    );
}
