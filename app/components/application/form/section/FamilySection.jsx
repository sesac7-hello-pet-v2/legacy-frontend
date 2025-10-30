export default function FamilySection({ familyInfo, setFamilyInfo, isReadOnly = false }) {
    const update = (key, value) => {
        if (setFamilyInfo) {
            setFamilyInfo({
                ...familyInfo,
                [key]: value,
            });
        }
    };

    const renderField = (title, value) => (
        <div>
            <p className="text-base font-semibold text-amber-700 mb-1">{title}</p>
            <p className="text-sm text-gray-800">{value !== null ? String(value) : "-"}</p>
        </div>
    );

    return (
        <div className="space-y-10 border-b border-gray-300 pb-6">
            <h2 className="text-lg font-semibold text-center mb-8">가족 구성</h2>

            {isReadOnly ? (
                <div className="space-y-6">
                    {renderField("가족 수", `${familyInfo.numberOfHousehold}명`)}
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
                </div>
            ) : (
                <>
                    {/* 가족 수 */}
                    <div className="space-y-3">
                        <p className="font-medium text-base">함께 거주하는 가족은 총 몇 명인가요?</p>
                        <input
                            type="number"
                            value={familyInfo.numberOfHousehold || ""}
                            onChange={(e) => update("numberOfHousehold", Number(e.target.value))}
                            min="1"
                            placeholder="예: 2"
                            className="w-full rounded-md p-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-[rgba(197,197,197,0.2)]"
                        />
                    </div>

                    {/* 13세 미만 아동 */}
                    <div className="space-y-3">
                        <p className="font-medium text-base">13세 미만 아동이 있나요?</p>
                        {[
                            { value: true, label: "있음" },
                            { value: false, label: "없음" },
                        ].map(({ value, label }) => (
                            <label key={String(value)} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="hasChildUnder13"
                                    checked={familyInfo.hasChildUnder13 === value}
                                    onChange={() => update("hasChildUnder13", value)}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* 가족 동의 */}
                    <div className="space-y-3">
                        <p className="font-medium text-base">
                            함께 거주하는 가족 모두 반려동물 입양을 동의했나요?
                        </p>
                        {[
                            { code: "ALL_AGREED", label: "모두 동의" },
                            { code: "MOST_AGREED", label: "대부분 동의" },
                            { code: "SOME_DISAGREED", label: "일부 반대" },
                            { code: "NOT_CONSULTED", label: "상의하지 않음" },
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

                    {/* 알레르기 */}
                    <div className="space-y-3">
                        <p className="font-medium text-base">가족 중 동물 알레르기가 있는 분이 있나요?</p>
                        {[
                            { value: true, label: "있음" },
                            { value: false, label: "없음" },
                        ].map(({ value, label }) => (
                            <label key={String(value)} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="hasPetAllergy"
                                    checked={familyInfo.hasPetAllergy === value}
                                    onChange={() => update("hasPetAllergy", value)}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
