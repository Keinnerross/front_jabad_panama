'use client'
import { DateSelectorTag } from './DateSelectorTag';

export const DateSelector = ({
    shabbatData,
    selectedDate,
    setSelectedDate,
    showDateError,
    setShowDateError,
    getAvailableDates,
    onOpenModal
}) => {
    const availableDates = getAvailableDates();

    // Case 1: No dates available - show error message
    if (availableDates.length === 0) {
        return (
            <div className="flex-1">
                <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                    <p className="text-red-600 text-sm">No dates available for this event</p>
                </div>
            </div>
        );
    }

    // Case 2: Single date - show tag as non-clickable with the date
    if (availableDates.length === 1) {
        return (
            <DateSelectorTag
                selectedDate={selectedDate}
                showDateError={false}
                onClick={() => {}}
                disabled={true}
            />
        );
    }

    // Case 3: Multiple dates - show clickable tag that opens modal (modal rendered externally)
    return (
        <DateSelectorTag
            selectedDate={selectedDate}
            showDateError={showDateError}
            onClick={onOpenModal}
            disabled={false}
        />
    );
};
