import { Agreement } from "@/app/types/application";

interface Props {
    agreement: Agreement;
    setAgreement?: (val: Agreement) => void; // readOnly 모드면 필요 없음
    isReadOnly?: boolean;
}

const CHECKBOXES: { key: keyof Agreement; label: string }[] = [
    { key: "agreedToAccuracy", label: "위 항목은 사실에 근거하여 작성하였습니다." },
    { key: "agreedToCare", label: "입양 후 반려동물을 책임감 있게 돌볼 것을 약속합니다." },
    { key: "agreedToPrivacy", label: "개인정보 수집 및 활용에 동의합니다." },
];

export default function AgreementSection({ agreement, setAgreement, isReadOnly = false }: Props) {
    const update = (key: keyof Agreement, value: boolean) => {
        if (setAgreement) {
            setAgreement({
                ...agreement,
                [key]: value,
            });
        }
    };

    const renderItem = (key: keyof Agreement, label: string) => {
        if (isReadOnly) {
            return (
                <div className="flex items-center gap-2 text-sm" key={key}>
                    <span className="inline-block w-4">{agreement[key] ? "✅" : "❌"}</span>
                    {label}
                </div>
            );
        } else {
            return (
                <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                        type="checkbox"
                        checked={agreement[key]}
                        onChange={(e) => update(key, e.target.checked)}
                        className="accent-amber-400"
                    />
                    {label}
                </label>
            );
        }
    };

    return (
        <div>
            <h2 className="text-lg font-semibold text-center mb-8">최종 확인 및 동의</h2>
            <p className="text-sm text-gray-700 font-semibold mb-5">
                제출 전 아래 내용을 확인하고 동의해주세요.
            </p>
            <div className="space-y-3">
                {CHECKBOXES.map(({ key, label }) => renderItem(key, label))}
            </div>
        </div>
    );
}
