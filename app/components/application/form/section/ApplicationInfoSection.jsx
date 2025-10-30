import { formatPhoneNumber } from "@/app/lib/formatPhoneNumber";

export default function ApplicationInfoSection({
    name,
    phoneNumber,
    email,
    reason,
    isReadOnly = false,
    setReason,
    shelterInfo,
}) {
    return (
        <div className={`space-y-6 pb-6 ${isReadOnly ? 'border-b border-gray-300' : ''}`}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div>
                    <p className="text-base font-semibold text-amber-700 mb-1">신청자 이름</p>
                    <p className="text-sm text-gray-800">{name || "-"}</p>
                </div>
                <div>
                    <p className="text-base font-semibold text-amber-700 mb-1">신청자 연락처</p>
                    <p className="text-sm text-gray-800">{formatPhoneNumber(phoneNumber) || "-"}</p>
                </div>
                <div>
                    <p className="text-base font-semibold text-amber-700 mb-1">신청자 이메일</p>
                    <p className="text-sm text-gray-800">{email || "-"}</p>
                </div>
                <div>
                    <p className="text-base font-semibold text-amber-700 mb-1">보호소 이름</p>
                    <p className="text-sm text-gray-800">{shelterInfo ? `${shelterInfo.name}` : "-"}</p>
                </div>
            </div>

            <div className="space-y-1 mt-6">
                <p className="font-semibold text-base text-amber-700 mb-2">신청 희망 사유</p>
                {isReadOnly ? (
                    <div className="w-full min-h-[100px] rounded-md p-2 text-sm bg-[rgba(197,197,197,0.2)]">
                        {reason || "-"}
                    </div>
                ) : (
                    <textarea
                        value={reason}
                        onChange={(e) => setReason && setReason(e.target.value)}
                        placeholder="입양을 결심하신 이유와 계획, 기대를 자유롭게 적어주세요."
                        className="w-full min-h-[100px] rounded-md p-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-[rgba(197,197,197,0.2)]"
                    />
                )}
            </div>
        </div>
    );
}
