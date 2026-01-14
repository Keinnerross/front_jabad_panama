'use client'
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes, FaHome, FaSuitcase } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import ReactMarkdown from 'react-markdown';
import { formatShabbatDate } from "@/app/utils/formatShabbatDate";
import { getAssetPath } from "@/app/utils/assetPath";

export const PopupReservations = ({ isOpen = false, handleModal, selectedMeal, shabbatData, allMeals = [], isCustomEvent = false, eventType = null, enableLocalPricing = false, pwywSiteConfigData = false }) => {
    const router = useRouter();
    const [quantities, setQuantities] = useState({});
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("");
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDateError, setShowDateError] = useState(false);
    const [deliveryType, setDeliveryType] = useState('pickup'); // 'pickup' o 'delivery'
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [showDeliveryError, setShowDeliveryError] = useState(false);
    const [pricingCategory, setPricingCategory] = useState(null); // 'local' or 'tourist'
    const [showPricingSelector, setShowPricingSelector] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(null); // 'local' or 'tourist' while loading
    const [customAmount, setCustomAmount] = useState(''); // For Pay What You Want

    // Guided Menu states
    const [guidedMenuQuantity, setGuidedMenuQuantity] = useState(1);
    const [guidedMenuSelections, setGuidedMenuSelections] = useState({}); // { stepId: optionId }
    const [showGuidedMenuError, setShowGuidedMenuError] = useState(false);

    const { addToCart: addToCartContext } = useCart();
    
    // Determinar si se debe mostrar opciones de delivery
    const isDeliveryEvent = eventType === 'delivery';
    

    // Bloquear scroll del body cuando el popup está abierto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset pricing selector when opening popup for traditional Shabbat
            if (!isCustomEvent) {
                if (enableLocalPricing) {
                    setShowPricingSelector(true);
                    setPricingCategory(null);
                } else {
                    // If local pricing is disabled, automatically set to tourist
                    setShowPricingSelector(false);
                    setPricingCategory('tourist');
                }
            }
        } else {
            document.body.style.overflow = 'unset';
            // Reset states when closing
            setPricingCategory(null);
            setShowPricingSelector(false);
            setLoadingCategory(null);
            setQuantities({}); // Reset all quantities to empty
            setTotal(0); // Reset total
            setCustomAmount(''); // Reset PWYW custom amount
            // Reset Guided Menu states
            setGuidedMenuQuantity(1);
            setGuidedMenuSelections({});
            setShowGuidedMenuError(false);
        }

        // Cleanup al desmontar
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, enableLocalPricing, isCustomEvent]);

    // Filter meals based on pricing category for traditional Shabbat
    const filteredMeals = useMemo(() => {
        if (isCustomEvent) {
            return allMeals; // Custom events don't filter by category
        }
        
        if (!pricingCategory) {
            return []; // No meals until category is selected
        }
        
        // Filter meals by category and sort by order
        return allMeals
            .filter(meal => meal.category === pricingCategory)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    }, [isCustomEvent, pricingCategory, allMeals]);

    useEffect(() => {
        const mealsToInit = isCustomEvent ? allMeals : filteredMeals;
        if (mealsToInit.length > 0) {
            setQuantities(prev => {
                const newQuantities = {};
                mealsToInit.forEach((meal, mealIndex) => {
                    if (isCustomEvent) {
                        // Custom events - check if option has variants
                        if (meal.variants && meal.variants.length > 0) {
                            // Initialize quantities for each variant
                            meal.variants.forEach((variant, variantIndex) => {
                                const key = `${mealIndex}-variant-${variantIndex}`;
                                newQuantities[key] = prev[key] || 0;
                            });
                        } else {
                            // Single option without variants
                            const key = `${mealIndex}-0`;
                            newQuantities[key] = prev[key] || 0;
                        }
                    } else {
                        // Regular events have multiple prices per meal
                        meal.prices.forEach((price, priceIndex) => {
                            const key = `${mealIndex}-${priceIndex}`;
                            newQuantities[key] = prev[key] || 0;
                        });
                    }
                });
                return newQuantities;
            });
        }
    }, [isCustomEvent ? JSON.stringify(allMeals) : JSON.stringify(filteredMeals), isCustomEvent]);

    // Set first tab as active when data loads for custom events
    // If Guided Menu is active, it becomes the first tab
    // Re-run when shabbatData changes (new event selected)
    useEffect(() => {
        if (isCustomEvent && shabbatData) {
            if (shabbatData?.base_meal_options_active && shabbatData?.Guided_Menu?.name) {
                // Guided Menu tab is first
                setActiveTab(shabbatData.Guided_Menu.name);
            } else if (shabbatData?.category_menu?.length > 0) {
                // Fallback to first category_menu tab
                setActiveTab(shabbatData.category_menu[0].category_name || 'Category 1');
            }
        }
    }, [isCustomEvent, shabbatData?.documentId, shabbatData?.id, shabbatData?.base_meal_options_active]); // Re-run when event changes

    // Auto-select date when there's only one available (for 'once' repeat mode)
    useEffect(() => {
        if (isCustomEvent && isOpen && shabbatData?.date_event) {
            // Move getAvailableDates logic inline to avoid dependency issues
            const { repeat_mode, date } = shabbatData.date_event;
            
            // Only auto-select for 'once' mode
            if (repeat_mode === 'once' && date && !selectedDate) {
                const eventDate = new Date(date + 'T00:00:00');
                setSelectedDate(eventDate);
            }
        }
    }, [isCustomEvent, isOpen, shabbatData?.date_event?.repeat_mode, shabbatData?.date_event?.date]); // More specific dependencies

    // Generate available dates based on date_event
    const getAvailableDates = () => {
        if (!isCustomEvent || !shabbatData?.date_event) return [];

        const { repeat_mode, date, start_date, end_date, weekly_repeat } = shabbatData.date_event;
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

                    // Generate next 60 days of enabled weekdays (~8.5 weeks)
                    for (let i = 0; i < 60; i++) {
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

    // PWYW can be active for both custom events and traditional Shabbat reservations
    // The parent component already passes the correct value based on the event type
    const isPWYWActive = pwywSiteConfigData === true;

    useEffect(() => {
        // When PWYW is active, total should remain 0
        if (isPWYWActive) {
            setTotal(0);
            return;
        }

        // Calculate Guided Menu total if active
        let guidedMenuTotal = 0;
        if (isCustomEvent && shabbatData?.base_meal_options_active && shabbatData?.Guided_Menu?.price) {
            guidedMenuTotal = parseFloat(shabbatData.Guided_Menu.price) * guidedMenuQuantity;
        }

        const mealsToUse = isCustomEvent ? allMeals : filteredMeals;
        // Calculate extras total (category_menu items)
        const extrasTotal = Object.keys(quantities).reduce((sum, key) => {
            const quantity = quantities[key];
            if (quantity <= 0) return sum;

            if (isCustomEvent) {
                if (key.includes('-variant-')) {
                    // Handle variants
                    const [mealIndex, , variantIndex] = key.split('-').map(Number);
                    const meal = mealsToUse[mealIndex];
                    const variant = meal?.variants?.[variantIndex];
                    const price = parseFloat(variant?.price || 0);
                    return sum + (quantity * price);
                } else {
                    // Handle regular custom event option
                    const [mealIndex] = key.split('-').map(Number);
                    const meal = mealsToUse[mealIndex];
                    const price = parseFloat(meal?.basePrice || 0);
                    return sum + (quantity * price);
                }
            } else {
                // Regular events
                const [mealIndex, priceIndex] = key.split('-').map(Number);
                const meal = mealsToUse[mealIndex];
                const price = parseFloat(meal?.prices[priceIndex]?.price || 0);
                return sum + (quantity * price);
            }
        }, 0);

        setTotal(guidedMenuTotal + extrasTotal);
    }, [quantities, filteredMeals, allMeals, isCustomEvent, isPWYWActive, guidedMenuQuantity, shabbatData?.base_meal_options_active, shabbatData?.Guided_Menu?.price]);

    const updateQuantity = (key, change) => {
        setQuantities(prev => ({
            ...prev,
            [key]: Math.max(0, (prev[key] || 0) + change)
        }));
    };

    // Handler for Pay What You Want custom amount
    const handleCustomAmount = (e) => {
        const value = e.target.value;
        // Only allow numbers and decimal point
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setCustomAmount(value);
        }
    };

    // Handler for Guided Menu radio selection
    const handleGuidedMenuSelection = (stepId, optionId) => {
        setGuidedMenuSelections(prev => ({
            ...prev,
            [stepId]: optionId
        }));
        setShowGuidedMenuError(false);
    };

    // Check if currently viewing Guided Menu tab
    const isGuidedMenuTab = shabbatData?.base_meal_options_active &&
        shabbatData?.Guided_Menu?.name === activeTab;

    // Helper to update Guided Menu quantity
    const updateGuidedMenuQuantity = (change) => {
        setGuidedMenuQuantity(prev => Math.max(1, prev + change));
    };

    // Check if there are items in cart (including Guided Menu)
    const hasGuidedMenuItems = shabbatData?.base_meal_options_active && guidedMenuQuantity > 0;
    const hasExtrasItems = Object.values(quantities).some(qty => qty > 0);
    const hasItems = hasGuidedMenuItems || hasExtrasItems;

    // Calculate final amount (PWYW or regular total)
    const finalAmount = isPWYWActive
        ? (customAmount !== '' && parseFloat(customAmount) > 0 ? parseFloat(customAmount) : 0)
        : total;

    const addToCart = async () => {
        // Validar fecha para eventos custom
        if (isCustomEvent && !selectedDate) {
            setShowDateError(true);
            return;
        }

        // Validar dirección si es evento de delivery
        if (isDeliveryEvent && deliveryType === 'delivery' && !deliveryAddress.trim()) {
            setShowDeliveryError(true);
            return;
        }

        // Validar selecciones del Guided Menu si está activo
        if (isCustomEvent && shabbatData?.base_meal_options_active && shabbatData?.Guided_Menu?.steps) {
            const allStepsSelected = shabbatData.Guided_Menu.steps.every(
                step => guidedMenuSelections[step.id] !== undefined
            );
            if (!allStepsSelected) {
                setShowGuidedMenuError(true);
                return;
            }
        }

        setShowDateError(false);
        setShowDeliveryError(false);
        setShowGuidedMenuError(false);
        setIsLoading(true);

        const mealsToUse = isCustomEvent ? allMeals : filteredMeals;
        const cartItems = [];

        // For PWYW: Calculate total units to distribute the custom amount
        let totalUnits = 0;
        if (isPWYWActive) {
            // Include Guided Menu quantity in total units
            if (shabbatData?.base_meal_options_active) {
                totalUnits += guidedMenuQuantity;
            }
            totalUnits += Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
        }

        // Calculate price per unit for PWYW, or price ratio for regular pricing
        const pricePerUnit = isPWYWActive && totalUnits > 0 ? finalAmount / totalUnits : 0;
        const priceRatio = !isPWYWActive && total > 0 ? finalAmount / total : 1;

        // Add Guided Menu item if active
        if (isCustomEvent && shabbatData?.base_meal_options_active && shabbatData?.Guided_Menu) {
            const guidedMenu = shabbatData.Guided_Menu;
            const itemProductType = 'customEvent';

            // Build selections object with step title -> option name
            const selectionsForCart = {};
            guidedMenu.steps?.forEach(step => {
                const selectedOptionId = guidedMenuSelections[step.id];
                const selectedOption = step.options?.find(opt => opt.id === selectedOptionId);
                if (selectedOption) {
                    selectionsForCart[step.title] = selectedOption.name;
                }
            });

            // Calculate prices based on PWYW or regular pricing
            let adjustedUnitPrice, adjustedTotalPrice;
            if (isPWYWActive) {
                adjustedUnitPrice = pricePerUnit;
                adjustedTotalPrice = guidedMenuQuantity * pricePerUnit;
            } else {
                adjustedUnitPrice = parseFloat(guidedMenu.price || 0);
                adjustedTotalPrice = guidedMenuQuantity * adjustedUnitPrice;
            }

            console.log('🍽️ Adding Guided Menu cart item:', {
                mealName: guidedMenu.name,
                quantity: guidedMenuQuantity,
                selections: selectionsForCart,
                adjustedUnitPrice,
                adjustedTotalPrice
            });

            // Build selections string for display
            const selectionsText = Object.entries(selectionsForCart)
                .map(([step, option]) => `${step}: ${option}`)
                .join(' | ');

            cartItems.push({
                meal: guidedMenu.name,
                priceType: selectionsText || guidedMenu.name,
                quantity: guidedMenuQuantity,
                unitPrice: adjustedUnitPrice,
                totalPrice: adjustedTotalPrice,
                shabbatName: shabbatData?.name,
                shabbatDate: selectedDate ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}` : shabbatData?.name,
                productType: itemProductType,
                isCustomEvent: true,
                isGuidedMenu: true,
                guidedMenuSelections: selectionsForCart,
                pricingCategory: pricingCategory,
                isPWYW: isPWYWActive,
                customAmount: isPWYWActive ? finalAmount : undefined,
                ...(isDeliveryEvent && {
                    deliveryType: deliveryType,
                    deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
                    eventType: eventType
                })
            });
        }

        // Add category_menu extras
        Object.keys(quantities).forEach(key => {
            if (quantities[key] > 0) {
                if (isCustomEvent) {
                    if (key.includes('-variant-')) {
                        // Handle variants
                        const [mealIndex, , variantIndex] = key.split('-').map(Number);
                        const meal = mealsToUse[mealIndex];
                        const variant = meal?.variants?.[variantIndex];

                        if (variant) {
                            // Si es Custom Event, usar 'customEvent' como productType (sin importar si es delivery o reservation)
                            const itemProductType = isCustomEvent ? 'customEvent' : 'mealReservation';

                            // Calculate prices based on PWYW or regular pricing
                            let adjustedUnitPrice, adjustedTotalPrice;
                            if (isPWYWActive) {
                                // For PWYW: Use price per unit distribution
                                adjustedUnitPrice = pricePerUnit;
                                adjustedTotalPrice = quantities[key] * pricePerUnit;
                            } else {
                                // For regular pricing: Use variant price
                                adjustedUnitPrice = parseFloat(variant.price);
                                adjustedTotalPrice = quantities[key] * parseFloat(variant.price);
                            }

                            console.log('🎯 Adding cart item (variant):', {
                                mealName: meal.name,
                                variantTitle: variant.title,
                                isDeliveryEvent,
                                eventType,
                                assignedProductType: itemProductType,
                                deliveryType: isDeliveryEvent ? deliveryType : 'N/A',
                                eventName: shabbatData?.name,
                                isCustomEvent: isCustomEvent,
                                isPWYW: isPWYWActive,
                                adjustedUnitPrice,
                                adjustedTotalPrice
                            });

                            cartItems.push({
                                meal: `${meal.name} - ${variant.title}`,
                                priceType: variant.title,
                                quantity: quantities[key],
                                unitPrice: adjustedUnitPrice,
                                totalPrice: adjustedTotalPrice,
                                shabbatName: shabbatData?.name,
                                shabbatDate: selectedDate ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}` : shabbatData?.name,
                                productType: itemProductType,
                                isCustomEvent: isCustomEvent, // CLAVE: Marcar si es Custom Event
                                pricingCategory: pricingCategory, // Add pricing category
                                isPWYW: isPWYWActive, // Mark if PWYW was used
                                customAmount: isPWYWActive ? finalAmount : undefined, // Store total custom amount for PWYW
                                ...(isDeliveryEvent && {
                                    deliveryType: deliveryType,
                                    deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
                                    eventType: eventType
                                })
                            });
                        }
                    } else {
                        // Handle regular custom event option
                        const [mealIndex] = key.split('-').map(Number);
                        const meal = mealsToUse[mealIndex];

                        // Si es Custom Event, usar 'customEvent' como productType (sin importar si es delivery o reservation)
                        const itemProductType = isCustomEvent ? 'customEvent' : 'mealReservation';

                        // Calculate prices based on PWYW or regular pricing
                        let adjustedUnitPrice, adjustedTotalPrice;
                        if (isPWYWActive) {
                            // For PWYW: Use price per unit distribution
                            adjustedUnitPrice = pricePerUnit;
                            adjustedTotalPrice = quantities[key] * pricePerUnit;
                        } else {
                            // For regular pricing: Use base price
                            adjustedUnitPrice = parseFloat(meal.basePrice);
                            adjustedTotalPrice = quantities[key] * parseFloat(meal.basePrice);
                        }

                        console.log('🎯 Adding cart item (regular):', {
                            mealName: meal.name,
                            isDeliveryEvent,
                            eventType,
                            assignedProductType: itemProductType,
                            deliveryType: isDeliveryEvent ? deliveryType : 'N/A',
                            eventName: shabbatData?.name,
                            isCustomEvent: isCustomEvent,
                            isPWYW: isPWYWActive,
                            adjustedUnitPrice,
                            adjustedTotalPrice
                        });

                        cartItems.push({
                            meal: meal.name,
                            priceType: meal.name,
                            quantity: quantities[key],
                            unitPrice: adjustedUnitPrice,
                            totalPrice: adjustedTotalPrice,
                            shabbatName: shabbatData?.name,
                            shabbatDate: selectedDate ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}` : shabbatData?.name,
                            productType: itemProductType,
                            isCustomEvent: isCustomEvent, // CLAVE: Marcar si es Custom Event
                            pricingCategory: pricingCategory, // Add pricing category
                            isPWYW: isPWYWActive, // Mark if PWYW was used
                            customAmount: isPWYWActive ? finalAmount : undefined, // Store total custom amount for PWYW
                            ...(isDeliveryEvent && {
                                deliveryType: deliveryType,
                                deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
                                eventType: eventType
                            })
                        });
                    }
                } else {
                    // Regular events
                    const [mealIndex, priceIndex] = key.split('-').map(Number);
                    const meal = mealsToUse[mealIndex];
                    const priceOption = meal.prices[priceIndex];

                    let adjustedUnitPrice, adjustedTotalPrice;

                    if (isPWYWActive) {
                        // For PWYW: Use price per unit distribution
                        adjustedUnitPrice = pricePerUnit;
                        adjustedTotalPrice = quantities[key] * pricePerUnit;
                    } else {
                        // For regular pricing: Use original price
                        const basePrice = parseFloat(priceOption.price);
                        adjustedUnitPrice = basePrice * priceRatio;
                        adjustedTotalPrice = quantities[key] * adjustedUnitPrice;
                    }

                    cartItems.push({
                        meal: meal.product,
                        priceType: priceOption.name,
                        quantity: quantities[key],
                        unitPrice: adjustedUnitPrice,
                        totalPrice: adjustedTotalPrice,
                        shabbatName: shabbatData?.name,
                        shabbatDate: formatShabbatDate(shabbatData),
                        productType: 'mealReservation',
                        pricingCategory: pricingCategory, // Add pricing category
                        isPWYW: isPWYWActive, // Mark if PWYW was used
                        customAmount: isPWYWActive ? finalAmount : undefined // Store total custom amount for PWYW
                    });
                }
            }
        });

        if (cartItems.length > 0) {
            // Agregar al carrito - verificar si fue exitoso
            const success = addToCartContext(cartItems);
            
            if (success) {
                // Solo redirigir si se agregó exitosamente
                // Esperar 2 segundos antes de redirigir
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Redirigir al checkout
                setIsLoading(false);
                handleModal(false);
                router.push('/checkout');
            } else {
                // No redirigir si hay conflicto de tipos
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    if (!allMeals || allMeals.length === 0) return null;
    return (

        <div
            className={`w-full h-full flex justify-center items-center p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 fixed top-0 overflow-y-auto z-50 transition-all duration-300 ${
                isOpen 
                    ? 'bg-black/50 backdrop-blur-sm opacity-100' 
                    : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
            }`}
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation(e)}
                className={`w-full max-w-4xl lg:max-w-5xl h-[85vh] sm:h-[82vh] md:h-[78vh] lg:h-[80vh] xl:h-[80vh] max-h-[700px] lg:max-h-[800px] xl:max-h-[900px] min-h-[400px] flex flex-col lg:flex-row rounded-xl overflow-hidden my-auto shadow-2xl transition-all duration-300 transform ${
                    isOpen
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-4'
                }`}>
                {/* Image Section */}
                <div className="w-full lg:w-2/5 h-40 sm:h-48 md:h-56 lg:h-full relative flex-shrink-0 hidden lg:block overflow-hidden rounded-l-xl">
                    <Image 
                        src={getAssetPath("/assets/pictures/shabbat-meals/shabbatbox-single.png")} 
                        alt="reservation for shabbat" 
                        fill 
                        className="w-full h-full object-cover" 
                        style={{
                            borderRadius: '0',
                            border: 'none'
                        }} 
                    />
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-3/5 bg-white flex flex-col h-full overflow-hidden">
                    {/* Fixed Header */}
                    <div className="p-3 sm:p-4 md:p-6 border-b border-gray-100 flex-shrink-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 pr-2">
                                <h2 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-darkBlue mb-1">
                                    {isCustomEvent ? shabbatData?.name || "Custom Event" : "Shabbat Meals"}
                                </h2>
                                <p className="text-gray-text text-[10px] sm:text-xs md:text-sm lg:text-base">
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
                                <FaTimes size={14} className="sm:w-4 sm:h-4" />
                            </button>
                        </div>
                        
                        {/* Date Selector for Custom Events */}
                        {isCustomEvent && (() => {
                            const availableDates = getAvailableDates();
                            
                            if (availableDates.length === 0) {
                                // No dates available
                                return (
                                    <div className="mb-3">
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
                                    <div className="mb-3">
                                        <div className={`p-2 border rounded-lg ${
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
                                    <div className="mb-3">
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
                        
                        {/* Delivery Options for Delivery Events */}
                        {isDeliveryEvent && (
                            <div className="mb-3">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">Delivery Options *</h3>
                                
                                {/* Radio buttons */}
                                <div className="flex gap-4 mb-3">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryType"
                                            value="pickup"
                                            checked={deliveryType === 'pickup'}
                                            onChange={(e) => {
                                                setDeliveryType(e.target.value);
                                                setShowDeliveryError(false);
                                            }}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Pickup</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="deliveryType"
                                            value="delivery"
                                            checked={deliveryType === 'delivery'}
                                            onChange={(e) => {
                                                setDeliveryType(e.target.value);
                                                setShowDeliveryError(false);
                                            }}
                                            className="mr-2"
                                        />
                                        <span className="text-sm text-gray-700">Delivery</span>
                                    </label>
                                </div>
                                
                                {/* Conditional address field */}
                                {deliveryType === 'delivery' && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter delivery address *"
                                            value={deliveryAddress}
                                            onChange={(e) => {
                                                setDeliveryAddress(e.target.value);
                                                setShowDeliveryError(false);
                                            }}
                                            className={`w-full p-3 border rounded-lg text-gray-700 text-sm ${
                                                showDeliveryError && !deliveryAddress.trim() 
                                                    ? 'border-red-500 bg-red-50' 
                                                    : 'border-gray-300'
                                            }`}
                                            required
                                        />
                                        {showDeliveryError && !deliveryAddress.trim() && (
                                            <p className="text-red-500 text-sm mt-1">Please enter a delivery address</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Tabs for Custom Events */}
                        {isCustomEvent && (shabbatData?.base_meal_options_active || shabbatData?.category_menu?.length > 0) && (
                            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide pb-2">
                                {/* Guided Menu Tab (first if active) */}
                                {shabbatData?.base_meal_options_active && shabbatData?.Guided_Menu?.name && (
                                    <button
                                        onClick={() => setActiveTab(shabbatData.Guided_Menu.name)}
                                        className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer flex-shrink-0 ${
                                            activeTab === shabbatData.Guided_Menu.name
                                                ? 'text-primary border-b-2 border-primary'
                                                : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                    >
                                        {shabbatData.Guided_Menu.name}
                                    </button>
                                )}
                                {/* Category Menu Tabs */}
                                {shabbatData?.category_menu?.map((category, index) => (
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
                    <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 min-h-0">
                        {/* Local/Tourist Selector for Traditional Shabbat */}
                        {!isCustomEvent && showPricingSelector && (
                            <div className="flex flex-col items-center justify-center py-8">
                                <h2 className="text-xl sm:text-2xl font-bold text-darkBlue mb-6">
                                    Are you a local or a tourist?
                                </h2>
                                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                                    {/* Local Card */}
                                    <button
                                        onClick={() => {
                                            setLoadingCategory('local');
                                            setTimeout(() => {
                                                setPricingCategory('local');
                                                setShowPricingSelector(false);
                                                setLoadingCategory(null);
                                            }, 800); // 800ms delay for loading effect
                                        }}
                                        disabled={loadingCategory !== null}
                                        className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                                            loadingCategory === 'local' 
                                                ? 'border-primary bg-primary/5 scale-95' 
                                                : loadingCategory === 'tourist'
                                                ? 'opacity-50 cursor-not-allowed border-gray-200'
                                                : 'border-gray-200 hover:border-primary hover:shadow-lg cursor-pointer group'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            {loadingCategory === 'local' ? (
                                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-3"></div>
                                            ) : (
                                                <FaHome className={`text-4xl text-primary ${loadingCategory === null ? 'group-hover:scale-110' : ''} transition-transform mb-3`} />
                                            )}
                                            <h3 className="text-lg font-semibold text-darkBlue">Local</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {loadingCategory === 'local' ? 'Loading...' : 'I live in Panama'}
                                            </p>
                                        </div>
                                    </button>
                                    
                                    {/* Tourist Card */}
                                    <button
                                        onClick={() => {
                                            setLoadingCategory('tourist');
                                            setTimeout(() => {
                                                setPricingCategory('tourist');
                                                setShowPricingSelector(false);
                                                setLoadingCategory(null);
                                            }, 800); // 800ms delay for loading effect
                                        }}
                                        disabled={loadingCategory !== null}
                                        className={`flex-1 p-6 border-2 rounded-xl transition-all ${
                                            loadingCategory === 'tourist' 
                                                ? 'border-primary bg-primary/5 scale-95' 
                                                : loadingCategory === 'local'
                                                ? 'opacity-50 cursor-not-allowed border-gray-200'
                                                : 'border-gray-200 hover:border-primary hover:shadow-lg cursor-pointer group'
                                        }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            {loadingCategory === 'tourist' ? (
                                                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-3"></div>
                                            ) : (
                                                <FaSuitcase className={`text-4xl text-primary ${loadingCategory === null ? 'group-hover:scale-110' : ''} transition-transform mb-3`} />
                                            )}
                                            <h3 className="text-lg font-semibold text-darkBlue">Tourist</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {loadingCategory === 'tourist' ? 'Loading...' : "I'm visiting Panama"}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {/* Meals Content */}
                        {(!showPricingSelector || isCustomEvent) && (
                        <div className="space-y-6">
                        {isCustomEvent ? (
                            // Custom events - check if we're on Guided Menu tab or category_menu tab
                            isGuidedMenuTab ? (
                                // Guided Menu Content
                                <div className="space-y-6">
                                    {/* Quantity Selector */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-base sm:text-lg font-semibold text-darkBlue">
                                                    Number of Plates
                                                </h3>
                                                {!isPWYWActive && shabbatData?.Guided_Menu?.price && (
                                                    <p className="text-sm text-gray-500">
                                                        ${shabbatData.Guided_Menu.price} per plate
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateGuidedMenuQuantity(-1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                >
                                                    <FaMinus size={12} />
                                                </button>
                                                <span className="text-lg font-semibold text-darkBlue min-w-8 text-center">
                                                    {guidedMenuQuantity}
                                                </span>
                                                <button
                                                    onClick={() => updateGuidedMenuQuantity(1)}
                                                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                >
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Steps with Radio Options */}
                                    {shabbatData?.Guided_Menu?.steps?.map((step) => (
                                        <div key={step.id} className={`border rounded-lg p-4 ${
                                            showGuidedMenuError && !guidedMenuSelections[step.id]
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200'
                                        }`}>
                                            <h3 className="text-base sm:text-lg font-semibold text-darkBlue mb-4">
                                                {step.title} <span className="text-red-500">*</span>
                                            </h3>
                                            <div className="space-y-3">
                                                {step.options?.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                                            guidedMenuSelections[step.id] === option.id
                                                                ? 'bg-primary/10 border border-primary'
                                                                : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`step-${step.id}`}
                                                            checked={guidedMenuSelections[step.id] === option.id}
                                                            onChange={() => handleGuidedMenuSelection(step.id, option.id)}
                                                            className="mt-1 w-4 h-4 text-primary cursor-pointer"
                                                        />
                                                        <div className="flex-1">
                                                            <span className="text-sm sm:text-base font-medium text-darkBlue">
                                                                {option.name}
                                                            </span>
                                                            {option.description && (
                                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                                    {option.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                            {showGuidedMenuError && !guidedMenuSelections[step.id] && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    Please select an option
                                                </p>
                                            )}
                                        </div>
                                    ))}

                                    {/* Guided Menu Description */}
                                    {shabbatData?.Guided_Menu?.description && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <p className="text-sm text-blue-800">
                                                {shabbatData.Guided_Menu.description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                            // Category Menu Content - show only active tab items
                            shabbatData?.category_menu
                                ?.find(cat => (cat.category_name || `Category ${shabbatData.category_menu.indexOf(cat) + 1}`) === activeTab)
                                ?.option?.map((meal, localIndex) => {
                                    // Calculate the global index in allMeals
                                    const categoryIndex = shabbatData.category_menu.findIndex(
                                        cat => (cat.category_name || `Category ${shabbatData.category_menu.indexOf(cat) + 1}`) === activeTab
                                    );
                                    const mealIndex = shabbatData.category_menu
                                        .slice(0, categoryIndex)
                                        .reduce((sum, cat) => sum + (cat.option?.length || 0), 0) + localIndex;
                                    
                                    return (
                                    <div key={mealIndex} className="border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4">
                                        <h3 className="text-base sm:text-lg font-semibold text-darkBlue mb-3 sm:mb-4">{meal.name}</h3>
                                        
                                        {meal.description && (
                                            <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
                                        )}
                                        
                                        {meal.includes && (
                                            <div className="text-xs text-gray-600 mb-3">
                                                <span className="font-medium">Includes: </span>
                                                <ReactMarkdown
                                                    components={{
                                                        p: ({ children }) => <span className="inline">{children}</span>,
                                                        ul: ({ children }) => <ul className="list-disc ml-4 mt-1 space-y-0.5">{children}</ul>,
                                                        li: ({ children }) => <li className="text-xs text-gray-600">{children}</li>,
                                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>
                                                    }}
                                                >
                                                    {meal.includes}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                        
                                        {meal.variants && meal.variants.length > 0 ? (
                                            // Render variants (like Pescados)
                                            <div className="space-y-3">
                                                {meal.variants.map((variant, variantIndex) => {
                                                    const variantKey = `${mealIndex}-variant-${variantIndex}`;
                                                    return (
                                                        <div key={variantIndex} className="flex items-center justify-between gap-2 bg-gray-50 p-3 rounded">
                                                            <div className="min-w-0 flex-1 pr-2">
                                                                <span className="text-gray-text text-xs sm:text-sm break-words">{variant.title}</span>
                                                                {variant.description && (
                                                                    <div className="text-xs text-gray-500 mt-1">{variant.description}</div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                                                                {!isPWYWActive && (
                                                                    <span className="text-sm sm:text-base font-semibold text-myBlack whitespace-nowrap">
                                                                        ${variant.price}
                                                                    </span>
                                                                )}
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
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0 flex-1 pr-2">
                                                        <span className="text-gray-text text-xs sm:text-sm break-words">{meal.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                                                        {!isPWYWActive && (
                                                            <span className="text-sm sm:text-base font-semibold text-myBlack whitespace-nowrap">
                                                                ${meal.basePrice}
                                                            </span>
                                                        )}
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
                                    );
                                }) || [])
                        ) : (
                            // Regular events - show filtered meals
                            filteredMeals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4">
                                <h3 className="text-base sm:text-lg font-semibold text-darkBlue mb-3 sm:mb-4">{meal.product}</h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {meal.prices.map((priceOption, priceIndex) => {
                                        const key = `${mealIndex}-${priceIndex}`;
                                        return (
                                            <div key={priceIndex} className="flex items-center justify-between gap-2">
                                                <span className="text-gray-text text-xs sm:text-sm md:text-base break-words min-w-0 flex-1 pr-2">{priceOption.name}</span>
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => updateQuantity(key, -1)}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                    >
                                                        <FaMinus className="text-gray-text text-xs sm:text-sm"  />
                                                    </button>
                                                    <span className="w-8 sm:w-10 text-center text-gray-text text-xs sm:text-sm md:text-base">
                                                        {quantities[key] || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(key, 1)}
                                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                    >
                                                        <FaPlus className="text-gray-text text-xs sm:text-sm"  />
                                                    </button>
                                                    {!isPWYWActive && (
                                                        <span className="w-16 sm:w-20 text-right text-gray-text text-xs sm:text-sm md:text-base whitespace-nowrap">
                                                            ${parseFloat(priceOption.price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )))}
                        </div>
                        )}
                    </div>

                    {/* Fixed Footer */}
                    <div className="border-t border-gray-200 p-3 sm:p-4 md:p-5 flex-shrink-0 bg-white">
                        {isPWYWActive ? (
                            // Pay What You Want UI
                            <>
                                {/* Pay What You Want Input */}
                                {hasItems && (
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Pay What You Want
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                            <input
                                                type="text"
                                                value={customAmount}
                                                onChange={handleCustomAmount}
                                                placeholder="0.00"
                                                className="w-full pl-8 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none text-sm"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Enter the amount you wish to pay
                                        </p>
                                    </div>
                                )}

                                {/* You Pay */}
                                <div className="flex justify-between items-center mb-2 sm:mb-3">
                                    <span className="text-darkBlue font-bold text-xs sm:text-sm md:text-base">You Pay:</span>
                                    <span className="text-darkBlue font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
                                        ${finalAmount.toFixed(2)}
                                    </span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={addToCart}
                                    disabled={!hasItems || isLoading || finalAmount === 0}
                                    className={`w-full font-bold py-2 sm:py-3 rounded-lg transition flex justify-between px-3 sm:px-4 items-center cursor-pointer touch-manipulation text-xs sm:text-sm md:text-base ${
                                        hasItems && !isLoading && finalAmount > 0
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
                                            <span className="whitespace-nowrap">${finalAmount.toFixed(2)}</span>
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            // Regular UI
                            <>
                                {/* Total */}
                                <div className="flex justify-between items-center mb-2 sm:mb-3">
                                    <span className="text-darkBlue font-bold text-xs sm:text-sm md:text-base">Total:</span>
                                    <span className="text-darkBlue font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">${total.toFixed(2)}</span>
                                </div>

                                {/* Add to Cart Button */}
                                <button
                                    onClick={addToCart}
                                    disabled={total === 0 || isLoading}
                                    className={`w-full font-bold py-2 sm:py-3 rounded-lg transition flex justify-between px-3 sm:px-4 items-center cursor-pointer touch-manipulation text-xs sm:text-sm md:text-base ${total > 0 && !isLoading
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
                                            <span className="whitespace-nowrap">${total.toFixed(2)}</span>
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};