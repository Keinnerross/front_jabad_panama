'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { FaMinus, FaPlus, FaTimes } from "react-icons/fa";
import { useCart } from "@/app/context/CartContext";

export const PopupReservations = ({ isOpen = false, handleModal, selectedMeal, shabbatData, allMeals = [] }) => {
    const router = useRouter();
    const [quantities, setQuantities] = useState({});
    const [total, setTotal] = useState(0);
    const { addToCart: addToCartContext } = useCart();

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

    const addToCart = () => {
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
                    shabbatDate: shabbatData?.date,
                    productType: 'mealReservation'
                });
            }
        });

        if (cartItems.length > 0) {
            addToCartContext(cartItems);
            handleModal(false);
            router.push('/checkout');
        }
    };

    if (!allMeals || allMeals.length === 0) return null;
    return (
        <div
            className={`w-full h-full bg-black/50 flex justify-center items-center p-4 sm:p-6 lg:p-8 fixed top-0 backdrop-blur-xs ${!isOpen && "hidden"}`}
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation(e)}
                className="w-full max-w-5xl  flex flex-col lg:flex-row rounded-xl overflow-hidden h-fit">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-red-300 relative">
                    {/* Replace with Next.js Image component */}
                    <div className="w-full h-full object-cover bg-red-300" />
                </div>

                {/* Form Section */}
                <div className="w-full lg:w-1/2 p-6 md:p-8 bg-white">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-darkBlue mb-2">
                                Shabbat Meals
                            </h2>
                            <p className="text-gray-text text-lg mb-6">
                                Date: {shabbatData?.startDate && shabbatData?.endDate
                                    ? `${new Date(shabbatData.startDate).toLocaleDateString('en-GB')} - ${new Date(shabbatData.endDate).toLocaleDateString('en-GB')}`
                                    : shabbatData?.date}<br />
                                Shabbat: {shabbatData?.name}
                            </p>
                        </div>
                        <button
                            onClick={() => handleModal(false)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>
                    {/* Quantity Selectors */}
                    <div className="space-y-8">
                        {allMeals.map((meal, mealIndex) => (
                            <div key={mealIndex} className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-darkBlue mb-4">{meal.product}</h3>
                                <div className="space-y-4">
                                    {meal.prices.map((priceOption, priceIndex) => {
                                        const key = `${mealIndex}-${priceIndex}`;
                                        return (
                                            <div key={priceIndex} className="flex items-center justify-between">
                                                <span className="text-gray-text text-lg">{priceOption.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(key, -1)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                    >
                                                        <FaMinus className="text-gray-text" />
                                                    </button>
                                                    <span className="w-10 text-center text-gray-text text-lg">
                                                        {quantities[key] || 0}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(key, 1)}
                                                        className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                                    >
                                                        <FaPlus className="text-gray-text" />
                                                    </button>
                                                    <span className="w-20 text-right text-gray-text text-lg">
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
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Total */}
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-darkBlue font-bold text-lg">Total:</span>
                        <span className="text-darkBlue font-bold text-xl">{total.toFixed(2)} $</span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={addToCart}
                        disabled={total === 0}
                        className={`w-full font-bold py-4 rounded-lg transition flex justify-between px-6 items-center ${total > 0
                                ? 'bg-primary text-white hover:bg-opacity-90'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        <span>Add to cart and continue</span>
                        <span>{total.toFixed(2)} $</span>
                    </button>
                </div>
            </div>
        </div>
    );
};