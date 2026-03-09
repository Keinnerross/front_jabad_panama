'use client';

import { useState } from 'react';
import { MarkdownContent } from '@/app/components/ui/common/markdownContent';

const TabledContent = ({ tabs = [] }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || null);

    // Si no hay tabs, no renderizar nada
    if (!tabs || tabs.length === 0) {
        return null;
    }

    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="border-b border-gray-200">
                <div className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 px-1 border-b-2 whitespace-nowrap text-sm md:text-base transition-colors cursor-pointer font-semibold ${
                                activeTab === tab.id
                                    ? 'border-primary text-primary '
                                    : 'border-transparent text-gray-700 hover:text-darkBlue'
                            }`}
                        >
                            {tab.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="mt-6">
                {tabs.map((tab) => (
                    <div
                        key={tab.id}
                        className={activeTab === tab.id ? 'block' : 'hidden'}
                    >
                        <MarkdownContent>{tab.content || ''}</MarkdownContent>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabledContent;