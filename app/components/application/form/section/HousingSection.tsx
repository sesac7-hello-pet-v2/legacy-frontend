import { HousingInfo } from "@/app/types/application";

interface Props {
    housingInfo: HousingInfo;
    setHousingInfo?: (info: HousingInfo) => void; // 작성 모드에서만 필요
    isReadOnly?: boolean;
}

export default function HousingSection({ housingInfo, setHousingInfo, isReadOnly = false }: Props) {
    const update = (key: keyof HousingInfo, value: any) => {
        if (setHousingInfo) {
            setHousingInfo({
                ...housingInfo,
                [key]: value,
            });
        }
    };

    // 공통 렌더 함수
    const renderField = (title: string, value: string | boolean | null) => (
        <div className="flex gap-2">
            <span className="font-medium text-sm">{title}:</span>
            <span className="text-sm text-gray-800">{value !== null ? String(value) : "-"}</span>
        </div>
    );

    return (
        <div className="space-y-10">
            <h2 className="text-lg font-semibold text-center mb-8">주거 환경</h2>

            {isReadOnly ? (
                <>
                    {renderField("현재 주택 형태", housingInfo.housingTypeLabel)}
                    {renderField("주택 거주 형태", housingInfo.residenceTypeLabel)}
                    {renderField("반려동물 허용 여부", housingInfo.petAllowed ? "허용" : "불허")}
                    {renderField("반려동물 생활 장소", housingInfo.petLivingPlaceLabel)}
                    {renderField("주택 면적", housingInfo.houseSizeRangeLabel)}
                </>
            ) : (
                <>
                    {/* 주택 형태 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            현재 거주 중인 주택 형태는 무엇인가요?
                        </p>
                        {[
                            { code: "APARTMENT", label: "아파트" },
                            { code: "VILLA", label: "빌라/연립" },
                            { code: "OFFICETEL", label: "오피스텔" },
                            { code: "DETACHED_HOUSE", label: "단독주택" },
                            { code: "DORMITORY", label: "기숙사/쉐어하우스" },
                            { code: "MOBILE_HOME", label: "이동식 주택 (컨테이너, 캠핑카 등)" },
                        ].map(({ code, label }) => (
                            <label key={code} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="housingType"
                                    value={code}
                                    checked={housingInfo.housingType === code}
                                    onChange={() => update("housingType", code)}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* 거주 형태 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">현재 주택의 거주 형태는 무엇인가요?</p>
                        {[
                            { code: "OWNED", label: "자가" },
                            { code: "JEONSE", label: "전세" },
                            { code: "MONTHLY_RENT", label: "월세" },
                            { code: "TEMPORARY", label: "임시 거주" },
                        ].map(({ code, label }) => (
                            <label key={code} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="residenceType"
                                    value={code}
                                    checked={housingInfo.residenceType === code}
                                    onChange={() => update("residenceType", code)}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* 반려동물 허용 여부 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            현재 거주 중인 주택에서 반려동물 양육이 허용되나요?
                        </p>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="petAllowed"
                                checked={housingInfo.petAllowed === true}
                                onChange={() => update("petAllowed", true)}
                                className="accent-amber-400"
                            />
                            허용
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="radio"
                                name="petAllowed"
                                checked={housingInfo.petAllowed === false}
                                onChange={() => update("petAllowed", false)}
                                className="accent-amber-400"
                            />
                            불허
                        </label>
                    </div>

                    {/* 반려동물 생활 장소 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            입양 후 반려동물은 어디에서 생활하나요?
                        </p>
                        {[
                            { code: "INDOOR", label: "실내" },
                            { code: "OUTDOOR", label: "실외" },
                            { code: "BOTH", label: "실내 + 실외" },
                        ].map(({ code, label }) => (
                            <label key={code} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="petLivingPlace"
                                    value={code}
                                    checked={housingInfo.petLivingPlace === code}
                                    onChange={() => update("petLivingPlace", code)}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* 주택 면적 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            현재 거주 중인 주택의 면적은 얼마인가요?
                        </p>
                        {[
                            { code: "LESS_THAN_33", label: "33㎡ 미만 (10평 미만)" },
                            {
                                code: "FROM_33_TO_66",
                                label: "33㎡ 이상 ~ 66㎡ 미만 (10평 이상 ~ 20평 미만)",
                            },
                            {
                                code: "FROM_66_TO_99",
                                label: "66㎡ 이상 ~ 99㎡ 미만 (20평 이상 ~ 30평 미만)",
                            },
                            { code: "OVER_99", label: "99㎡ 이상 (30평 이상)" },
                        ].map(({ code, label }) => (
                            <label key={code} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="houseSizeRange"
                                    value={code}
                                    checked={housingInfo.houseSizeRange === code}
                                    onChange={() => update("houseSizeRange", code)}
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
