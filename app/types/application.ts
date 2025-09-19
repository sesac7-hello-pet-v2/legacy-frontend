export interface HousingInfo {
    housingType: string;
    housingTypeLabel: string;
    residenceType: string;
    residenceTypeLabel: string;
    petAllowed: boolean | null;
    petLivingPlace: string;
    petLivingPlaceLabel: string;
    houseSizeRange: string;
    houseSizeRangeLabel: string;
}

export interface FamilyInfo {
    numberOfHousehold: number;
    hasChildUnder13: boolean | null;
    familyAgreement: string;
    familyAgreementLabel: string;
    hasPetAllergy: boolean | null;
}

export interface CareInfo {
    absenceTime: string;
    absenceTimeLabel: string;
    careTime: string;
    careTimeLabel: string;
}

export interface FinancialInfo {
    monthlyBudget: string;
    monthlyBudgetLabel: string;
    hasEmergencyFund: boolean | null;
}

export interface PetExperienceInfo {
    hasPetExperience: boolean | null;
    experienceDetails?: string;
}

export interface FuturePlanInfo {
    hasFuturePlan: boolean | null;
    planDetails?: string;
}

export interface Agreement {
    agreedToAccuracy: boolean;
    agreedToCare: boolean;
    agreedToPrivacy: boolean;
}

export interface ApplicationPayload {
    announcementId: number;
    reason: string;
    housingInfo: HousingInfo;
    familyInfo: FamilyInfo;
    careInfo: CareInfo;
    financialInfo: FinancialInfo;
    petExperienceInfo: PetExperienceInfo;
    futurePlanInfo: FuturePlanInfo;
    agreement: Agreement;
}
