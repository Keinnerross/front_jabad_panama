'use client'
import { FaChevronDown, FaClock } from "react-icons/fa";

export const TimeSelectorTag = ({
    selectedTime,
    showTimeError,
    onClick,
    disabled = false
}) => {
    const getDisplayText = () => {
        if (selectedTime) {
            return selectedTime;
        }
        return "Select a time";
    };

    return (
        <div className="flex-1">
            <button
                onClick={(e) => {
                    if (disabled) return;
                    e.stopPropagation();
                    onClick();
                }}
                disabled={disabled}
                className={`w-full p-3 border rounded-lg text-left flex justify-between items-center transition-colors ${
                    disabled
                        ? 'border-gray-300 bg-gray-50 cursor-default'
                        : showTimeError
                            ? 'border-red-500 bg-red-50 cursor-pointer hover:border-primary'
                            : 'border-gray-300 bg-white hover:bg-gray-50 cursor-pointer hover:border-primary'
                }`}
            >
                <div className="flex items-center gap-2">
                    <FaClock className="text-primary text-sm" />
                    <span className="text-sm text-gray-700 truncate max-w-[180px] sm:max-w-[220px]">
                        {getDisplayText()}
                    </span>
                </div>
                {!disabled && (
                    <FaChevronDown className="text-gray-400 text-xs flex-shrink-0" />
                )}
            </button>
            {showTimeError && !selectedTime && (
                <p className="text-red-500 text-xs mt-1">Please select a time</p>
            )}
        </div>
    );
};
