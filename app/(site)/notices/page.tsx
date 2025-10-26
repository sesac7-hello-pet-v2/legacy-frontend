"use client";

import {useState} from "react";
import Link from "next/link";
import {notices, categories, getNoticesByCategory} from "@/app/lib/notices";

export default function NoticesPage() {
    const [selectedCategory, setSelectedCategory] = useState("전체");

    const filteredNotices = getNoticesByCategory(selectedCategory);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl mx-auto px-6">
                {/* 헤더 */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">공지사항</h1>
                    <p className="text-gray-600">Hello PET 서비스 이용 안내 및 공지사항입니다</p>
                </div>

                {/* 카테고리 필터 */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    selectedCategory === category
                                        ? "bg-amber-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 공지사항 목록 */}
                <div className="bg-white rounded-lg shadow-sm">
                    {filteredNotices.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            해당 카테고리의 공지사항이 없습니다.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {filteredNotices.map(notice => (
                                <Link
                                    key={notice.id}
                                    href={`/notices/${notice.id}`}
                                    className="block p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                                                    {notice.category}
                                                </span>
                                                <span className="text-gray-500 text-sm">
                                                    {notice.createdAt}
                                                </span>
                                            </div>
                                            <h2 className="text-lg font-semibold text-gray-900 mb-1 hover:text-amber-600 transition-colors">
                                                {notice.title}
                                            </h2>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {notice.content.substring(0, 100).replace(/<[^>]*>/g, '')}...
                                            </p>
                                        </div>
                                        <svg
                                            className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0"
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
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* 통계 */}
                <div className="mt-6 text-center text-gray-500 text-sm">
                    총 {filteredNotices.length}개의 공지사항
                </div>
            </div>
        </div>
    );
}
