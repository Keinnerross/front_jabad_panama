'use client'
import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to error reporting service
    if (process.env.NODE_ENV === 'development') {
      console.error('Application error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-10 h-10 text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Oops! Something went wrong
        </h1>
        
        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Our team has been notified and is working to fix this issue.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition font-medium text-lg"
          >
            Try Again
          </button>
          
          <a
            href="/"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition font-medium text-lg"
          >
            Return Home
          </a>
          
          <a
            href="/contact"
            className="block text-primary hover:text-primary/80 transition text-sm"
          >
            Contact Support
          </a>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
              Error Details (Development Only)
            </summary>
            <div className="p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-800 whitespace-pre-wrap border">
              {error?.message || 'Unknown error'}
              {error?.stack && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  {error.stack}
                </div>
              )}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}