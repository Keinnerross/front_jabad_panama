'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";

export const PopupShabbatBox = ({ isOpen = false, handleModal, shabbatBoxOptions = [], shabbatAndHolidays = [] }) => {
    const router = useRouter();
    const [selectedShabbat, setSelectedShabbat] = useState(null);
    const [activeTab, setActiveTab] = useState("FRIDAY NIGHT DINNER");
    const [quantities, setQuantities] = useState({});
    const [additionalGuests, setAdditionalGuests] = useState({});
    const [total, setTotal] = useState(0);
    const { addToCart: addToCartContext } = useCart();

    // Inicializar el primer Shabbat disponible
    useEffect(() => {
        if (shabbatAndHolidays.length > 0 && !selectedShabbat) {
            const today = new Date();
            const upcomingShabbats = shabbatAndHolidays
                .filter(shabbat => new Date(shabbat.startDate) >= today)
                .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
            
            if (upcomingShabbats.length > 0) {
                setSelectedShabbat(upcomingShabbats[0]);
            }
        }
    }, [shabbatAndHolidays, selectedShabbat]);

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
                    
                    if (option) {
                        const basePrice = option.basePrice * quantity;
                        const guestPrice = (additionalGuests[optionId] || 0) * (option.additionalGuestPrice || 0);
                        newTotal += basePrice + guestPrice;
                    }
                }
            }
        });
        
        setTotal(newTotal);
    }, [quantities, additionalGuests, shabbatBoxOptions]);

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

    const addToCart = () => {
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
                            shabbatDate: selectedShabbat?.date,
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
                            shabbatDate: selectedShabbat?.date,
                            productType: 'shabbatBox'
                        });
                    }
                }
            }
        });
        
        if (cartItems.length > 0) {
            addToCartContext(cartItems);
            handleModal(false);
            router.push('/checkout');
        }
    };

    if (!isOpen) return null;

    const tabs = ["FRIDAY NIGHT DINNER", "SHABBAT LUNCH", "MORE OPTIONS"];
    const currentCategory = shabbatBoxOptions.find(cat => cat.category === activeTab);

    return (
        <div
            className="w-full h-full bg-black/50 flex justify-center items-center p-4 sm:p-6 lg:p-8 fixed top-0 backdrop-blur-xs z-50"
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl flex flex-col lg:flex-row rounded-xl overflow-hidden h-fit max-h-[90vh] relative"
            >
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-gradient-to-br from-orange-100 to-yellow-50 relative">
                    <div className="w-full h-full object-cover flex items-center justify-center">
                        <div className="text-center p-8">
                            <h3 className="text-2xl font-bold text-gray-700 mb-2">Shabbat Box</h3>
                            <p className="text-gray-600">Traditional Shabbat meals delivered to you</p>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 bg-white flex flex-col max-h-[90vh]">
                    {/* Scrollable content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 pb-32">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-4">
                                Order for Shabbat:
                            </h2>
                            
                            {/* Shabbat Selector */}
                            <div className="mb-6">
                                <select 
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-700"
                                    value={selectedShabbat ? shabbatAndHolidays.indexOf(selectedShabbat) : ''}
                                    onChange={(e) => setSelectedShabbat(shabbatAndHolidays[e.target.value])}
                                >
                                    {shabbatAndHolidays
                                        .filter(shabbat => new Date(shabbat.startDate) >= new Date())
                                        .map((shabbat, index) => (
                                            <option key={index} value={shabbatAndHolidays.indexOf(shabbat)}>
                                                {shabbat.name} ({shabbat.startDate && shabbat.endDate 
                                                    ? `${new Date(shabbat.startDate).toLocaleDateString('en-GB')} - ${new Date(shabbat.endDate).toLocaleDateString('en-GB')}`
                                                    : shabbat.date})
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleModal(false)}
                            className="text-gray-400 hover:text-gray-600 ml-4"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                                    activeTab === tab
                                        ? 'text-primary border-b-2 border-primary'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Options */}
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
                                        <ul className="text-sm text-gray-600 space-y-1">
                                            {option.includes.map((item, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-primary mr-2">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {option.variants ? (
                                    // Render variants (like Cholent sizes)
                                    <div className="space-y-3">
                                        {option.variants.map((variant, variantIndex) => {
                                            const variantKey = `${option.id}-variant-${variantIndex}`;
                                            return (
                                                <div key={variantIndex} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                    <div>
                                                        <span className="font-medium">{variant.size}</span>
                                                        <span className="text-gray-600 text-sm ml-2">({variant.serves})</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-darkBlue">${variant.price.toFixed(2)}</span>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => updateQuantity(variantKey, -1)}
                                                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                            >
                                                                <FaMinus className="text-gray-text text-xs" />
                                                            </button>
                                                            <span className="w-8 text-center text-darkBlue font-bold">
                                                                {quantities[variantKey] || 0}
                                                            </span>
                                                            <button 
                                                                onClick={() => updateQuantity(variantKey, 1)}
                                                                className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="text-gray-600">({option.servingSize})</span>
                                                <span className="font-bold text-darkBlue ml-4">${option.basePrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => updateQuantity(option.id.toString(), -1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    <FaMinus className="text-gray-text text-xs" />
                                                </button>
                                                <span className="w-8 text-center text-darkBlue font-bold">
                                                    {quantities[option.id] || 0}
                                                </span>
                                                <button 
                                                    onClick={() => updateQuantity(option.id.toString(), 1)}
                                                    className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                >
                                                    <FaPlus className="text-gray-text text-xs" />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Additional guests for eligible options - Always visible */}
                                        {option.additionalGuestPrice && (
                                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                                <span className="text-gray-600">Additional guests (+${option.additionalGuestPrice.toFixed(2)} each)</span>
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => updateAdditionalGuests(option.id, -1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                    >
                                                        <FaMinus className="text-gray-text text-xs" />
                                                    </button>
                                                    <span className="w-8 text-center text-darkBlue font-bold">
                                                        {additionalGuests[option.id] || 0}
                                                    </span>
                                                    <button 
                                                        onClick={() => updateAdditionalGuests(option.id, 1)}
                                                        className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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
                    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-darkBlue font-bold text-lg">Total:</span>
                            <span className="text-darkBlue font-bold text-xl">${total.toFixed(2)}</span>
                        </div>

                        <button 
                            onClick={addToCart}
                            disabled={total === 0}
                            className={`w-full font-bold py-4 rounded-lg transition flex justify-between px-6 items-center ${
                                total > 0 
                                    ? 'bg-primary text-white hover:bg-opacity-90' 
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <span>Add to cart and continue</span>
                            <span>${total.toFixed(2)}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};