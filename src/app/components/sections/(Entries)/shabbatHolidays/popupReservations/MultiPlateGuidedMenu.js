'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { PlateCard } from './PlateCard';
import { PlateConfigModal } from './PlateConfigModal';

/**
 * MultiPlateGuidedMenu - Compact list view with modal for configuration
 * Shows configured plates as compact cards, opens modal to add/edit
 */
export const MultiPlateGuidedMenu = ({
    guidedMenu,
    configuredPlates,
    setConfiguredPlates,
    isPWYWActive,
    showError,
    setShowError,
    rushOrderPrice = null
}) => {
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null); // null = new plate, number = editing

    // Form state (used in modal)
    const [currentSelections, setCurrentSelections] = useState({});
    const [currentPriceOption, setCurrentPriceOption] = useState(null);
    const [formError, setFormError] = useState(false);

    // Initialize price option when guidedMenu loads
    useEffect(() => {
        if (guidedMenu?.plates_prices?.length > 0 && !currentPriceOption) {
            setCurrentPriceOption(guidedMenu.plates_prices[0]);
        }
    }, [guidedMenu?.plates_prices, currentPriceOption]);

    // Generate unique ID for plates
    const generatePlateId = () => {
        return `plate-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    // Validate that all steps have selections
    const validateSelections = () => {
        if (!guidedMenu?.steps) return true;

        const allStepsSelected = guidedMenu.steps.every(
            step => currentSelections[step.id] !== undefined
        );

        if (!allStepsSelected) {
            setFormError(true);
            return false;
        }

        setFormError(false);
        return true;
    };

    // Reset form to initial state
    const resetForm = () => {
        setCurrentSelections({});
        setCurrentPriceOption(guidedMenu?.plates_prices?.[0] || null);
        setEditingIndex(null);
        setFormError(false);
    };

    // Open modal to add new plate
    const openAddModal = () => {
        resetForm();
        setShowModal(true);
    };

    // Open modal to edit existing plate
    const openEditModal = (index) => {
        const plate = configuredPlates[index];
        setCurrentSelections({ ...plate.selections });
        setCurrentPriceOption(plate.priceOption);
        setEditingIndex(index);
        setFormError(false);
        setShowModal(true);
    };

    // Handle save from modal (add or edit)
    const handleSave = () => {
        if (!validateSelections()) return;

        if (editingIndex !== null) {
            // Update existing plate
            const updatedPlate = {
                ...configuredPlates[editingIndex],
                selections: { ...currentSelections },
                priceOption: currentPriceOption
            };
            setConfiguredPlates(prev =>
                prev.map((plate, idx) => idx === editingIndex ? updatedPlate : plate)
            );
        } else {
            // Add new plate
            const newPlate = {
                id: generatePlateId(),
                selections: { ...currentSelections },
                priceOption: currentPriceOption
            };
            setConfiguredPlates(prev => [...prev, newPlate]);
        }

        setShowError(false);
        setShowModal(false);
        resetForm();
    };

    // Handle cancel from modal
    const handleCancel = () => {
        setShowModal(false);
        resetForm();
    };

    // Remove plate from list
    const removePlate = (index) => {
        setConfiguredPlates(prev => prev.filter((_, idx) => idx !== index));
    };

    // Calculate total price of all plates
    const totalPrice = configuredPlates.reduce((sum, plate) => {
        const platePrice = rushOrderPrice !== null
            ? rushOrderPrice
            : parseFloat(plate.priceOption?.price || 0);
        return sum + platePrice;
    }, 0);

    return (
        <div className="space-y-3">
            {/* Header with count and total */}
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-darkBlue">
                    Your Plates {configuredPlates.length > 0 && `(${configuredPlates.length})`}
                </h4>
                {!isPWYWActive && configuredPlates.length > 0 && (
                    <span className="text-sm font-bold text-primary">
                        Subtotal: ${totalPrice.toFixed(2)}
                    </span>
                )}
            </div>

            {/* Guided Menu Description */}
            {guidedMenu?.description && (
                <p className="text-xs text-gray-500">
                    {guidedMenu.description}
                </p>
            )}

            {/* Configured Plates List */}
            {configuredPlates.length > 0 ? (
                <div className="space-y-2">
                    {configuredPlates.map((plate, index) => (
                        <PlateCard
                            key={plate.id}
                            plate={plate}
                            index={index}
                            guidedMenu={guidedMenu}
                            onEdit={() => openEditModal(index)}
                            onRemove={() => removePlate(index)}
                            isEditing={false}
                            isPWYWActive={isPWYWActive}
                            rushOrderPrice={rushOrderPrice}
                        />
                    ))}
                </div>
            ) : (
                /* Empty state */
                <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-sm text-gray-500 mb-1">Start building your meal</p>
                    <p className="text-xs text-gray-400">Click the button below to add your first plate</p>
                </div>
            )}

            {/* Add Plate Button */}
            <button
                onClick={openAddModal}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-medium py-3 px-4 rounded-lg hover:bg-opacity-90 transition-colors cursor-pointer"
            >
                <FaPlus size={12} />
                <span>{configuredPlates.length > 0 ? 'Add Another Plate' : 'Add Your First Plate'}</span>
            </button>

            {/* Error message when no plates configured */}
            {showError && configuredPlates.length === 0 && (
                <p className="text-red-500 text-sm text-center">
                    Please add at least one plate to continue
                </p>
            )}

            {/* Configuration Modal */}
            <PlateConfigModal
                isOpen={showModal}
                onClose={handleCancel}
                guidedMenu={guidedMenu}
                selections={currentSelections}
                setSelections={setCurrentSelections}
                priceOption={currentPriceOption}
                setPriceOption={setCurrentPriceOption}
                isPWYWActive={isPWYWActive}
                isEditing={editingIndex !== null}
                editingIndex={editingIndex}
                showError={formError}
                onSave={handleSave}
                onCancel={handleCancel}
                rushOrderPrice={rushOrderPrice}
            />
        </div>
    );
};
