import { FinancialInfo } from "@/app/types/application";

interface Props {
    financialInfo: FinancialInfo;
    setFinancialInfo?: (info: FinancialInfo) => void; // 작성 모드에서만 필요
    isReadOnly?: boolean;
}

export default function FinancialSection({
    financialInfo,
    setFinancialInfo,
    isReadOnly = false,
}: Props) {
    const update = (key: keyof FinancialInfo, value: any) => {
        if (setFinancialInfo) {
            setFinancialInfo({
                ...financialInfo,
                [key]: value,
            });
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-lg font-semibold text-center mb-8">경제적 여건</h2>

            {/* 월 양육비 */}
            <div className="space-y-3">
                <p className="font-medium text-sm">
                    매월 반려동물 양육을 위해 지출 가능한 예상 금액은 얼마인가요?
                </p>
                {isReadOnly ? (
                    <p className="text-sm text-gray-800">
                        {financialInfo.monthlyBudgetLabel || "-"}
                    </p>
                ) : (
                    [
                        { code: "UNDER_50K", label: "5만 원 이하" },
                        { code: "FROM_50K_TO_100K", label: "5만 원 이상 ~ 10만 원 이하" },
                        { code: "FROM_100K_TO_200K", label: "10만 원 이상 ~ 20만 원 이하" },
                        { code: "OVER_200K", label: "20만 원 이상" },
                    ].map(({ code, label }) => (
                        <label key={code} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="monthlyBudget"
                                value={code}
                                checked={financialInfo.monthlyBudget === code}
                                onChange={() => update("monthlyBudget", code)}
                                className="accent-amber-400"
                            />
                            {label}
                        </label>
                    ))
                )}
            </div>

            {/* 긴급 자금 */}
            <div className="space-y-3">
                <p className="font-medium text-sm">
                    반려동물의 긴급 의료비를 대비한 여유 자금이 준비되어 있나요?
                </p>
                {isReadOnly ? (
                    <p className="text-sm text-gray-800">
                        {financialInfo.hasEmergencyFund === true
                            ? "있음"
                            : financialInfo.hasEmergencyFund === false
                            ? "없음"
                            : "-"}
                    </p>
                ) : (
                    ["있음", "없음"].map((label) => (
                        <label key={label} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="hasEmergencyFund"
                                checked={financialInfo.hasEmergencyFund === (label === "있음")}
                                onChange={() => update("hasEmergencyFund", label === "있음")}
                                className="accent-amber-400"
                            />
                            {label}
                        </label>
                    ))
                )}
            </div>

            <hr className="border-gray-300 mt-4" />
        </div>
    );
}
