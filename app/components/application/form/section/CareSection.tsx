import { CareInfo } from "@/app/types/application";

interface Props {
    careInfo: CareInfo;
    setCareInfo?: (info: CareInfo) => void; // 작성 모드에서만 필요
    isReadOnly?: boolean;
}

export default function CareSection({ careInfo, setCareInfo, isReadOnly = false }: Props) {
    const update = (key: keyof CareInfo, value: string) => {
        if (setCareInfo) {
            setCareInfo({
                ...careInfo,
                [key]: value,
            });
        }
    };

    const renderField = (title: string, value: string) => (
        <div className="flex gap-2">
            <span className="font-medium text-sm">{title}:</span>
            <span className="text-sm text-gray-800">{value || "-"}</span>
        </div>
    );

    return (
        <div className="space-y-10">
            <h2 className="text-lg font-semibold text-center mb-8">돌봄 가능 시간</h2>

            {isReadOnly ? (
                <>
                    {renderField("하루 평균 집 비우는 시간", careInfo.absenceTimeLabel || "-")}
                    {renderField("하루 평균 돌봄 시간", careInfo.careTimeLabel || "-")}
                </>
            ) : (
                <>
                    {/* 집을 비우는 시간 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            평일 기준 하루 평균 집을 비우는 시간은 얼마나 되나요?
                        </p>
                        {[
                            { code: "ONE_TO_THREE", label: "1~3시간" },
                            { code: "FOUR_TO_SIX", label: "4~6시간" },
                            { code: "SEVEN_TO_NINE", label: "7~9시간" },
                            { code: "TEN_OR_MORE", label: "10시간 이상" },
                        ].map(({ code, label }) => (
                            <label key={code} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="absenceTime"
                                    value={code}
                                    checked={careInfo.absenceTime === code}
                                    onChange={() => update("absenceTime", code)}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>
                        ))}
                    </div>

                    {/* 반려동물과 함께하는 시간 */}
                    <div className="space-y-3">
                        <p className="font-medium text-sm">
                            평일 기준 하루 평균 반려동물과 함께할 수 있는 시간은 얼마나 되나요?
                        </p>
                        {[
                            { code: "ONE_OR_LESS", label: "1시간 이하" },
                            { code: "TWO_TO_THREE", label: "2~3시간" },
                            { code: "FOUR_OR_MORE", label: "4시간 이상" },
                        ].map(({ code, label }) => (
                            <label key={code} className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="careTime"
                                    value={code}
                                    checked={careInfo.careTime === code}
                                    onChange={() => update("careTime", code)}
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
