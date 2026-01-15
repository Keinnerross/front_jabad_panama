'use client'
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import ReactMarkdown from 'react-markdown';
import { formatShabbatDate } from "@/app/utils/formatShabbatDate";
import { getAssetPath } from "@/app/utils/assetPath";
import { getOptimizedImageUrl } from "@/app/utils/imagesArrayValidation";

// Modular components
import { DateSelector } from './popupReservations/DateSelector';
import { DateSelectorModal } from './popupReservations/DateSelectorModal';
import { DeliveryOptionsTag } from './popupReservations/DeliveryOptionsTag';
import { DeliveryModal } from './popupReservations/DeliveryModal';
import { PricingSelector } from './popupReservations/PricingSelector';
import { CartConflictModal } from '@/app/components/ui/cart/CartConflictModal';

export const PopupReservations = ({ isOpen = false, handleModal, selectedMeal, shabbatData, allMeals = [], isCustomEvent = false, eventType = null, enableLocalPricing = false, pwywSiteConfigData = false, globalDeliveryZones = null, customDeliveryZones = [], customDeliveryIsActive = false, pickupAddress = "Sinagoga Address" }) => {
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
    const [selectedDeliveryZone, setSelectedDeliveryZone] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [pricingCategory, setPricingCategory] = useState(null); // 'local' or 'tourist'
    const [showPricingSelector, setShowPricingSelector] = useState(false);
    const [loadingCategory, setLoadingCategory] = useState(null); // 'local' or 'tourist' while loading
    const [customAmount, setCustomAmount] = useState(''); // For Pay What You Want

    // Guided Menu states
    const [guidedMenuQuantity, setGuidedMenuQuantity] = useState(1);
    const [guidedMenuSelections, setGuidedMenuSelections] = useState({}); // { stepId: optionId }
    const [showGuidedMenuError, setShowGuidedMenuError] = useState(false);
    const [selectedPlatePrice, setSelectedPlatePrice] = useState(null); // Selected price option from plates_prices

    // Delivery sub-modal state
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);

    // Date selector sub-modal state
    const [showDateModal, setShowDateModal] = useState(false);

    const {
        addToCart: addToCartContext,
        showConflictModal,
        conflictInfo,
        clearAndAddPending,
        closeConflictModal
    } = useCart();

    // Determinar si se debe mostrar opciones de delivery
    const isDeliveryEvent = eventType === 'delivery';

    // Determinar qué zonas de delivery usar (custom del evento vs globales vs ninguna)
    const getActiveDeliveryZones = () => {
        // Si el evento tiene delivery zones custom activas, usarlas
        if (customDeliveryIsActive && customDeliveryZones?.length > 0) {
            return {
                zones: customDeliveryZones.filter(z => z.zone_name),
                useZones: true,
                source: 'custom'
            };
        }

        // Si hay zonas globales activas, usarlas
        if (globalDeliveryZones?.delivery_zones_is_active &&
            globalDeliveryZones?.delivery_zone?.length > 0) {
            return {
                zones: globalDeliveryZones.delivery_zone.filter(z => z.zone_name),
                useZones: true,
                source: 'global'
            };
        }

        // No hay zonas activas - usar campo de texto libre
        return { zones: [], useZones: false, source: 'none' };
    };

    const deliveryZonesConfig = getActiveDeliveryZones();

    // Helper to get current plate price (from plates_prices or fallback to free)
    const getSelectedPlatePrice = () => {
        const platesPrices = shabbatData?.Guided_Menu?.plates_prices;
        if (!platesPrices || platesPrices.length === 0) return 0; // Fallback: free
        if (selectedPlatePrice) return parseFloat(selectedPlatePrice.price || 0);
        return parseFloat(platesPrices[0]?.price || 0); // Default: first option
    };

    // Handler para cambio de zona de delivery
    const handleDeliveryZoneChange = (e) => {
        const zoneId = parseInt(e.target.value);
        if (!zoneId) {
            setSelectedDeliveryZone(null);
            setDeliveryFee(0);
            return;
        }

        const zone = deliveryZonesConfig.zones.find(z => z.id === zoneId);
        if (zone) {
            setSelectedDeliveryZone(zone);
            // Si delivery_fee es null o undefined, tratarlo como gratis (0)
            setDeliveryFee(zone.delivery_fee > 0 ? parseFloat(zone.delivery_fee) : 0);
            setShowDeliveryError(false);
        }
    };

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
            setSelectedPlatePrice(null); // Reset plate price selection
            // Reset Delivery Zone states
            setSelectedDeliveryZone(null);
            setDeliveryFee(0);
            setDeliveryType('pickup');
            setDeliveryAddress('');
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

    // Auto-select first plate price option when popup opens
    useEffect(() => {
        if (isCustomEvent && isOpen && shabbatData?.Guided_Menu?.plates_prices?.length > 0) {
            if (!selectedPlatePrice) {
                setSelectedPlatePrice(shabbatData.Guided_Menu.plates_prices[0]);
            }
        }
    }, [isCustomEvent, isOpen, shabbatData?.Guided_Menu?.plates_prices]);

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

                    // Generate next 365 days of enabled weekdays (~1 year)
                    for (let i = 0; i < 365; i++) {
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
        if (isCustomEvent && shabbatData?.base_meal_options_active && shabbatData?.Guided_Menu) {
            guidedMenuTotal = getSelectedPlatePrice() * guidedMenuQuantity;
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

        // Include delivery fee if delivery is selected
        const currentDeliveryFee = (isDeliveryEvent && deliveryType === 'delivery') ? deliveryFee : 0;
        setTotal(guidedMenuTotal + extrasTotal + currentDeliveryFee);
    }, [quantities, filteredMeals, allMeals, isCustomEvent, isPWYWActive, guidedMenuQuantity, shabbatData?.base_meal_options_active, selectedPlatePrice, isDeliveryEvent, deliveryType, deliveryFee]);

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

        // Validar delivery: zona si hay zonas activas, o dirección si es campo de texto
        if (isDeliveryEvent && deliveryType === 'delivery') {
            if (deliveryZonesConfig.useZones) {
                // Validar que se haya seleccionado una zona
                if (!selectedDeliveryZone) {
                    setShowDeliveryError(true);
                    return;
                }
            } else {
                // Validar que se haya ingresado una dirección
                if (!deliveryAddress.trim()) {
                    setShowDeliveryError(true);
                    return;
                }
            }
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
                adjustedUnitPrice = getSelectedPlatePrice();
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
                    deliveryZone: deliveryType === 'delivery' && deliveryZonesConfig.useZones ? selectedDeliveryZone : null,
                    deliveryFee: deliveryType === 'delivery' ? deliveryFee : 0,
                    deliveryAddress: deliveryType === 'delivery'
                        ? (deliveryZonesConfig.useZones ? selectedDeliveryZone?.zone_name : deliveryAddress)
                        : null,
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
                                    deliveryZone: deliveryType === 'delivery' && deliveryZonesConfig.useZones ? selectedDeliveryZone : null,
                                    deliveryFee: deliveryType === 'delivery' ? deliveryFee : 0,
                                    deliveryAddress: deliveryType === 'delivery'
                                        ? (deliveryZonesConfig.useZones ? selectedDeliveryZone?.zone_name : deliveryAddress)
                                        : null,
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
                                deliveryZone: deliveryType === 'delivery' && deliveryZonesConfig.useZones ? selectedDeliveryZone : null,
                                deliveryFee: deliveryType === 'delivery' ? deliveryFee : 0,
                                deliveryAddress: deliveryType === 'delivery'
                                    ? (deliveryZonesConfig.useZones ? selectedDeliveryZone?.zone_name : deliveryAddress)
                                    : null,
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
            const result = addToCartContext(cartItems);

            if (result === true) {
                // Solo redirigir si se agregó exitosamente
                // Esperar 2 segundos antes de redirigir
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Redirigir al checkout
                setIsLoading(false);
                handleModal(false);
                router.push('/checkout');
            } else if (result === 'conflict') {
                // Conflict modal is shown - stop loading but don't close popup
                setIsLoading(false);
                // Modal is handled by CartConflictModal component
            } else {
                // No redirigir si hay error
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    };

    if (!allMeals || allMeals.length === 0) return null;
    return (
        <>
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
                className={`w-full max-w-4xl md:max-w-5xl lg:max-w-6xl h-[90vh] sm:h-[88vh] md:h-[88vh] lg:h-[90vh] xl:h-[88vh] max-h-[800px] md:max-h-[850px] lg:max-h-none xl:max-h-none min-h-[500px] flex flex-col lg:flex-row rounded-xl overflow-hidden my-auto shadow-2xl transition-all duration-300 transform ${
                    isOpen
                        ? 'scale-100 opacity-100 translate-y-0'
                        : 'scale-95 opacity-0 translate-y-4'
                }`}>
                {/* Image Section */}
                <div className="w-full lg:w-1/3 xl:w-2/5 h-40 sm:h-48 md:h-56 lg:h-full relative flex-shrink-0 hidden lg:block overflow-hidden rounded-l-xl">
                    <Image
                        src={getOptimizedImageUrl(
                            shabbatData?.popup_picture,
                            'medium',
                            getAssetPath("/assets/pictures/shabbat-meals/shabbatbox-single.png")
                        )}
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
                <div className="w-full lg:w-2/3 xl:w-3/5 bg-white flex flex-col h-full overflow-hidden">
                    {/* Fixed Header */}
                    <div className="p-3 sm:p-3 md:p-3 lg:p-4 xl:p-4 border-b border-gray-100 flex-shrink-0">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 pr-2">
                                <h2 className="text-sm sm:text-sm md:text-base lg:text-base xl:text-lg font-bold text-darkBlue mb-1">
                                    {isCustomEvent ? shabbatData?.name || "Custom Event" : "Shabbat Meals"}
                                </h2>
                                <p className="text-gray-text text-[10px] sm:text-xs md:text-xs lg:text-xs xl:text-sm">
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

                        {/* Horizontal container for Date Selector and Delivery Options */}
                        {(isCustomEvent || isDeliveryEvent) && (
                            <div className="flex flex-col sm:flex-row gap-3 mb-2">
                                {/* Date Selector for Custom Events */}
                                {isCustomEvent && (
                                    <DateSelector
                                        shabbatData={shabbatData}
                                        selectedDate={selectedDate}
                                        setSelectedDate={setSelectedDate}
                                        showDateError={showDateError}
                                        setShowDateError={setShowDateError}
                                        getAvailableDates={getAvailableDates}
                                        onOpenModal={() => setShowDateModal(true)}
                                    />
                                )}

                                {/* Delivery Options Tag - Opens Sub-Modal */}
                                {isDeliveryEvent && (
                                    <DeliveryOptionsTag
                                        deliveryType={deliveryType}
                                        pickupAddress={pickupAddress}
                                        selectedDeliveryZone={selectedDeliveryZone}
                                        deliveryAddress={deliveryAddress}
                                        deliveryFee={deliveryFee}
                                        showDeliveryError={showDeliveryError}
                                        onClick={() => setShowDeliveryModal(true)}
                                    />
                                )}
                            </div>
                        )}

                        {/* Tabs for Custom Events */}
                        {isCustomEvent && (shabbatData?.base_meal_options_active || shabbatData?.category_menu?.length > 0) && (
                            <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide pb-1 md:pb-1 lg:pb-1">
                                {/* Guided Menu Tab (first if active) */}
                                {shabbatData?.base_meal_options_active && shabbatData?.Guided_Menu?.name && (
                                    <button
                                        onClick={() => setActiveTab(shabbatData.Guided_Menu.name)}
                                        className={`px-2 py-1.5 md:px-3 md:py-1.5 lg:px-3 lg:py-1.5 text-xs md:text-sm lg:text-sm font-medium whitespace-nowrap cursor-pointer flex-shrink-0 ${
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
                                        className={`px-2 py-1.5 md:px-3 md:py-1.5 lg:px-3 lg:py-1.5 text-xs md:text-sm lg:text-sm font-medium whitespace-nowrap cursor-pointer flex-shrink-0 ${
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
                    <div className="flex-1 overflow-y-auto p-2 sm:p-2 md:p-2 lg:p-4 xl:p-4 min-h-0">
                        {/* Local/Tourist Selector for Traditional Shabbat */}
                        {!isCustomEvent && showPricingSelector && (
                            <PricingSelector
                                loadingCategory={loadingCategory}
                                onSelectLocal={() => {
                                    setLoadingCategory('local');
                                    setTimeout(() => {
                                        setPricingCategory('local');
                                        setShowPricingSelector(false);
                                        setLoadingCategory(null);
                                    }, 800);
                                }}
                                onSelectTourist={() => {
                                    setLoadingCategory('tourist');
                                    setTimeout(() => {
                                        setPricingCategory('tourist');
                                        setShowPricingSelector(false);
                                        setLoadingCategory(null);
                                    }, 800);
                                }}
                            />
                        )}
                        
                        {/* Meals Content */}
                        {(!showPricingSelector || isCustomEvent) && (
                        <div className="space-y-6">
                        {isCustomEvent ? (
                            // Custom events - check if we're on Guided Menu tab or category_menu tab
                            isGuidedMenuTab ? (
                                // Guided Menu Content
                                <div className="space-y-3 md:space-y-2 lg:space-y-3">
                                    {/* Quantity Selector */}
                                    <div className="border border-gray-200 rounded-lg p-2 md:p-2 lg:p-3">
                                        {/* Row: Title + Quantity buttons */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue">
                                                    Number of Plates
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-1.5 lg:gap-2">
                                                <button
                                                    onClick={() => updateGuidedMenuQuantity(-1)}
                                                    className="w-8 h-8 md:w-7 md:h-7 lg:w-7 lg:h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                >
                                                    <FaMinus size={10} />
                                                </button>
                                                <span className="text-base md:text-sm lg:text-sm font-semibold text-darkBlue min-w-6 text-center">
                                                    {guidedMenuQuantity}
                                                </span>
                                                <button
                                                    onClick={() => updateGuidedMenuQuantity(1)}
                                                    className="w-8 h-8 md:w-7 md:h-7 lg:w-7 lg:h-7 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                >
                                                    <FaPlus size={10} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price Options (plates_prices) */}
                                        {!isPWYWActive && shabbatData?.Guided_Menu?.plates_prices?.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                {shabbatData.Guided_Menu.plates_prices.map((priceOption) => (
                                                    <label
                                                        key={priceOption.id}
                                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                                                            selectedPlatePrice?.id === priceOption.id
                                                                ? 'bg-primary/10 border border-primary'
                                                                : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                                                        }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="plate-price"
                                                            checked={selectedPlatePrice?.id === priceOption.id}
                                                            onChange={() => setSelectedPlatePrice(priceOption)}
                                                            className="w-3.5 h-3.5 text-primary cursor-pointer"
                                                        />
                                                        <span className="text-xs font-medium text-darkBlue">
                                                            {priceOption.Text}
                                                        </span>
                                                        <span className="text-xs text-gray-500 ml-auto">
                                                            ${priceOption.price} per plate
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}

                                        {/* Fallback: No prices = Free */}
                                        {!isPWYWActive && (!shabbatData?.Guided_Menu?.plates_prices || shabbatData.Guided_Menu.plates_prices.length === 0) && (
                                            <p className="text-sm text-gray-500 mt-1">Free</p>
                                        )}
                                    </div>

                                    {/* Steps with Radio Options */}
                                    {shabbatData?.Guided_Menu?.steps?.map((step) => (
                                        <div key={step.id} className={`border rounded-lg p-2 md:p-2 lg:p-3 ${
                                            showGuidedMenuError && !guidedMenuSelections[step.id]
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200'
                                        }`}>
                                            <h3 className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue mb-2 md:mb-2 lg:mb-2">
                                                {step.title} <span className="text-red-500">*</span>
                                            </h3>
                                            <div className="space-y-1.5 md:space-y-1 lg:space-y-3">
                                                {step.options?.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className={`flex items-start gap-2 p-2 md:p-1.5 lg:p-3 rounded-lg cursor-pointer transition-colors ${
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
                                    <div key={mealIndex} className="border border-gray-200 rounded-lg p-2 md:p-2 lg:p-3">
                                        <h3 className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue mb-2 md:mb-1.5 lg:mb-2">{meal.name}</h3>
                                        
                                        {meal.description && (
                                            <p className="text-gray-600 text-xs md:text-xs lg:text-xs mb-2 md:mb-1.5 lg:mb-2">{meal.description}</p>
                                        )}
                                        
                                        {meal.includes && (
                                            <div className="text-[10px] md:text-[10px] lg:text-xs text-gray-600 mb-2 md:mb-1.5 lg:mb-2">
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
                                            <div className="space-y-1.5 md:space-y-1 lg:space-y-3">
                                                {meal.variants.map((variant, variantIndex) => {
                                                    const variantKey = `${mealIndex}-variant-${variantIndex}`;
                                                    return (
                                                        <div key={variantIndex} className="flex items-center justify-between gap-2 bg-gray-50 p-2 md:p-1.5 lg:p-3 rounded">
                                                            <div className="min-w-0 flex-1 pr-2">
                                                                <span className="text-gray-text text-[11px] md:text-[11px] lg:text-xs break-words">{variant.title}</span>
                                                                {variant.description && (
                                                                    <div className="text-[10px] md:text-[10px] lg:text-xs text-gray-500 mt-0.5">{variant.description}</div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-2 md:gap-2 lg:gap-2 flex-shrink-0">
                                                                {!isPWYWActive && (
                                                                    <span className="text-xs md:text-sm lg:text-sm font-semibold text-myBlack whitespace-nowrap">
                                                                        ${variant.price}
                                                                    </span>
                                                                )}
                                                                <div className="flex items-center gap-1.5 md:gap-1.5 lg:gap-2">
                                                                    <button
                                                                        onClick={() => updateQuantity(variantKey, -1)}
                                                                        className="w-7 h-7 md:w-6 md:h-6 lg:w-6 lg:h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                                    >
                                                                        <FaMinus size={10} />
                                                                    </button>
                                                                    <span className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue min-w-5 md:min-w-5 lg:min-w-5 text-center">
                                                                        {quantities[variantKey] || 0}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => updateQuantity(variantKey, 1)}
                                                                        className="w-7 h-7 md:w-6 md:h-6 lg:w-6 lg:h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                                    >
                                                                        <FaPlus size={10} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            // Render regular option without variants
                                            <div className="space-y-1.5 md:space-y-1 lg:space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="min-w-0 flex-1 pr-2">
                                                        <span className="text-gray-text text-[11px] md:text-[11px] lg:text-xs break-words">{meal.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 md:gap-2 lg:gap-2 flex-shrink-0">
                                                        {!isPWYWActive && (
                                                            <span className="text-xs md:text-sm lg:text-sm font-semibold text-myBlack whitespace-nowrap">
                                                                ${meal.basePrice}
                                                            </span>
                                                        )}
                                                        <div className="flex items-center gap-1.5 md:gap-1.5 lg:gap-2">
                                                            <button
                                                                onClick={() => updateQuantity(`${mealIndex}-0`, -1)}
                                                                className="w-7 h-7 md:w-6 md:h-6 lg:w-6 lg:h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                            >
                                                                <FaMinus size={10} />
                                                            </button>
                                                            <span className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue min-w-5 md:min-w-5 lg:min-w-5 text-center">
                                                                {quantities[`${mealIndex}-0`] || 0}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(`${mealIndex}-0`, 1)}
                                                                className="w-7 h-7 md:w-6 md:h-6 lg:w-6 lg:h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                            >
                                                                <FaPlus size={10} />
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
                            <div key={mealIndex} className="border border-gray-200 rounded-lg p-2 md:p-2 lg:p-3">
                                <h3 className="text-sm md:text-sm lg:text-sm font-semibold text-darkBlue mb-2 md:mb-1.5 lg:mb-2">{meal.product}</h3>
                                <div className="space-y-1.5 md:space-y-1 lg:space-y-3">
                                    {meal.prices.map((priceOption, priceIndex) => {
                                        const key = `${mealIndex}-${priceIndex}`;
                                        return (
                                            <div key={priceIndex} className="flex items-center justify-between gap-2 md:gap-1.5 lg:gap-2">
                                                <span className="text-gray-text text-xs md:text-xs lg:text-sm break-words min-w-0 flex-1 pr-1">{priceOption.name}</span>
                                                <div className="flex items-center gap-1.5 md:gap-1.5 lg:gap-2 flex-shrink-0">
                                                    <button
                                                        onClick={() => updateQuantity(key, -1)}
                                                        className="w-7 h-7 md:w-6 md:h-6 lg:w-6 lg:h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                    >
                                                        <FaMinus size={10} />
                                                    </button>
                                                    <span className="w-5 md:w-5 lg:w-5 text-center text-darkBlue font-semibold text-sm md:text-sm lg:text-sm">
                                                        {quantities[key] || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(key, 1)}
                                                        className="w-7 h-7 md:w-6 md:h-6 lg:w-6 lg:h-6 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer touch-manipulation"
                                                    >
                                                        <FaPlus size={10} />
                                                    </button>
                                                    {!isPWYWActive && (
                                                        <span className="w-14 md:w-12 lg:w-16 text-right text-myBlack font-semibold text-xs md:text-sm lg:text-sm whitespace-nowrap">
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
                    <div className="border-t border-gray-200 p-2 sm:p-2 md:p-2 lg:p-3 xl:p-3 flex-shrink-0 bg-white">
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

        {/* Delivery Options Sub-Modal - Outside popup parent for full-screen coverage */}
        <DeliveryModal
            isOpen={showDeliveryModal}
            onClose={() => setShowDeliveryModal(false)}
            deliveryType={deliveryType}
            setDeliveryType={setDeliveryType}
            pickupAddress={pickupAddress}
            deliveryZonesConfig={deliveryZonesConfig}
            selectedDeliveryZone={selectedDeliveryZone}
            setSelectedDeliveryZone={setSelectedDeliveryZone}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            deliveryFee={deliveryFee}
            setDeliveryFee={setDeliveryFee}
            showDeliveryError={showDeliveryError}
            setShowDeliveryError={setShowDeliveryError}
        />

        {/* Date Selector Sub-Modal - Outside popup parent for full-screen coverage */}
        <DateSelectorModal
            isOpen={showDateModal}
            onClose={() => setShowDateModal(false)}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            availableDates={getAvailableDates()}
            setShowDateError={setShowDateError}
        />

        {/* Cart Conflict Modal - Shows when trying to add incompatible items */}
        <CartConflictModal
            isOpen={showConflictModal}
            onClose={closeConflictModal}
            onClearAndAdd={() => {
                const success = clearAndAddPending();
                if (success) {
                    // Close the reservation popup and redirect to checkout
                    handleModal(false);
                    router.push('/checkout');
                }
            }}
            conflictInfo={conflictInfo}
        />
        </>
    );
};