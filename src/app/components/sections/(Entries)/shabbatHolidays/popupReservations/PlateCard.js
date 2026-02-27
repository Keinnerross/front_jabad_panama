'use client';

import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

/**
 * PlateCard - Compact display component for a configured plate
 * Single-line view with selections summary, price, and actions
 */
export const PlateCard = ({
    plate,
    index,
    guidedMenu,
    onEdit,
    onRemove,
    isEditing,
    isPWYWActive,
    isRushOrder = false
}) => {
    // Generate compact summary: "Option1 → Option2 → Option3"
    const getSelectionsSummary = () => {
        if (!guidedMenu?.steps) return '';

        return guidedMenu.steps.map(step => {
            const optionId = plate.selections[step.id];
            const option = step.options?.find(opt => opt.id === optionId);
            return option?.name || '—';
        }).join(' → ');
    };

    // Use per-plate rush price if applicable
    const priceOption = plate.priceOption;
    const price = (isRushOrder && priceOption?.active_rush && priceOption?.rush_price != null)
        ? parseFloat(priceOption.rush_price)
        : parseFloat(priceOption?.price || 0);

    return (
        <div
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isEditing
                    ? 'bg-primary/10 border border-primary'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
            }`}
        >
            {/* Plate Number Badge */}
            <span className="flex-shrink-0 text-[10px] font-bold text-white bg-primary px-1.5 py-0.5 rounded">
                {index + 1}
            </span>

            {/* Selections Summary - truncate if too long */}
            <span className="flex-1 text-xs text-gray-700 truncate" title={getSelectionsSummary()}>
                {getSelectionsSummary()}
            </span>

            {/* Price */}
            {!isPWYWActive && (
                <span className={`flex-shrink-0 text-sm font-semibold ${isRushOrder && priceOption?.active_rush && priceOption?.rush_price != null ? 'text-rush' : 'text-darkBlue'}`}>
                    {isRushOrder && priceOption?.active_rush && priceOption?.rush_price != null && (
                        <span className="line-through text-gray-400 text-xs mr-1">${parseFloat(priceOption.price).toFixed(2)}</span>
                    )}
                    ${price.toFixed(2)}
                </span>
            )}

            {/* Action Buttons */}
            <div className="flex-shrink-0 flex items-center gap-1">
                <button
                    onClick={onEdit}
                    disabled={isEditing}
                    className={`p-1.5 rounded transition-colors ${
                        isEditing
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-500 hover:text-primary hover:bg-primary/10 cursor-pointer'
                    }`}
                    title="Edit plate"
                >
                    <FaEdit size={14} />
                </button>
                <button
                    onClick={onRemove}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Remove plate"
                >
                    <FaTrash size={14} />
                </button>
            </div>
        </div>
    );
};
