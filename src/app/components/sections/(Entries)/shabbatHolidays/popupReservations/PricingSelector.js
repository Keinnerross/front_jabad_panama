'use client'
import { FaHome, FaSuitcase } from "react-icons/fa";

export const PricingSelector = ({
    loadingCategory,
    onSelectLocal,
    onSelectTourist
}) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <h2 className="text-xl sm:text-2xl font-bold text-darkBlue mb-6">
                Are you a local or a tourist?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                {/* Local Card */}
                <button
                    onClick={onSelectLocal}
                    disabled={loadingCategory !== null}
                    className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                        loadingCategory === 'local'
                            ? 'border-primary bg-primary/5 scale-95'
                            : loadingCategory === 'tourist'
                            ? 'opacity-50 cursor-not-allowed border-gray-200'
                            : 'border-gray-200 hover:border-primary hover:shadow-lg cursor-pointer group'
                    }`}
                >
                    <div className="flex flex-col items-center">
                        {loadingCategory === 'local' ? (
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-3"></div>
                        ) : (
                            <FaHome className={`text-4xl text-primary ${loadingCategory === null ? 'group-hover:scale-110' : ''} transition-transform mb-3`} />
                        )}
                        <h3 className="text-lg font-semibold text-darkBlue">Local</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {loadingCategory === 'local' ? 'Loading...' : 'I live in Panama'}
                        </p>
                    </div>
                </button>

                {/* Tourist Card */}
                <button
                    onClick={onSelectTourist}
                    disabled={loadingCategory !== null}
                    className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                        loadingCategory === 'tourist'
                            ? 'border-primary bg-primary/5 scale-95'
                            : loadingCategory === 'local'
                            ? 'opacity-50 cursor-not-allowed border-gray-200'
                            : 'border-gray-200 hover:border-primary hover:shadow-lg cursor-pointer group'
                    }`}
                >
                    <div className="flex flex-col items-center">
                        {loadingCategory === 'tourist' ? (
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-3"></div>
                        ) : (
                            <FaSuitcase className={`text-4xl text-primary ${loadingCategory === null ? 'group-hover:scale-110' : ''} transition-transform mb-3`} />
                        )}
                        <h3 className="text-lg font-semibold text-darkBlue">Tourist</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {loadingCategory === 'tourist' ? 'Loading...' : "I'm visiting Panama"}
                        </p>
                    </div>
                </button>
            </div>
        </div>
    );
};
