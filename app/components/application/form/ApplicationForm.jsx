"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/app/lib/api";
import { useUserStore } from "@/app/store/UserStore";
import {
    initialHousingInfo,
    initialFamilyInfo,
    initialCareInfo,
    initialFinancialInfo,
    initialPetExperienceInfo,
    initialFuturePlanInfo,
    initialAgreement,
} from "@/app/components/application/form/initialStates";
import AgreementSection from "./section/AgreementSection";
import ApplicationInfoSection from "./section/ApplicationInfoSection";
import HousingSection from "./section/HousingSection";
import FamilySection from "./section/FamilySection";
import CareSection from "./section/CareSection";
import FinancialSection from "./section/FinancialSection";
import PetExperienceSection from "./section/PetExperienceSection";
import FuturePlanSection from "./section/FuturePlanSection";

export default function ApplicationForm() {
    const router = useRouter();
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id ?? "0";
    const announcementId = Number(id);

    const { user } = useUserStore();
    const [userDetail, setUserDetail] = useState(null);
    const [shelterInfo, setShelterInfo] = useState(null);

    // 단계 관리
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 8;

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
            api.get("/v1/users")
                .then((res) => setUserDetail(res.data))
                .catch((err) => console.error("사용자 상세 조회 실패", err));
        }
    }, [user]);

    // 공고 상세 정보 조회 → 보호소 정보 포함
    useEffect(() => {
        api.get(`/v1/announcements/${announcementId}`)
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

        const payload = {
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
            await api.post("/v1/applications", payload);
            alert("입양 신청이 접수되었습니다.");
            router.push(`/announcements/${announcementId}`);
        } catch (error) {
            alert("신청에 실패했습니다: " + (error.response?.data?.message || error.message));
        }
    };

    // 다음 단계로 이동
    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 이전 단계로 이동
    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // 단계별 섹션 렌더링
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ApplicationInfoSection
                        reason={reason}
                        setReason={setReason}
                        name={userDetail?.username || userDetail?.nickname || user?.nickname || "-"}
                        phoneNumber={userDetail?.phoneNumber || "-"}
                        email={userDetail?.email || user?.email || "-"}
                        shelterInfo={
                            shelterInfo
                                ? { name: shelterInfo.shelterName, id: shelterInfo.shelterId }
                                : undefined
                        }
                    />
                );
            case 2:
                return <HousingSection housingInfo={housingInfo} setHousingInfo={setHousingInfo} />;
            case 3:
                return <FamilySection familyInfo={familyInfo} setFamilyInfo={setFamilyInfo} />;
            case 4:
                return <CareSection careInfo={careInfo} setCareInfo={setCareInfo} />;
            case 5:
                return (
                    <FinancialSection
                        financialInfo={financialInfo}
                        setFinancialInfo={setFinancialInfo}
                    />
                );
            case 6:
                return (
                    <PetExperienceSection
                        petExperienceInfo={petExperienceInfo}
                        setPetExperienceInfo={setPetExperienceInfo}
                    />
                );
            case 7:
                return (
                    <FuturePlanSection
                        futurePlanInfo={futurePlanInfo}
                        setFuturePlanInfo={setFuturePlanInfo}
                    />
                );
            case 8:
                return <AgreementSection agreement={agreement} setAgreement={setAgreement} />;
            default:
                return null;
        }
    };

    // 단계 제목
    const getStepTitle = () => {
        const titles = [
            "기본 정보",
            "주거 환경",
            "가족 구성",
            "돌봄 계획",
            "경제적 준비",
            "반려동물 경험",
            "미래 계획",
            "최종 확인 및 동의"
        ];
        return titles[currentStep - 1];
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-[#FFFDF0] shadow rounded-xl space-y-6 my-10">
            <h1 className="text-xl font-bold text-center mb-4">입양 신청서</h1>

            {/* 진행률 표시 */}
            <div className="flex items-center justify-center space-x-3 mb-6">
                <span className="text-sm text-gray-600">단계</span>
                <span className="font-bold text-amber-500">{currentStep}/{totalSteps}</span>
                <span className="text-sm text-gray-600">- {getStepTitle()}</span>
            </div>

            {/* 진행률 바 */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
                <div
                    className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
            </div>

            {/* 현재 단계 내용 */}
            <div className="min-h-[400px]">
                {renderStep()}
            </div>

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-300">
                <button
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`py-2 px-6 rounded-xl font-semibold transition-all ${
                        currentStep === 1
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    }`}
                >
                    이전
                </button>

                {currentStep === totalSteps ? (
                    <button
                        onClick={handleSubmit}
                        className="bg-amber-400 text-white font-semibold py-2 px-6 rounded-xl hover:bg-amber-500 transition-all"
                    >
                        입양 신청 제출
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="bg-amber-400 text-white font-semibold py-2 px-6 rounded-xl hover:bg-amber-500 transition-all"
                    >
                        다음
                    </button>
                )}
            </div>
        </div>
    );
}