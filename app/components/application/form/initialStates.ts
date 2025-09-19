import {
    HousingInfo,
    FamilyInfo,
    CareInfo,
    FinancialInfo,
    PetExperienceInfo,
    FuturePlanInfo,
    Agreement,
} from "@/app/types/application";

export const initialHousingInfo: HousingInfo = {
    housingType: "",
    housingTypeLabel: "",
    residenceType: "",
    residenceTypeLabel: "",
    petAllowed: null,
    petLivingPlace: "",
    petLivingPlaceLabel: "",
    houseSizeRange: "",
    houseSizeRangeLabel: "",
};

export const initialFamilyInfo: FamilyInfo = {
    numberOfHousehold: 0,
    hasChildUnder13: null,
    familyAgreement: "",
    familyAgreementLabel: "",
    hasPetAllergy: null,
};

export const initialCareInfo: CareInfo = {
    absenceTime: "",
    absenceTimeLabel: "",
    careTime: "",
    careTimeLabel: "",
};

export const initialFinancialInfo: FinancialInfo = {
    monthlyBudget: "",
    monthlyBudgetLabel: "",
    hasEmergencyFund: null,
};

export const initialPetExperienceInfo: PetExperienceInfo = {
    hasPetExperience: null,
    experienceDetails: "",
};

export const initialFuturePlanInfo: FuturePlanInfo = {
    hasFuturePlan: null,
    planDetails: "",
};

export const initialAgreement: Agreement = {
    agreedToAccuracy: false,
    agreedToCare: false,
    agreedToPrivacy: false,
};
