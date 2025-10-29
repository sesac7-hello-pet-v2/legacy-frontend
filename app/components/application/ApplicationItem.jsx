const statusColor = {
    "신청서 제출": "bg-[rgb(255,245,196)]",
    "검토 중": "bg-[rgb(255,222,167)]",
    승인: "bg-[rgb(160,177,135)]",
    거절: "bg-[rgb(231,116,116)]",
};

export default function ApplicationItem({ application, onClick }) {
    return (
        <div className="cursor-pointer hover:bg-amber-50" onClick={onClick}>
            <div className="flex justify-between items-center p-5">
                <div className="flex-1">
                    <div className="flex space-x-5 mb-8">
                        <span className="bg-amber-100 text-amber-800 text-base px-3 py-1 rounded-xl">
                            입양
                        </span>
                        <span
                            className={`${
                                statusColor[application.applicationStatusLabel] || "bg-gray-400"
                            } ${
                                application.applicationStatusLabel === "승인" || application.applicationStatusLabel === "거절"
                                ? "text-white"
                                : "text-gray-800"
                            } text-base px-3 py-1 rounded-xl font-semibold`}
                        >
                            {application.applicationStatusLabel}
                        </span>
                    </div>
                    <div className="flex space-x-15">
                        <div className="flex flex-col space-y-2 text-base font-medium text-gray-600">
                            <div>신청 번호</div>
                            <div>공고 번호</div>
                            <div>신청일</div>
                        </div>

                        <div className="flex flex-col space-y-2 text-base text-gray-800">
                            <div>{application.applicationId}</div>
                            <div>{application.announcementId}</div>
                            <div>
                                {new Date(application.submittedAt).toISOString().slice(0, 10)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="ml-4">
                    <img
                        src={application.petImageUrl}
                        alt="동물 이미지"
                        className="w-35 h-35 rounded-2xl object-cover"
                    />
                </div>
            </div>
            <hr className="border-t border-gray-300" />
        </div>
    );
}
