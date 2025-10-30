export default function PetExperienceSection({
    petExperienceInfo,
    setPetExperienceInfo,
    isReadOnly = false,
}) {
    const update = (key, value) => {
        if (setPetExperienceInfo) {
            setPetExperienceInfo({
                ...petExperienceInfo,
                [key]: value,
            });
        }
    };

    return (
        <div className="space-y-10 border-b border-gray-300 pb-6">
            <h2 className="text-lg font-semibold text-center mb-8">반려동물 양육 경험</h2>

            {isReadOnly ? (
                <div className="space-y-6">
                    <div>
                        <p className="text-base font-semibold text-amber-700 mb-1">양육 경험</p>
                        <p className="text-sm text-gray-800">
                            {petExperienceInfo.hasPetExperience === true
                                ? "있음"
                                : petExperienceInfo.hasPetExperience === false
                                ? "없음"
                                : "-"}
                        </p>
                    </div>
                    {petExperienceInfo.hasPetExperience && (
                        <div>
                            <p className="text-base font-semibold text-amber-700 mb-1">경험 상세</p>
                            <textarea
                                value={petExperienceInfo.experienceDetails || "-"}
                                readOnly
                                className="w-full rounded-md p-2 text-sm bg-[rgba(197,197,197,0.2)]"
                                rows={2}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="font-medium text-base">
                        현재 또는 과거에 반려동물을 양육한 경험이 있나요?
                    </p>
                    {["있음", "없음"].map((label) => (
                        <label key={label} className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="hasPetExperience"
                                checked={petExperienceInfo.hasPetExperience === (label === "있음")}
                                onChange={() => update("hasPetExperience", label === "있음")}
                                className="accent-amber-400"
                            />
                            {label}
                        </label>
                    ))}

                    {/* 경험 상세 내용 */}
                    {petExperienceInfo.hasPetExperience && (
                        <textarea
                            value={petExperienceInfo.experienceDetails || ""}
                            onChange={(e) => update("experienceDetails", e.target.value)}
                            placeholder="예: 강아지(과거 5년 양육), 고양이(현재 2살)"
                            className="w-full rounded-md p-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-amber-400 bg-[rgba(197,197,197,0.2)]"
                            rows={2}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
