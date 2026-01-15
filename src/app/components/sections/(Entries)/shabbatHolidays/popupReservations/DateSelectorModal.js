'use client'
import { useState, useMemo, useCallback } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday
} from 'date-fns';

export const DateSelectorModal = ({
    isOpen,
    onClose,
    selectedDate,
    setSelectedDate,
    availableDates,
    setShowDateError
}) => {
    // Initialize current month based on first available date or selected date
    const initialMonth = useMemo(() => {
        if (selectedDate) return selectedDate;
        if (availableDates && availableDates.length > 0) return availableDates[0];
        return new Date();
    }, [selectedDate, availableDates]);

    const [currentMonth, setCurrentMonth] = useState(initialMonth);

    // Get all days to display in the calendar grid
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
        const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

        return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
    }, [currentMonth]);

    // Check if a date is available
    const isDateAvailable = useCallback((date) => {
        if (!availableDates) return false;
        return availableDates.some(availableDate => isSameDay(availableDate, date));
    }, [availableDates]);

    // Handle date selection
    const handleDateClick = useCallback((date) => {
        if (isDateAvailable(date)) {
            setSelectedDate(date);
            setShowDateError(false);
        }
    }, [isDateAvailable, setSelectedDate, setShowDateError]);

    // Navigation handlers
    const goToPreviousMonth = useCallback(() => {
        setCurrentMonth(prev => subMonths(prev, 1));
    }, []);

    const goToNextMonth = useCallback(() => {
        setCurrentMonth(prev => addMonths(prev, 1));
    }, []);

    // Day names - constant, no need for useMemo
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

    // Early return AFTER all hooks
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-2"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-[460px] min-h-[340px] max-h-[85vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header - Compact */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 sticky top-0 bg-white">
                    <h3 className="text-sm sm:text-base font-semibold text-darkBlue">Select Event Date</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>

                {/* Calendar - Compact */}
                <div className="px-3 py-2 sm:px-4 sm:py-3">
                    {/* Month Navigation - Inline with calendar */}
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={goToPreviousMonth}
                            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                        >
                            <FaChevronLeft className="text-gray-600 text-xs" />
                        </button>
                        <h4 className="text-sm font-semibold text-darkBlue">
                            {format(currentMonth, 'MMMM yyyy')}
                        </h4>
                        <button
                            onClick={goToNextMonth}
                            className="p-1 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
                        >
                            <FaChevronRight className="text-gray-600 text-xs" />
                        </button>
                    </div>

                    {/* Day Names Header - Compact */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {dayNames.map(day => (
                            <div
                                key={day}
                                className="h-6 flex items-center justify-center text-xs font-medium text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid - Fixed height for 6 rows to prevent jumping */}
                    <div className="grid grid-cols-7 gap-1 min-h-[188px] sm:min-h-[212px] content-start">
                        {calendarDays.map((day, index) => {
                            const isCurrentMonth = isSameMonth(day, currentMonth);
                            const isAvailable = isDateAvailable(day);
                            const isSelected = selectedDate && isSameDay(day, selectedDate);
                            const isTodayDate = isToday(day);

                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateClick(day)}
                                    disabled={!isAvailable || !isCurrentMonth}
                                    className="h-7 sm:h-8 flex items-center justify-center"
                                >
                                    <span
                                        className={`
                                            w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm transition-all
                                            ${!isCurrentMonth
                                                ? 'text-gray-300'
                                                : isSelected
                                                    ? 'bg-primary text-white font-semibold'
                                                    : isAvailable
                                                        ? 'text-gray-700 hover:bg-primary/20 cursor-pointer font-medium'
                                                        : 'text-gray-300 cursor-not-allowed'
                                            }
                                            ${isTodayDate && isCurrentMonth && !isSelected ? 'ring-1 ring-primary' : ''}
                                        `}
                                    >
                                        {format(day, 'd')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend - Inline, minimal */}
                    <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-gray-400">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-primary"></span> Available
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full ring-1 ring-primary"></span> Today
                        </span>
                    </div>
                </div>

                {/* Confirm Button - Compact */}
                <div className="px-4 py-2 border-t border-gray-200 sticky bottom-0 bg-white">
                    <button
                        onClick={onClose}
                        className="w-full py-2 bg-primary text-white font-medium rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer text-sm"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};
