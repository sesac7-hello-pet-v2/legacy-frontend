import {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {getNoticeById, notices} from "@/app/lib/notices";

interface Props {
    params: {
        id: string;
    };
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const notice = getNoticeById(parseInt(params.id));

    if (!notice) {
        return {
            title: "공지사항을 찾을 수 없습니다 | Hello PET",
        };
    }

    return {
        title: `${notice.title} | Hello PET`,
        description: notice.content.substring(0, 100).replace(/<[^>]*>/g, ''),
    };
}

export async function generateStaticParams() {
    return notices.map((notice) => ({
        id: notice.id.toString(),
    }));
}

export default function NoticeDetailPage({params}: Props) {
    const notice = getNoticeById(parseInt(params.id));

    if (!notice) {
        notFound();
    }

    // HTML을 렌더링하기 위한 함수
    const createMarkup = (html: string) => {
        return {__html: html};
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto px-6">
                {/* 뒤로 가기 버튼 */}
                <Link
                    href="/notices"
                    className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6 font-medium"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    목록으로
                </Link>

                {/* 공지사항 상세 */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* 헤더 */}
                    <div className="border-b border-gray-200 p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                                {notice.category}
                            </span>
                            <span className="text-gray-500 text-sm">
                                {notice.createdAt}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {notice.title}
                        </h1>
                    </div>

                    {/* 내용 */}
                    <div className="p-8">
                        <div
                            className="prose prose-lg max-w-none
                                prose-headings:text-gray-900
                                prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                                prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
                                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
                                prose-li:text-gray-700 prose-li:mb-2
                                prose-strong:text-gray-900 prose-strong:font-semibold
                            "
                            dangerouslySetInnerHTML={createMarkup(notice.content.replace(/\n/g, '<br>'))}
                        />
                    </div>
                </div>

                {/* 네비게이션 */}
                <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                    <div className="space-y-3">
                        {/* 이전 글 */}
                        {notice.id < notices.length && (
                            <Link
                                href={`/notices/${notice.id + 1}`}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 19l-7-7 7-7"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-500">이전 글</span>
                                </div>
                                <span className="text-gray-700 hover:text-amber-600 transition-colors">
                                    {getNoticeById(notice.id + 1)?.title}
                                </span>
                            </Link>
                        )}

                        {/* 다음 글 */}
                        {notice.id > 1 && (
                            <Link
                                href={`/notices/${notice.id - 1}`}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-4 h-4 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-500">다음 글</span>
                                </div>
                                <span className="text-gray-700 hover:text-amber-600 transition-colors">
                                    {getNoticeById(notice.id - 1)?.title}
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
