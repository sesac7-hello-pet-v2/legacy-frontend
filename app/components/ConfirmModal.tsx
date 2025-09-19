interface Props {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ message, onConfirm, onCancel }: Props) {
    return (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
            <div className="bg-white rounded-xl p-8 space-y-4 shadow-lg">
                <p className="text-center text-lg mb-8">{message}</p>
                <div className="flex justify-center space-x-8">
                    <button
                        onClick={onConfirm}
                        className="bg-amber-400 text-white px-4 py-1 rounded-xl hover:bg-amber-500"
                    >
                        예
                    </button>
                    <button
                        onClick={onCancel}
                        className="bg-[#FFF1AE] text-gray-800 px-4 py-1 rounded-xl hover:bg-yellow-200"
                    >
                        아니오
                    </button>
                </div>
            </div>
        </div>
    );
}
