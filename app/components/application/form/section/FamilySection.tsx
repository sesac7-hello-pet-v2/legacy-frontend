import { FamilyInfo } from "@/app/types/application";

interface Props {
    familyInfo: FamilyInfo;
    setFamilyInfo?: (info: FamilyInfo) => void; // 작성 모드일 때만 필요
    isReadOnly?: boolean;
}

export default function FamilySection({ familyInfo, setFamilyInfo, isReadOnly = false }: Props) {
    const update = (key: keyof FamilyInfo, value: any) => {
        if (setFamilyInfo) {
            setFamilyInfo({
                ...familyInfo,
                [key]: value,
            });
        }
    };

    const renderField = (title: string, value: string | number | boolean | null) => (
        <div className="flex gap-2">
            <span className="font-medium text-sm">{title}:</span>
            <span className="text-sm text-gray-800">{value !== null ? String(value) : "-"}</span>
        </div>
    );

    return (
        <div className="space-y-10">
            <h2 className="text-lg font-semibold text-center mb-8">가족 구성</h2>

            {isReadOnly ? (
                <>
                    {renderField("가족 수", familyInfo.numberOfHousehold)}
                    {renderField(
                        "13세 미만 아동 여부",
                        familyInfo.hasChildUnder13 === true
                            ? "있음"
                            : familyInfo.hasChildUnder13 === false
                            ? "없음"
                            : "-"
                    )}
                    {renderField("입양 동의 여부", familyInfo.familyAgreementLabel || "-")}
                    {renderField(
                        "알레르기 여부",
                        familyInfo.hasPetAllergy === true
                            ? "있음"
                            : familyInfo.hasPetAllergy === false
                            ? "없음"
                            : "-"
                    )}
                </>
            ) : (
                <>
                    {/* 가족 수 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            현재 함께 거주하는 가족은 본인을 포함하여 몇 명인가요?
                        </p>
                        <input
                            type="number"
                            min={0}
                            value={familyInfo.numberOfHousehold}
                            onChange={(e) => update("numberOfHousehold", Number(e.target.value))}
                            placeholder="예: 1"
                            className="w-20 rounded-md p-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-amber-400 bg-[rgba(197,197,197,0.2)]"
                        />{" "}
                        명
                    </div>

                    {/* 13세 미만 아동 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            현재 함께 거주하는 가족 중 13세 미만 아동이 있나요?
                        </p>
                        {["있음", "없음"].map((label) => (
                            <label key={label} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="hasChildUnder13"
                                    checked={familyInfo.hasChildUnder13 === (label === "있음")}
                                    onChange={() => update("hasChildUnder13", label === "있음")}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* 입양 동의 여부 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">가족 모두 반려동물 입양에 동의하나요?</p>
                        {[
                            { code: "ALL_AGREE", label: "모두 동의" },
                            { code: "SOME_DISAGREE", label: "일부 반대" },
                        ].map(({ code, label }) => (
                            <label key={code} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="familyAgreement"
                                    value={code}
                                    checked={familyInfo.familyAgreement === code}
                                    onChange={() => update("familyAgreement", code)}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* 알레르기 여부 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            가족 중 반려동물 관련 알레르기가 있는 사람이 있나요?
                        </p>
                        {["있음", "없음"].map((label) => (
                            <label key={label} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="hasPetAllergy"
                                    checked={familyInfo.hasPetAllergy === (label === "있음")}
                                    onChange={() => update("hasPetAllergy", label === "있음")}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </>
            )}

            <hr className="border-gray-300 mt-4" />
        </div>
    );
}
