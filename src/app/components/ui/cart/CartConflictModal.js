'use client'
import { FaTimes, FaShoppingCart, FaExclamationTriangle } from "react-icons/fa";

export const CartConflictModal = ({
    isOpen,
    onClose,
    onClearAndAdd,
    conflictInfo
}) => {
    if (!isOpen) return null;

    // Format the conflict message based on conflict type
    const getMessage = () => {
        if (!conflictInfo) return '';

        const { existingType, existingEvent, existingDate, newEvent, newDate } = conflictInfo;

        // Different product types
        if (conflictInfo.typeMismatch) {
            const typeLabels = {
                'mealReservation': 'Shabbat Meal',
                'shabbatBox': 'Shabbat Box',
                'customEvent': 'Event'
            };
            const existingLabel = typeLabels[existingType] || existingType;
            const newLabel = typeLabels[conflictInfo.newType] || conflictInfo.newType;
            return `You have ${existingLabel} items in your cart. To add ${newLabel} items, you'll need to clear your current cart.`;
        }

        // Same type, different event
        if (existingEvent && newEvent && existingEvent !== newEvent) {
            return `You have items from "${existingEvent}" in your cart. To add items from "${newEvent}", you'll need to clear your current cart.`;
        }

        // Same type, different date
        if (existingDate && newDate && existingDate !== newDate) {
            return `You have items for ${existingDate} in your cart. To add items for ${newDate}, you'll need to clear your current cart.`;
        }

        return 'You have items in your cart that conflict with your new selection. To proceed, you\'ll need to clear your current cart.';
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
            onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 bg-amber-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                            <FaShoppingCart className="text-amber-600 text-lg" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Items in Your Cart</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-5 py-6">
                    <div className="flex items-start gap-3 mb-4">
                        <FaExclamationTriangle className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {getMessage()}
                        </p>
                    </div>
                </div>

                {/* Footer with buttons */}
                <div className="px-5 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2 px-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClearAndAdd}
                        className="flex-1 py-2 px-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer whitespace-nowrap"
                    >
                        Clear & Add New
                    </button>
                </div>
            </div>
        </div>
    );
};
