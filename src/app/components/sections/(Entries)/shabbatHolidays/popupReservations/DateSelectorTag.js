'use client'
import { FaChevronDown, FaCalendarAlt } from "react-icons/fa";
import { format } from 'date-fns';

export const DateSelectorTag = ({
    selectedDate,
    showDateError,
    onClick,
    disabled = false
}) => {
    const getDisplayText = () => {
        if (selectedDate) {
            return format(selectedDate, 'EEE, MMM d, yyyy');
        }
        return "Select a date";
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
                        : showDateError
                            ? 'border-red-500 bg-red-50 cursor-pointer hover:border-primary'
                            : 'border-gray-300 bg-white hover:bg-gray-50 cursor-pointer hover:border-primary'
                }`}
            >
                <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-primary text-sm" />
                    <span className="text-sm text-gray-700 truncate max-w-[180px] sm:max-w-[220px]">
                        {getDisplayText()}
                    </span>
                </div>
                {!disabled && (
                    <FaChevronDown className="text-gray-400 text-xs flex-shrink-0" />
                )}
            </button>
            {showDateError && !selectedDate && (
                <p className="text-red-500 text-xs mt-1">Please select a date</p>
            )}
        </div>
    );
};
