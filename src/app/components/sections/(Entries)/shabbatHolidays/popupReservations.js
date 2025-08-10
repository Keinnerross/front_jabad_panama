'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { formatShabbatDate } from "@/app/utils/formatShabbatDate";
import { getAssetPath } from "@/app/utils/assetPath";

export const PopupReservations = ({ isOpen = false, handleModal, selectedMeal, shabbatData, allMeals = [], isCustomEvent = false }) => {
    const router = useRouter();
    const [quantities, setQuantities] = useState({});
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDateError, setShowDateError] = useState(false);
    const { addToCart: addToCartContext } = useCart();

    // Bloquear scroll del body cuando el popup está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        // Cleanup al desmontar
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    useEffect(() => {
        if (allMeals.length > 0) {
            const initialQuantities = {};
            allMeals.forEach((meal, mealIndex) => {
                if (isCustomEvent) {
                    // Custom events - check if option has variants
                    if (meal.variants && meal.variants.length > 0) {
                        // Initialize quantities for each variant
                        meal.variants.forEach((variant, variantIndex) => {
                            initialQuantities[`${mealIndex}-variant-${variantIndex}`] = 0;
                        });
                    } else {
                        // Single option without variants
                        initialQuantities[`${mealIndex}-0`] = 0;
                    }
                } else {
                    // Regular events have multiple prices per meal
                    meal.prices.forEach((price, priceIndex) => {
                        initialQuantities[`${mealIndex}-${priceIndex}`] = 0;
                    });
                }
            });
            setQuantities(initialQuantities);
        }
    }, [allMeals, isCustomEvent]);

    // Set first tab as active when data loads for custom events
    useEffect(() => {
        if (isCustomEvent && shabbatData?.category_menu?.length > 0 && !activeTab) {
            setActiveTab(shabbatData.category_menu[0].category_name || 'Category 1');
        }
    }, [shabbatData, activeTab, isCustomEvent]);

    // Auto-select date when there's only one available (for 'once' repeat mode)
    useEffect(() => {
        if (isCustomEvent && isOpen) {
            const availableDates = getAvailableDates();
            // If there's only one date available and no date is selected yet, auto-select it
            if (availableDates.length === 1 && !selectedDate) {
                setSelectedDate(availableDates[0]);
            }
        }
    }, [isCustomEvent, isOpen, shabbatData]);

    // Generate available dates based on repeat_control
    const getAvailableDates = () => {
        if (!isCustomEvent || !shabbatData?.repeat_control) return [];
        
        const { repeat_mode, date, start_date, end_date, weekly_repeat } = shabbatData.repeat_control;
        const dates = [];
        const today = new Date();
        
        switch (repeat_mode) {
            case 'once':
                if (date) {
                    const eventDate = new Date(date + 'T00:00:00');
                    // Para eventos 'once', siempre incluir la fecha aunque sea pasada
                    dates.push(eventDate);
                }
                break;
                
            case 'range':
                if (start_date && end_date) {
                    const start = new Date(start_date + 'T00:00:00');
                    const end = new Date(end_date + 'T00:00:00');
                    
                    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                        if (d >= today) {
                            dates.push(new Date(d));
                        }
                    }
                }
                break;
                
            case 'weekly':
                if (weekly_repeat) {
                    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    const enabledDays = [];
                    
                    dayNames.forEach((day, index) => {
                        if (weekly_repeat[day]) {
                            enabledDays.push(index);
                        }
                    });
                    
                    // Generate next 21 days of enabled weekdays (3 weeks)
                    for (let i = 0; i < 21; i++) {
                        const checkDate = new Date(today);
                        checkDate.setDate(today.getDate() + i);
                        
                        if (enabledDays.includes(checkDate.getDay())) {
                            dates.push(new Date(checkDate));
                        }
                    }
                }
                break;
        }
        
        return dates;
    };

    useEffect(() => {
        if (allMeals.length > 0) {
            const newTotal = Object.keys(quantities).reduce((sum, key) => {
                const quantity = quantities[key];
                if (quantity <= 0) return sum;
                
                if (isCustomEvent) {
                    if (key.includes('-variant-')) {
                        // Handle variants
                        const [mealIndex, , variantIndex] = key.split('-').map(Number);
                        const meal = allMeals[mealIndex];
                        const variant = meal?.variants?.[variantIndex];
                        const price = parseFloat(variant?.price || 0);
                        return sum + (quantity * price);
                    } else {
                        // Handle regular custom event option
                        const [mealIndex] = key.split('-').map(Number);
                        const meal = allMeals[mealIndex];
                        const price = parseFloat(meal?.basePrice || 0);
                        return sum + (quantity * price);
                    }
                } else {
                    // Regular events
                    const [mealIndex, priceIndex] = key.split('-').map(Number);
                    const meal = allMeals[mealIndex];
                    const price = parseFloat(meal?.prices[priceIndex]?.price || 0);
                    return sum + (quantity * price);
                }
            }, 0);
            setTotal(newTotal);
        }
    }, [quantities, allMeals, isCustomEvent]);

    const updateQuantity = (key, change) => {
        setQuantities(prev => ({
            ...prev,
            [key]: Math.max(0, (prev[key] || 0) + change)
        }));
    };

    const addToCart = async () => {
        // Validar fecha para eventos custom
        if (isCustomEvent && !selectedDate) {
            setShowDateError(true);
            return;
        }
        
        setShowDateError(false);
        setIsLoading(true);
        
        const cartItems = [];
        Object.keys(quantities).forEach(key => {
            if (quantities[key] > 0) {
                if (isCustomEvent) {
                    if (key.includes('-variant-')) {
                        // Handle variants
                        const [mealIndex, , variantIndex] = key.split('-').map(Number);
                        const meal = allMeals[mealIndex];
                        const variant = meal?.variants?.[variantIndex];
                        
                        if (variant) {
                            cartItems.push({
                                meal: `${meal.name} - ${variant.title}`,
                                priceType: variant.title,
                                quantity: quantities[key],
                                unitPrice: parseFloat(variant.price),
                                totalPrice: quantities[key] * parseFloat(variant.price),
                                shabbatName: shabbatData?.name,
                                shabbatDate: selectedDate ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}` : shabbatData?.name,
                                productType: 'mealReservation'
                            });
                        }
                    } else {
                        // Handle regular custom event option
                        const [mealIndex] = key.split('-').map(Number);
                        const meal = allMeals[mealIndex];
                        
                        cartItems.push({
                            meal: meal.name,
                            priceType: meal.name,
                            quantity: quantities[key],
                            unitPrice: parseFloat(meal.basePrice),
                            totalPrice: quantities[key] * parseFloat(meal.basePrice),
                            shabbatName: shabbatData?.name,
                            shabbatDate: selectedDate ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}` : shabbatData?.name,
                            productType: 'mealReservation'
                        });
                    }
                } else {
                    // Regular events
                    const [mealIndex, priceIndex] = key.split('-').map(Number);
                    const meal = allMeals[mealIndex];
                    const priceOption = meal.prices[priceIndex];
                    
                    cartItems.push({
                        meal: meal.product,
                        priceType: priceOption.name,
                        quantity: quantities[key],
                        unitPrice: parseFloat(priceOption.price),
                        totalPrice: quantities[key] * parseFloat(priceOption.price),
                        shabbatName: shabbatData?.name,
                        shabbatDate: formatShabbatDate(shabbatData),
                        productType: 'mealReservation'
                    });
                }
            }
        });

        if (cartItems.length > 0) {
            // Agregar al carrito
            addToCartContext(cartItems);
            
            // Esperar 2 segundos antes de redirigir
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Redirigir al checkout
            setIsLoading(false);
            handleModal(false);
            router.push('/checkout');
        } else {
            setIsLoading(false);
        }
    };

    if (!allMeals || allMeals.length === 0) return null;
    return (

        <div
            className={`w-full h-full flex justify-center items-center p-2 sm:p-4 md:p-6 lg:p-8 fixed top-0 overflow-y-auto z-50 transition-all duration-300 ${
                isOpen 
                    ? 'bg-black/50 backdrop-blur-sm opacity-100' 
                    : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
            }`}
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation(e)}
                className={`w-full max-w-5xl h-[90vh] md:h-[85vh] flex flex-col lg:flex-row rounded-xl overflow-hidden my-auto shadow-2xl transition-all duration-300 transform ${
                    isOpen 
                        ? 'scale-100 opacity-100 translate-y-0' 
                        : 'scale-95 opacity-0 translate-y-4'
                }`}>
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-40 sm:h-48 md:h-56 lg:h-full relative flex-shrink-0 hidden md:block">
                    <Image src={getAssetPath("/assets/pictures/shabbat-meals/shabbatbox-single.png")} alt="reservation for shabbat" fill className="w-full h-full object-cover" />
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 bg-white flex flex-col h-full">
                    {/* Fixed Header */}
                    <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100 flex-shrink-0">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 pr-2">
                                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-darkBlue mb-2">
                                    {isCustomEvent ? shabbatData?.name || "Custom Event" : "Shabbat Meals"}
                                </h2>
                                <p className="text-gray-text text-sm sm:text-base md:text-lg">
                                    {isCustomEvent ? (
                                        selectedDate ? `Selected Date: ${selectedDate.toLocaleDateString()}` : "Please select a date"
                                    ) : (
                                        <>
                                            Date: {formatShabbatDate(shabbatData)}<br />
                                            Shabbat: {shabbatData?.name}
                                        </>
                                    )}
                                </p>
                            </div>
                            <button
                                onClick={() => handleModal(false)}
                                className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 flex-shrink-0"
                            >
                                <FaTimes size={16} className="sm:w-5 sm:h-5" />
                            </button>
                        </div>
                        
                        {/* Date Selector for Custom Events */}
                        {isCustomEvent && (() => {
                            const availableDates = getAvailableDates();
                            
                            if (availableDates.length === 0) {
                                // No dates available
                                return (
                                    <div className="mb-4">
                                        <div className="p-3 border border-red-300 rounded-lg bg-red-50">
                                            <p className="text-red-600 text-sm">No dates available for this event</p>
                                        </div>
                                    </div>
                                );
                            } else if (availableDates.length === 1) {
                                // Single date - show as fixed text
                                const eventDate = new Date(availableDates[0]);
                                const today = new Date();
                                
                                // Determine if the event is in the past
                                let isPastDate = false;
                                let statusText = '';
                                
                                if (shabbatData?.repeat_control) {
                                    const { repeat_mode, all_day, hour_start, hour_end } = shabbatData.repeat_control;
                                    
                                    // Compare dates without time
                                    const eventDateOnly = new Date(eventDate);
                                    eventDateOnly.setHours(0, 0, 0, 0);
                                    const todayDateOnly = new Date(today);
                                    todayDateOnly.setHours(0, 0, 0, 0);
                                    
                                    if (eventDateOnly < todayDateOnly) {
                                        // Date has passed
                                        isPastDate = true;
                                        statusText = '(Past date)';
                                    } else if (eventDateOnly.getTime() === todayDateOnly.getTime()) {
                                        // It's today - check time if not all day
                                        if (!all_day && hour_end) {
                                            const [hours, minutes] = hour_end.split(':').map(n => parseInt(n));
                                            const endTime = new Date(today);
                                            endTime.setHours(hours, minutes, 0, 0);
                                            
                                            if (today > endTime) {
                                                isPastDate = true;
                                                statusText = '(Event ended)';
                                            }
                                        }
                                    }
                                }
                                
                                return (
                                    <div className="mb-4">
                                        <div className={`p-3 border rounded-lg ${
                                            isPastDate ? 'border-amber-300 bg-amber-50' : 'border-gray-300 bg-gray-50'
                                        }`}>
                                            <div>
                                                <p className={`text-sm font-medium ${
                                                    isPastDate ? 'text-amber-700' : 'text-gray-700'
                                                }`}>
                                                    Event Date: {selectedDate?.toLocaleDateString('en-US', { 
                                                        weekday: 'long', 
                                                        month: 'long', 
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                    {isPastDate && <span className="ml-2 text-xs">{statusText}</span>}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                // Multiple dates - show selector
                                return (
                                    <div className="mb-4">
                                        <select
                                            className={`w-full p-3 border rounded-lg text-gray-700 cursor-pointer text-sm ${
                                                showDateError && !selectedDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                            value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                setSelectedDate(e.target.value ? new Date(e.target.value + 'T00:00:00') : null);
                                                setShowDateError(false);
                                            }}
                                            required
                                        >
                                            <option value="">Choose a date *</option>
                                            {availableDates.map((date, index) => (
                                                <option key={index} value={date.toISOString().split('T')[0]}>
                                                    {date.toLocaleDateString('en-US', { 
                                                        weekday: 'short', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </option>
                                            ))}
                                        </select>
                                        {showDateError && !selectedDate && (
                                            <p className="text-red-500 text-sm mt-1">Please select a date to continue</p>
                                        )}
                                    </div>
                                );
                            }
                        })()}
                        
                        {/* Tabs for Custom Events */}
                        {isCustomEvent && shabbatData?.category_menu?.length > 0 && (
                            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide pb-2">
                                {shabbatData.category_menu.map((category, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTab(category.category_name || `Category ${index + 1}`)}
                                        className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer flex-shrink-0 ${
                                            activeTab === (category.category_name || `Category ${index + 1}`)
                                                ? 'text-primary border-b-2 border-primary'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {category.category_name || `Category ${index + 1}`}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                        <div className="space-y-6">
                        {isCustomEvent ? (
                            // Custom events - show only active tab items
                            shabbatData?.category_menu
                                ?.find(cat => (cat.category_name || `Category ${shabbatData.category_menu.indexOf(cat) + 1}`) === activeTab)
                                ?.option?.map((meal, mealIndex) => (
                                    <div key={mealIndex} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                                        <h3 className="text-base sm:text-lg font-semibold text-darkBlue mb-3 sm:mb-4">{meal.name}</h3>
                                        
                                        {meal.description && (
                                            <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                                        )}
                                        
                                        {meal.includes && (
                                            <div className="text-xs text-gray-600 mb-3">Includes: {meal.includes}</div>
                                        )}
                                        
                                        {meal.variants && meal.variants.length > 0 ? (
                                            // Render variants (like Pescados)
                                            <div className="space-y-3">
                                                {meal.variants.map((variant, variantIndex) => {
                                                    const variantKey = `${mealIndex}-variant-${variantIndex}`;
                                                    return (
                                                        <div key={variantIndex} className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2 bg-gray-50 p-3 rounded">
                                                            <div className="flex-grow">
                                                                <span className="text-gray-text text-xs sm:text-sm">{variant.title}</span>
                                                                {variant.description && (
                                                                    <div className="text-xs text-gray-500 mt-1">{variant.description}</div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-8 sm:gap-12 flex-shrink-0">
                                                                <span className="text-base sm:text-lg font-semibold text-myBlack">
                                                                    ${variant.price}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() => updateQuantity(variantKey, -1)}
                                                                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                                    >
                                                                        <FaMinus size={10} className="sm:w-3 sm:h-3" />
                                                                    </button>
                                                                    <span className="text-sm sm:text-base font-semibold text-darkBlue min-w-6 sm:min-w-8 text-center">
                                                                        {quantities[variantKey] || 0}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateQuantity(variantKey, 1)}
                                                                        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                                    >
                                                                        <FaPlus size={10} className="sm:w-3 sm:h-3" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // Render regular option without variants
                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
                                                    <div className="flex-grow">
                                                        <span className="text-gray-text text-xs sm:text-sm flex-shrink-0">{meal.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-8 sm:gap-12 flex-shrink-0">
                                                        <span className="text-base sm:text-lg font-semibold text-myBlack">
                                                            ${meal.basePrice}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(`${mealIndex}-0`, -1)}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                            >
                                                                <FaMinus size={10} className="sm:w-3 sm:h-3" />
                                                            </button>
                                                            <span className="text-sm sm:text-base font-semibold text-darkBlue min-w-6 sm:min-w-8 text-center">
                                                                {quantities[`${mealIndex}-0`] || 0}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(`${mealIndex}-0`, 1)}
                                                                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                            >
                                                                <FaPlus size={10} className="sm:w-3 sm:h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )) || []
                        ) : (
                            // Regular events - show all meals
                            allMeals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                                <h3 className="text-base sm:text-lg font-semibold text-darkBlue mb-3 sm:mb-4">{meal.product}</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {meal.prices.map((priceOption, priceIndex) => {
                                        const key = `${mealIndex}-${priceIndex}`;
                                        return (
                                            <div key={priceIndex} className="flex items-center justify-between flex-wrap sm:flex-nowrap gap-2">
                                                <span className="text-gray-text text-sm sm:text-base md:text-lg flex-shrink-0">{priceOption.name}</span>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => updateQuantity(key, -1)}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                    >
                                                        <FaMinus className="text-gray-text text-xs sm:text-sm"  />
                                                    </button>
                                                    <span className="w-8 sm:w-10 text-center text-gray-text text-sm sm:text-base md:text-lg">
                                                        {quantities[key] || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(key, 1)}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                    >
                                                        <FaPlus className="text-gray-text text-xs sm:text-sm"  />
                                                    </button>
                                                    <span className="w-16 sm:w-20 text-right text-gray-text text-sm sm:text-base md:text-lg">
                                                        {parseFloat(priceOption.price).toFixed(2)} $
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )))}
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="border-t border-gray-200 p-4 sm:p-6 md:p-8 flex-shrink-0">
                        {/* Total */}
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-darkBlue font-bold text-base sm:text-lg">Total:</span>
                            <span className="text-darkBlue font-bold text-lg sm:text-xl">{total.toFixed(2)} $</span>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={addToCart}
                            disabled={total === 0 || isLoading}
                            className={`w-full font-bold py-4 rounded-lg transition flex justify-between px-6 items-center cursor-pointer touch-manipulation ${total > 0 && !isLoading
                                ? 'bg-primary text-white hover:bg-opacity-90'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center w-full">
                                    <div className="animate-spin rounded-full h-6 w-6 border-4 border-gray-300 border-t-current mr-3"></div>
                                    <span>Adding to cart...</span>
                                </div>
                            ) : (
                                <>
                                    <span>Add to cart and continue</span>
                                    <span>{total.toFixed(2)} $</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};