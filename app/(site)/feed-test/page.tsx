"use client";

import React, {useState} from 'react';
import EmptyFeedState from './components/EmptyFeedState';
import FeedSkeleton from './components/FeedSkeleton';
import RecommendedSection from './components/RecommendedSection';
import TrendingSection from './components/TrendingSection';
import StoriesSection from './components/StoriesSection';

export default function FeedTestPage() {
    const [activeTab, setActiveTab] = useState('empty');

    const tabs = [
        {id: 'empty', label: '빈 상태'},
        {id: 'skeleton', label: '스켈레톤 로더'},
        {id: 'recommended', label: '추천 사용자'},
        {id: 'trending', label: '인기 게시글'},
        {id: 'stories', label: '스토리'},
        {id: 'all', label: '모든 요소'}
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'empty':
                return <EmptyFeedState/>;
            case 'skeleton':
                return <FeedSkeleton/>;
            case 'recommended':
                return <RecommendedSection/>;
            case 'trending':
                return <TrendingSection/>;
            case 'stories':
                return <StoriesSection/>;
            case 'all':
                return (
                    <div className="space-y-6">
                        <StoriesSection/>
                        <RecommendedSection/>
                        <TrendingSection/>
                        <EmptyFeedState/>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-md mx-auto bg-white min-h-screen">
                {/* 헤더 */}
                <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
                    <div className="px-4 py-4">
                        <h1 className="text-xl font-bold text-center">피드 UI 테스트</h1>
                    </div>

                    {/* 탭 네비게이션 */}
                    <div className="px-4 pb-4">
                        <div className="flex gap-2 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                        activeTab === tab.id
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 컨텐츠 */}
                <div className="px-4 py-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
