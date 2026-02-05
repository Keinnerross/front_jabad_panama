'use client';

import React from 'react';

/**
 * PlateConfigForm - Form component for configuring a single plate
 * Displays price options and step selections with radio buttons
 */
export const PlateConfigForm = ({
    guidedMenu,
    selections,
    setSelections,
    priceOption,
    setPriceOption,
    isPWYWActive,
    isEditing,
    editingIndex,
    showError,
    hideHeader = false,
    rushOrderPrice = null
}) => {
    // Handle radio selection for a step
    const handleSelection = (stepId, optionId) => {
        setSelections(prev => ({
            ...prev,
            [stepId]: optionId
        }));
    };

    // Auto-select first price option if none selected
    React.useEffect(() => {
        if (!priceOption && guidedMenu?.plates_prices?.length > 0) {
            setPriceOption(guidedMenu.plates_prices[0]);
        }
    }, [guidedMenu?.plates_prices, priceOption, setPriceOption]);

    return (
        <div className="space-y-3 md:space-y-2 lg:space-y-3">
            {/* Form Header - hidden when used in modal */}
            {!hideHeader && (
                <div className="border-b border-gray-200 pb-2 mb-2">
                    <h4 className="text-sm font-semibold text-darkBlue">
                        {isEditing ? `Editing Plate ${editingIndex + 1}` : 'Configure New Plate'}
                    </h4>
                </div>
            )}

            {/* Price Options - Rush Order or Regular */}
            {!isPWYWActive && (
                rushOrderPrice !== null ? (
                    // Rush Order Pricing - Fixed price, no options
                    <div className="border border-amber-300 bg-amber-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-darkBlue">
                                Price
                            </h3>
                            <span className="text-sm font-bold text-amber-700">
                                ${rushOrderPrice.toFixed(2)} per plate
                            </span>
                        </div>
                        <p className="text-xs text-amber-600">
                            Rush order pricing applies for orders placed within 24 hours of the event.
                        </p>
                    </div>
                ) : guidedMenu?.plates_prices?.length > 0 ? (
                    // Regular Price Options
                    <div className="border border-gray-200 rounded-lg p-2 md:p-2 lg:p-3">
                        <h3 className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue mb-2">
                            Plate Type
                        </h3>
                        <div className="space-y-2">
                            {guidedMenu.plates_prices.map((option) => (
                                <label
                                    key={option.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                                        priceOption?.id === option.id
                                            ? 'bg-primary/10 border border-primary'
                                            : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="plate-price-form"
                                        checked={priceOption?.id === option.id}
                                        onChange={() => setPriceOption(option)}
                                        className="w-3.5 h-3.5 text-primary cursor-pointer"
                                    />
                                    <span className="text-xs font-medium text-darkBlue">
                                        {option.Text}
                                    </span>
                                    <span className="text-xs text-gray-500 ml-auto">
                                        ${option.price} per plate
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Fallback: No prices = Free
                    <div className="border border-gray-200 rounded-lg p-2 md:p-2 lg:p-3">
                        <p className="text-sm text-gray-500">Free</p>
                    </div>
                )
            )}

            {/* Steps with Radio Options */}
            {guidedMenu?.steps?.map((step) => (
                <div
                    key={step.id}
                    className={`border rounded-lg p-2 md:p-2 lg:p-3 ${
                        showError && !selections[step.id]
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                    }`}
                >
                    <h3 className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue mb-2 md:mb-2 lg:mb-2">
                        {step.title} <span className="text-red-500">*</span>
                    </h3>
                    <div className="space-y-1.5 md:space-y-1 lg:space-y-3">
                        {step.options?.map((option) => (
                            <label
                                key={option.id}
                                className={`flex items-start gap-2 p-2 md:p-1.5 lg:p-3 rounded-lg cursor-pointer transition-colors ${
                                    selections[step.id] === option.id
                                        ? 'bg-primary/10 border border-primary'
                                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name={`step-${step.id}-form`}
                                    checked={selections[step.id] === option.id}
                                    onChange={() => handleSelection(step.id, option.id)}
                                    className="mt-0.5 w-3.5 h-3.5 md:w-3 md:h-3 lg:w-3.5 lg:h-3.5 text-primary cursor-pointer"
                                />
                                <div className="flex-1">
                                    <span className="text-xs md:text-xs lg:text-xs font-medium text-darkBlue">
                                        {option.name}
                                    </span>
                                    {option.description && (
                                        <p className="text-[10px] md:text-[10px] lg:text-xs text-gray-500 mt-0.5">
                                            {option.description}
                                        </p>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>
                    {showError && !selections[step.id] && (
                        <p className="text-red-500 text-sm mt-2">
                            Please select an option
                        </p>
                    )}
                </div>
            ))}

            {/* Guided Menu Description */}
            {guidedMenu?.description && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                        {guidedMenu.description}
                    </p>
                </div>
            )}
        </div>
    );
};
