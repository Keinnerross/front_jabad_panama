'use client'
import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';

export const TopBar = ({ platformSettings }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Extract topbar configuration from platformSettings.topbar
  const topbarConfig = platformSettings?.topbar;
  const text = topbarConfig?.text_topbar || "Welcome to Chabad Boquete - Your Jewish home in Panama";
  const showTopbar = topbarConfig?.show_topbar !== false;
  
  // If topbar is disabled in settings or user closed it, don't show
  if (!showTopbar || !isVisible) return null;

  return (
    <div className="w-full bg-primary relative">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-center relative">
          <div className="text-white text-sm sm:text-base text-center font-medium">
            <ReactMarkdown 
              components={{
                // Inline elements only for topbar
                p: ({children}) => <span>{children}</span>,
                strong: ({children}) => <strong className="font-bold">{children}</strong>,
                em: ({children}) => <em className="italic">{children}</em>,
                a: ({children, href}) => (
                  <a 
                    href={href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-gray-200 transition-colors"
                  >
                    {children}
                  </a>
                ),
                // Prevent block elements in topbar
                h1: ({children}) => <span className="font-bold">{children}</span>,
                h2: ({children}) => <span className="font-bold">{children}</span>,
                h3: ({children}) => <span className="font-bold">{children}</span>,
                ul: ({children}) => <span>{children}</span>,
                ol: ({children}) => <span>{children}</span>,
                li: ({children}) => <span>{children}</span>,
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
          {/* Close button - hidden for now but functionality preserved */}
          {false && (
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-gray-200 transition-colors"
              aria-label="Close announcement"
            >
              <IoClose size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};