'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const TabledContent = ({ tabs = [] }) => {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || null);

    // Si no hay tabs, no renderizar nada
    if (!tabs || tabs.length === 0) {
        return null;
    }

    // Componentes personalizados para markdown
    const markdownComponents = {
        h1: ({ children }) => <h1 className="text-2xl font-bold text-darkBlue mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold text-darkBlue mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold text-darkBlue mb-3">{children}</h3>,
        h4: ({ children }) => <h4 className="text-base font-bold text-darkBlue mb-2">{children}</h4>,
        p: ({ children }) => <p className="mb-4 text-gray-text text-sm leading-relaxed">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold text-darkBlue">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
        ul: ({ children }) => <ul className="list-disc ml-6 space-y-2 mb-4">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal ml-6 space-y-2 mb-4">{children}</ol>,
        li: ({ children }) => <li className="text-gray-text text-sm ">{children}</li>,
        a: ({ href, children }) => (
            <a
                href={href}
                className="text-primary underline hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        ),
        br: () => <br />,
        hr: () => <hr className="my-6 border-0 h-px bg-gray-200" />,
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-gray-600">
                {children}
            </blockquote>
        ),
        code: ({ children }) => (
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-darkBlue">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                {children}
            </pre>
        ),
    };

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
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={markdownComponents}
                        >
                            {tab.content || ''}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TabledContent;