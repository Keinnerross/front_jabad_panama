"use client"
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

const blockComponents = {
    h1: ({ children }) => <h1 className="text-2xl font-bold text-darkBlue mb-4">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-bold text-darkBlue mb-3">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-bold text-darkBlue mb-2">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base font-bold text-darkBlue mb-2">{children}</h4>,
    p: ({ children }) => <p className="mb-3 text-gray-600">{children}</p>,
    strong: ({ children }) => <strong className="font-semibold text-myBlack">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => <ul className="list-disc ml-4 mb-3 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal ml-4 mb-3 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-gray-600">{children}</li>,
    a: ({ href, children }) => <a href={href} className="text-primary underline hover:text-primary/80 transition-colors" target="_blank" rel="noopener noreferrer">{children}</a>,
    br: () => <br />,
    hr: () => <hr className="my-4 border-0 h-px bg-gray-300" />,
    blockquote: ({ children }) => <blockquote className="border-l-4 border-primary/30 pl-4 italic text-gray-500 my-3">{children}</blockquote>,
    code: ({ children }) => <code className="bg-gray-100 rounded px-1 text-sm font-mono">{children}</code>,
    pre: ({ children }) => <pre className="bg-gray-100 rounded p-3 overflow-x-auto my-3 text-sm font-mono">{children}</pre>,
    table: ({ children }) => <div className="overflow-x-auto mb-4 border border-gray-300 rounded-lg"><table className="min-w-full border-separate border-spacing-0 bg-white rounded-lg shadow-sm overflow-hidden">{children}</table></div>,
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => <tbody className="bg-white">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => <th className="px-4 py-3 text-left text-sm font-semibold text-darkBlue border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-300 last:border-r-0 [tr:not(:last-child)_&]:border-b">{children}</td>,
};

const inlineComponents = {
    p: ({ children }) => <span className="inline">{children}</span>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    ul: ({ children }) => <ul className="list-disc ml-4 mt-1 space-y-0.5">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal ml-4 mt-1 space-y-0.5">{children}</ol>,
    li: ({ children }) => <li className="text-gray-600">{children}</li>,
    br: () => <br />,
};

export function MarkdownContent({ children, inline = false, className }) {
    if (!children) return null;
    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={inline ? inlineComponents : blockComponents}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
}
