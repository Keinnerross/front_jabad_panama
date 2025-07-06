'use client'
import React from "react";
import { FaTimes, FaTrash, FaShoppingCart } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useCart } from "@/app/context/CartContext";
export const CartPopup = ({ isOpen = false, handleModal }) => {
    const router = useRouter();
    const { cartItems, total, removeFromCart, clearCart } = useCart();

    const goToCheckout = () => {
        handleModal(false);
        router.push('/checkout');
    };

    return (
        <div
            className={`w-full h-full bg-black/50 flex justify-center items-center p-4 fixed top-0 left-0 z-50 backdrop-blur-sm ${!isOpen && "hidden"}`}
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="bg-primary text-white p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaShoppingCart size={20} />
                        <h2 className="text-xl font-bold">Your Cart</h2>
                    </div>
                    <button 
                        onClick={() => handleModal(false)}
                        className="text-white hover:text-gray-200 transition"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="max-h-96 overflow-y-auto">
                    {cartItems.length > 0 ? (
                        <div className="p-6 space-y-4">
                            {cartItems.map((item, index) => (
                                <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-darkBlue">{item.meal}</h3>
                                        <p className="text-gray-600 text-sm">{item.priceType}</p>
                                        <p className="text-gray-500 text-sm">
                                            {item.shabbatName} - {item.shabbatDate}
                                        </p>
                                        {item.productType && (
                                            <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs mt-1">
                                                {item.productType === 'shabbatBox' ? 'Shabbat Box' : 'Meal Reservation'}
                                            </span>
                                        )}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                                            <span className="text-sm text-gray-600">× ${item.unitPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="font-bold text-darkBlue">${item.totalPrice.toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(index)}
                                            className="text-red-500 hover:text-red-700 transition"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            <FaShoppingCart size={40} className="mx-auto mb-4 text-gray-300" />
                            <p>Your cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-200 bg-gray-50">
                        {/* Total */}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-bold text-darkBlue">Total:</span>
                            <span className="text-xl font-bold text-darkBlue">${total.toFixed(2)}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={clearCart}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Clear Cart
                            </button>
                            <button
                                onClick={goToCheckout}
                                className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-opacity-90 transition font-medium"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};