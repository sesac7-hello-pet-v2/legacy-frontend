export default function AlertModal({ isOpen, onClose, title, message, type = "success" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
                <h3 className="text-lg font-semibold mb-3">
                    {title}
                </h3>
                <p className="text-gray-700 mb-6">
                    {message}
                </p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 rounded-full font-semibold ${
                            type === "error"
                                ? "bg-red-500 hover:bg-red-600 text-white"
                                : "bg-amber-400 hover:bg-amber-500 text-white"
                        }`}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
