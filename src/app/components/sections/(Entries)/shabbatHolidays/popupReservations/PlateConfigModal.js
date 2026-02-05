'use client';

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { PlateConfigForm } from './PlateConfigForm';

/**
 * PlateConfigModal - Full-screen modal for configuring a plate
 * Opens when user clicks "Add Plate" or "Edit" on an existing plate
 * Uses React Portal to render on top of everything
 */
export const PlateConfigModal = ({
    isOpen,
    onClose,
    guidedMenu,
    selections,
    setSelections,
    priceOption,
    setPriceOption,
    isPWYWActive,
    isEditing,
    editingIndex,
    showError,
    onSave,
    onCancel,
    rushOrderPrice = null
}) => {
    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onCancel]);

    // Note: Don't manipulate body overflow here - parent modal handles it

    // SSR safety check - don't render portal on server
    if (typeof document === 'undefined') return null;
    if (!isOpen) return null;

    // Use createPortal to render modal in document.body (outside parent modal)
    return createPortal(
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-darkBlue">
                        {isEditing ? `Edit Plate ${editingIndex + 1}` : 'Configure Your Plate'}
                    </h3>
                    <button
                        onClick={onCancel}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    <PlateConfigForm
                        guidedMenu={guidedMenu}
                        selections={selections}
                        setSelections={setSelections}
                        priceOption={priceOption}
                        setPriceOption={setPriceOption}
                        isPWYWActive={isPWYWActive}
                        isEditing={isEditing}
                        editingIndex={editingIndex}
                        showError={showError}
                        hideHeader={true}
                        rushOrderPrice={rushOrderPrice}
                    />
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 px-4 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="flex-1 py-2.5 px-4 text-white font-medium bg-primary rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
                    >
                        {isEditing ? 'Save Changes' : 'Add Plate'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};
