import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
          <svg 
            className="w-12 h-12 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0 0A7.953 7.953 0 014 9c0-4.418 3.582-8 8-8s8 3.582 8 8a7.953 7.953 0 01-2.343 5.657m0 0A7.962 7.962 0 0112 21a7.962 7.962 0 01-5.657-2.343m11.314 0C16.843 18.343 14.731 19 12.5 19c-2.231 0-4.343-.657-5.657-1.657m11.314-11.314C16.843 5.657 14.731 5 12.5 5c-2.231 0-4.343.657-5.657 1.657" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          404 - Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition font-medium text-lg"
          >
            Return Home
          </Link>
          
          <Link
            href="/visitor-information"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Visitor Information
          </Link>
          
          <Link
            href="/shabbat-holidays"
            className="block w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Shabbat & Holidays
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">
            Need help finding something?
          </p>
          <Link
            href="/contact"
            className="text-primary hover:text-primary/80 transition text-sm font-medium"
          >
            Contact Us →
          </Link>
        </div>
      </div>
    </div>
  );
}