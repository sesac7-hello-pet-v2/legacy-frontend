export default function FuturePlanSection({
    futurePlanInfo,
    setFuturePlanInfo,
    isReadOnly = false,
}) {
    const update = (key, value) => {
        if (setFuturePlanInfo) {
            setFuturePlanInfo({
                ...futurePlanInfo,
                [key]: value,
            });
        }
    };

    return (
        <div className="space-y-10 border-b border-gray-300 pb-6">
            <h2 className="text-lg font-semibold text-center mb-8">향후 계획</h2>

            {isReadOnly ? (
                <div className="space-y-6">
                    <div>
                        <p className="text-base font-semibold text-amber-700 mb-1">향후 계획</p>
                        <p className="text-sm text-gray-800">
                            {futurePlanInfo.hasFuturePlan === true
                                ? "있음"
                                : futurePlanInfo.hasFuturePlan === false
                                ? "없음"
                                : "-"}
                        </p>
                    </div>
                    {futurePlanInfo.hasFuturePlan && (
                        <div>
                            <p className="text-base font-semibold text-amber-700 mb-1">계획 상세</p>
                            <textarea
                                value={futurePlanInfo.planDetails || "-"}
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
                        향후 1년 이내 이사, 출산, 유학, 군입대 등의 계획이 있나요?
                    </p>
                    {["있음", "없음"].map((label) => (
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
                    ))}
                </div>
            )}
        </div>
    );
}
