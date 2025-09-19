interface Props {
    application: {
        applicationId: number;
        announcementId: number;
        applicationStatusLabel: string; // 이제는 이미 한글 상태로 전달됨
        submittedAt: string;
        petImageUrl: string;
    };
    onClick: () => void;
}

export default function ApplicationItem({ application, onClick }: Props) {
    return (
        <div className="cursor-pointer hover:bg-amber-50" onClick={onClick}>
            <div className="flex justify-between items-center p-5">
                <div className="flex-1">
                    <div className="flex space-x-5 mb-8">
                        <span className="bg-amber-100 text-amber-800 text-base px-3 py-1 rounded-xl">
                            입양
                        </span>
                        <span className="bg-amber-400 text-white text-base px-3 py-1 rounded-xl">
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
