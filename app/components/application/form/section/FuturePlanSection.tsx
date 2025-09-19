import { FuturePlanInfo } from "@/app/types/application";

interface Props {
    futurePlanInfo: FuturePlanInfo;
    setFuturePlanInfo?: (info: FuturePlanInfo) => void; // readOnly 모드에서는 필요 없음
    isReadOnly?: boolean;
}

export default function FuturePlanSection({
    futurePlanInfo,
    setFuturePlanInfo,
    isReadOnly = false,
}: Props) {
    const update = (key: keyof FuturePlanInfo, value: any) => {
        if (setFuturePlanInfo) {
            setFuturePlanInfo({
                ...futurePlanInfo,
                [key]: value,
            });
        }
    };

    return (
        <div className="space-y-10">
            <h2 className="text-lg font-semibold text-center mb-8">향후 계획</h2>

            <div className="space-y-3">
                <p className="font-medium text-sm">
                    향후 1년 이내 이사, 출산, 유학, 군입대 등의 계획이 있나요?
                </p>

                {isReadOnly ? (
                    <>
                        <p className="text-sm text-gray-800">
                            {futurePlanInfo.hasFuturePlan === true
                                ? "있음"
                                : futurePlanInfo.hasFuturePlan === false
                                ? "없음"
                                : "-"}
                        </p>
                        {futurePlanInfo.hasFuturePlan && (
                            <textarea
                                value={futurePlanInfo.planDetails || "-"}
                                readOnly
                                className="w-full rounded-md p-2 text-sm bg-[rgba(197,197,197,0.2)]"
                                rows={2}
                            />
                        )}
                    </>
                ) : (
                    ["있음", "없음"].map((label) => (
                        <div key={label} className="space-y-3">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="radio"
                                    name="hasFuturePlan"
                                    checked={futurePlanInfo.hasFuturePlan === (label === "있음")}
                                    onChange={() => update("hasFuturePlan", label === "있음")}
                                    className="accent-amber-400"
                                />
                                {label}
                            </label>

                            {label === "있음" && futurePlanInfo.hasFuturePlan && (
                                <textarea
                                    value={futurePlanInfo.planDetails || ""}
                                    onChange={(e) => update("planDetails", e.target.value)}
                                    placeholder="예: 3개월 뒤 이사 예정"
                                    className="w-full rounded-md p-2 text-sm placeholder-gray-400 focus:ring-2 focus:ring-amber-400 bg-[rgba(197,197,197,0.2)]"
                                    rows={2}
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            <hr className="border-gray-300 mt-4" />
        </div>
    );
}
