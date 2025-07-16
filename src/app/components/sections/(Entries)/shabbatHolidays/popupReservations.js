'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";
import { formatShabbatDate } from "@/app/utils/formatShabbatDate";

export const PopupReservations = ({ isOpen = false, handleModal, selectedMeal, shabbatData, allMeals = [] }) => {
    const router = useRouter();
    const [quantities, setQuantities] = useState({});
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
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
                meal.prices.forEach((price, priceIndex) => {
                    initialQuantities[`${mealIndex}-${priceIndex}`] = 0;
                });
            });
            setQuantities(initialQuantities);
        }
    }, [allMeals]);

    useEffect(() => {
        if (allMeals.length > 0) {
            const newTotal = Object.keys(quantities).reduce((sum, key) => {
                const quantity = quantities[key];
                const [mealIndex, priceIndex] = key.split('-').map(Number);
                const price = parseFloat(allMeals[mealIndex]?.prices[priceIndex]?.price || 0);
                return sum + (quantity * price);
            }, 0);
            setTotal(newTotal);
        }
    }, [quantities, allMeals]);

    const updateQuantity = (key, change) => {
        setQuantities(prev => ({
            ...prev,
            [key]: Math.max(0, (prev[key] || 0) + change)
        }));
    };

    const addToCart = async () => {
        setIsLoading(true);
        
        const cartItems = [];
        Object.keys(quantities).forEach(key => {
            if (quantities[key] > 0) {
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
                className={`w-full max-w-5xl max-h-[90vh] sm:max-h-[90vh] md:max-h-[85vh] lg:max-h-[90vh] flex flex-col lg:flex-row rounded-xl overflow-hidden my-auto shadow-2xl transition-all duration-300 transform ${
                    isOpen 
                        ? 'scale-100 opacity-100 translate-y-0' 
                        : 'scale-95 opacity-0 translate-y-4'
                }`}>
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-40 sm:h-48 md:h-56 lg:h-auto relative flex-shrink-0 hidden md:block">
                    {/* Replace with Next.js Image component */}
                    <Image src="/assets/pictures/shabbat-meals/shabbatbox-single.png" alt="reservation for shabbat" fill className="w-full h-full object-cover" />
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 p-3 sm:p-4 md:p-6 lg:p-8 bg-white flex flex-col min-h-0 flex-1">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                        <div className="flex-1 pr-2">
                            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-darkBlue mb-1 sm:mb-2">
                                Shabbat Meals
                            </h2>
                            <p className="text-gray-text text-sm sm:text-base md:text-lg mb-3 sm:mb-4 md:mb-6">
                                Date: {formatShabbatDate(shabbatData)}<br />
                                Shabbat: {shabbatData?.name}
                            </p>
                        </div>
                        <button
                            onClick={() => handleModal(false)}
                            className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 flex-shrink-0"
                        >
                            <FaTimes size={16} className="sm:w-5 sm:h-5"  />
                        </button>
                    </div>
                    {/* Quantity Selectors */}
                    <div className="space-y-4 sm:space-y-6 md:space-y-8 overflow-y-auto flex-1 min-h-0">
                        {allMeals.map((meal, mealIndex) => (
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
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-4 sm:my-6 flex-shrink-0"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-4 sm:mb-6 flex-shrink-0">
                        <span className="text-darkBlue font-bold text-base sm:text-lg">Total:</span>
                        <span className="text-darkBlue font-bold text-lg sm:text-xl">{total.toFixed(2)} $</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={addToCart}
                        disabled={total === 0 || isLoading}
                        className={`w-full font-bold py-3 sm:py-4 rounded-lg transition flex justify-between px-4 sm:px-6 items-center cursor-pointer flex-shrink-0 touch-manipulation ${total > 0 && !isLoading
                            ? 'bg-primary text-white hover:bg-opacity-90'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center w-full">
                                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-4 border-gray-300 border-t-current mr-2 sm:mr-3"></div>
                                <span className="text-sm sm:text-base">Adding to cart...</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-sm sm:text-base">Add to cart and continue</span>
                                <span className="text-sm sm:text-base">{total.toFixed(2)} $</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};