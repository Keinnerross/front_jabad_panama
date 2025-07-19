'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import ReactMarkdown from 'react-markdown';
import { formatShabbatDate } from "@/app/utils/formatShabbatDate";
import { getAssetPath } from "@/app/utils/assetPath";

export const PopupShabbatBox = ({ isOpen = false, handleModal, shabbatBoxOptions = [], shabbatAndHolidays = [], shabbatBoxSingleData = {} }) => {
    // console.log('PopupShabbatBox - shabbatBoxOptions:', shabbatBoxOptions);
    // console.log('PopupShabbatBox - shabbatAndHolidays:', shabbatAndHolidays);
    
    // Handle popup image - use picture_popup if available, fallback to picture, then default
    const getPopupImageUrl = () => {
        if (shabbatBoxSingleData?.picture_popup?.url) {
            return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${shabbatBoxSingleData.picture_popup.url}`;
        }
        if (shabbatBoxSingleData?.picture?.url) {
            return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${shabbatBoxSingleData.picture.url}`;
        }
        return getAssetPath("/assets/pictures/shabbat-meals/shabbatbox-single.png");
    };
    
    const popupImageUrl = getPopupImageUrl();
    const router = useRouter();
    const [selectedShabbat, setSelectedShabbat] = useState(null);
    const [activeTab, setActiveTab] = useState("");
    const [quantities, setQuantities] = useState({});
    const [additionalGuests, setAdditionalGuests] = useState({});
    const [total, setTotal] = useState(0);
    const [showDateError, setShowDateError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { addToCart: addToCartContext } = useCart();
    const scrollContainerRef = useRef(null);

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

    // No inicializar automáticamente el primer Shabbat - campo obligatorio
    // useEffect(() => {
    //     if (shabbatAndHolidays.length > 0 && !selectedShabbat) {
    //         const today = new Date();
    //         const upcomingShabbats = shabbatAndHolidays
    //             .filter(shabbat => new Date(shabbat.startDate) >= today)
    //             .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    //         
    //         if (upcomingShabbats.length > 0) {
    //             setSelectedShabbat(upcomingShabbats[0]);
    //         }
    //     }
    // }, [shabbatAndHolidays, selectedShabbat]);

    // Inicializar cantidades cuando se abre el popup
    useEffect(() => {
        if (isOpen && shabbatBoxOptions.length > 0) {
            const initialQuantities = {};
            const initialGuests = {};

            shabbatBoxOptions.forEach(category => {
                category.options.forEach(option => {
                    initialQuantities[option.id] = 0;
                    if (option.additionalGuestPrice) {
                        initialGuests[option.id] = 0;
                    }
                    if (option.variants) {
                        option.variants.forEach((variant, variantIndex) => {
                            initialQuantities[`${option.id}-variant-${variantIndex}`] = 0;
                        });
                    }
                });
            });

            setQuantities(initialQuantities);
            setAdditionalGuests(initialGuests);
        }
    }, [isOpen, shabbatBoxOptions]);

    // Calcular total
    useEffect(() => {
        let newTotal = 0;

        Object.keys(quantities).forEach(key => {
            const quantity = quantities[key];
            if (quantity > 0) {
                if (key.includes('-variant-')) {
                    // Manejar variantes (como Cholent)
                    const [optionId, , variantIndex] = key.split('-');
                    const option = shabbatBoxOptions
                        .flatMap(cat => cat.options)
                        .find(opt => opt.id === parseInt(optionId));

                    if (option && option.variants) {
                        const variant = option.variants[parseInt(variantIndex)];
                        newTotal += quantity * variant.price;
                    }
                } else {
                    // Opciones regulares
                    const optionId = parseInt(key);
                    const option = shabbatBoxOptions
                        .flatMap(cat => cat.options)
                        .find(opt => opt.id === optionId);

                    if (option && option.basePrice) {
                        const basePrice = option.basePrice * quantity;
                        const guestPrice = (additionalGuests[optionId] || 0) * (option.additionalGuestPrice || 0);
                        newTotal += basePrice + guestPrice;
                    }
                }
            }
        });

        setTotal(newTotal);
    }, [quantities, additionalGuests, shabbatBoxOptions]);

    // Set first tab as active when data loads
    useEffect(() => {
        if (shabbatBoxOptions.length > 0 && !activeTab) {
            setActiveTab(shabbatBoxOptions[0].category);
        }
    }, [shabbatBoxOptions, activeTab]);

    // Auto-scroll to top when tab changes
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo(0, 0);
        }
    }, [activeTab]);

    const updateQuantity = (key, change) => {
        setQuantities(prev => ({
            ...prev,
            [key]: Math.max(0, (prev[key] || 0) + change)
        }));
    };

    const updateAdditionalGuests = (optionId, change) => {
        setAdditionalGuests(prev => ({
            ...prev,
            [optionId]: Math.max(0, (prev[optionId] || 0) + change)
        }));
    };

    const addToCart = async () => {
        // Validar que se haya seleccionado un Shabbat
        if (!selectedShabbat) {
            setShowDateError(true);
            return;
        }

        setShowDateError(false);
        setIsLoading(true);
        
        const cartItems = [];

        Object.keys(quantities).forEach(key => {
            const quantity = quantities[key];
            if (quantity > 0) {
                if (key.includes('-variant-')) {
                    // Manejar variantes
                    const [optionId, , variantIndex] = key.split('-');
                    const option = shabbatBoxOptions
                        .flatMap(cat => cat.options)
                        .find(opt => opt.id === parseInt(optionId));

                    if (option && option.variants) {
                        const variant = option.variants[parseInt(variantIndex)];
                        cartItems.push({
                            meal: `${option.name} - ${variant.size}`,
                            priceType: `${variant.serves}`,
                            quantity: quantity,
                            unitPrice: variant.price,
                            totalPrice: quantity * variant.price,
                            shabbatName: selectedShabbat?.name,
                            shabbatDate: formatShabbatDate(selectedShabbat),
                            productType: 'shabbatBox'
                        });
                    }
                } else {
                    // Opciones regulares
                    const optionId = parseInt(key);
                    const option = shabbatBoxOptions
                        .flatMap(cat => cat.options)
                        .find(opt => opt.id === optionId);

                    if (option) {
                        const basePrice = option.basePrice;
                        const guestCount = additionalGuests[optionId] || 0;
                        const guestPrice = guestCount * (option.additionalGuestPrice || 0);
                        const totalPrice = (basePrice + guestPrice) * quantity;

                        let priceType = option.servingSize || 'Standard';
                        if (guestCount > 0) {
                            priceType += ` + ${guestCount} additional guests`;
                        }

                        cartItems.push({
                            meal: option.name,
                            priceType: priceType,
                            quantity: quantity,
                            unitPrice: basePrice + guestPrice,
                            totalPrice: totalPrice,
                            shabbatName: selectedShabbat?.name,
                            shabbatDate: formatShabbatDate(selectedShabbat),
                            productType: 'shabbatBox'
                        });
                    }
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


    // Generate tabs dynamically from API data
    const tabs = (Array.isArray(shabbatBoxOptions) ? shabbatBoxOptions : []).map(cat => cat.category);
    const currentCategory = (Array.isArray(shabbatBoxOptions) ? shabbatBoxOptions : []).find(cat => cat.category === activeTab);

    return (
        <div
            className={`w-full h-full flex justify-center items-center p-4 sm:p-6 lg:p-8 fixed top-0 z-50 overflow-y-hidden transition-all duration-300 ${
                isOpen 
                    ? 'bg-black/50 backdrop-blur-sm opacity-100' 
                    : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
            }`}
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-5xl flex flex-col lg:flex-row rounded-xl overflow-hidden bg-white shadow-2xl transition-all duration-300 transform ${
                    isOpen 
                        ? 'scale-100 opacity-100 translate-y-0' 
                        : 'scale-95 opacity-0 translate-y-4'
                }`}
            >
                {/* Image Section */}
                <div className="w-full lg:w-[45%] h-full lg:h-auto relative overflow-hidden">
                    <Image src={popupImageUrl} alt="reservation for shabbat" fill className="w-full h-full object-cover" />

                </div>

                {/* Form Section */}
                <div className="w-full lg:w-[55%] bg-white flex flex-col max-h-[90vh] sm:max-h-[95vh] lg:max-h-[80vh]">
                    {/* Fixed Header */}
                    <div className="p-4 sm:p-6 md:p-8 pb-4 md:border-b border-gray-100">
                        <div className="mb-4">
                            <div className="flex items-start justify-between">
                                <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-4">
                                    Order for Shabbat:
                                </h2>

                                <button
                                    onClick={() => handleModal(false)}
                                    className="text-gray-400 hover:text-gray-600 ml-4 cursor-pointer"
                                >
                                    <FaTimes size={20} />
                                </button>
                                {/* Shabbat Selector */}

                            </div>
                            <div className="md:mb-6 ">
                                <select
                                    className={`w-full p-3 border rounded-lg text-gray-700 cursor-pointer ${showDateError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                    value={selectedShabbat ? shabbatAndHolidays.indexOf(selectedShabbat) : ''}
                                    onChange={(e) => {
                                        setSelectedShabbat(shabbatAndHolidays[e.target.value]);
                                        setShowDateError(false);
                                    }}
                                >
                                    <option value="">Select a Shabbat or Holiday</option>
                                    {(Array.isArray(shabbatAndHolidays) ? shabbatAndHolidays : [])
                                        .filter(shabbat => new Date(shabbat.startDate) >= new Date())
                                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                                        .map((shabbat, index) => (
                                            <option key={index} value={shabbatAndHolidays.indexOf(shabbat)}>
                                                {shabbat.name} ({formatShabbatDate(shabbat)})
                                            </option>
                                        ))}
                                </select>
                                {showDateError && (
                                    <p className="text-red-500 text-sm mt-1">Please select a Shabbat or Holiday to continue</p>
                                )}
                            </div>

                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer flex-shrink-0 ${activeTab === tab
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Options */}
                    <div ref={scrollContainerRef} className="flex-1 p-4 sm:p-6 md:p-8 pt-4 overflow-y-auto">
                        <div className="space-y-6">
                            {currentCategory?.options.map((option) => (
                                <div key={option.id} className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-darkBlue mb-2">
                                        {option.name}
                                    </h3>

                                    {option.description && (
                                        <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                                    )}

                                    {option.includes && (
                                        <div className="mb-4">
                                            <p className="font-medium text-gray-700 mb-2">Includes:</p>
                                            <div className="text-sm text-gray-600">
                                                <ReactMarkdown 
                                                    components={{
                                                        p: ({children}) => <p className="mb-2">{children}</p>,
                                                        ul: ({children}) => <ul className="list-disc ml-4 space-y-1">{children}</ul>,
                                                        ol: ({children}) => <ol className="list-decimal ml-4 space-y-1">{children}</ol>,
                                                        li: ({children}) => <li className="mb-1">{children}</li>,
                                                        strong: ({children}) => <strong className="font-semibold text-gray-700">{children}</strong>
                                                    }}
                                                >
                                                    {option.includes}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    )}

                                    {option.variants && option.variants.length > 0 ? (
                                        // Render variants (like Cholent sizes)
                                        <div className="space-y-3">
                                            {option.variants.map((variant, variantIndex) => {
                                                const variantKey = `${option.id}-variant-${variantIndex}`;
                                                return (
                                                    <div key={variantIndex} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-3 rounded gap-3">
                                                        <div className="flex-1">
                                                            <span className="font-medium text-sm sm:text-base">{variant.size}</span>
                                                            <span className="text-gray-600 text-xs sm:text-sm ml-2">({variant.serves})</span>
                                                        </div>
                                                        <div className="flex items-center justify-between sm:gap-3">
                                                            <span className="font-bold text-darkBlue text-sm sm:text-base">${variant.price.toFixed(2)}</span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => updateQuantity(variantKey, -1)}
                                                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                                                >
                                                                    <FaMinus className="text-gray-text text-xs" />
                                                                </button>

                                                                <span className="w-6 sm:w-8 text-center text-darkBlue font-bold text-sm">
                                                                    {quantities[variantKey] || 0}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(variantKey, 1)}
                                                                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                                                >
                                                                    <FaPlus className="text-gray-text text-xs" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        // Render regular option
                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                                <div className="flex-1">
                                                    {option.servingSize && (
                                                        <span className="text-gray-600 text-sm">({option.servingSize})</span>
                                                    )}
                                                    {option.basePrice && (
                                                        <span className="font-bold text-darkBlue ml-0 sm:ml-4 block sm:inline text-sm sm:text-base">${option.basePrice.toFixed(2)}</span>
                                                    )}
                                                    {option.details && (
                                                        <span className="text-gray-600 ml-0 sm:ml-4 block sm:inline text-sm">{option.details}</span>
                                                    )}
                                                    {option.description && !option.basePrice && (
                                                        <span className="text-gray-600 text-sm">{option.description}</span>
                                                    )}
                                                </div>
                                                {option.basePrice && (
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <button
                                                            onClick={() => updateQuantity(option.id.toString(), -1)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <FaMinus className="text-gray-text text-xs" />
                                                        </button>
                                                        <span className="w-6 sm:w-8 text-center text-darkBlue font-bold text-sm">
                                                            {quantities[option.id] || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(option.id.toString(), 1)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <FaPlus className="text-gray-text text-xs" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Additional guests for eligible options - Only for options with base price */}
                                            {option.additionalGuestPrice && option.basePrice && (
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 p-3 rounded gap-3">
                                                    <span className="text-gray-600 text-sm sm:text-base">Additional guests (+${option.additionalGuestPrice.toFixed(2)} each)</span>
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <button
                                                            onClick={() => updateAdditionalGuests(option.id, -1)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <FaMinus className="text-gray-text text-xs" />
                                                        </button>
                                                        <span className="w-6 sm:w-8 text-center text-darkBlue font-bold text-sm">
                                                            {additionalGuests[option.id] || 0}
                                                        </span>
                                                        <button
                                                            onClick={() => updateAdditionalGuests(option.id, 1)}
                                                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                                                        >
                                                            <FaPlus className="text-gray-text text-xs" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fixed Total and Add to Cart */}
                    <div className="bg-white border-t border-gray-200 p-4 sm:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-darkBlue font-bold text-lg">Total:</span>
                            <span className="text-darkBlue font-bold text-xl">${total.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={addToCart}
                            disabled={total === 0 || isLoading}
                            className={`w-full font-bold py-3 sm:py-4 rounded-lg transition flex justify-between px-4 sm:px-6 items-center ${total > 0 && !isLoading
                                ? 'bg-primary text-white hover:bg-opacity-90 cursor-pointer'
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
                                    <span>${total.toFixed(2)}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};