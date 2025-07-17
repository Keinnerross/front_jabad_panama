'use client'
import React from "react";
import { FaTimes, FaTrash, FaShoppingCart } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useCart } from "@/app/context/CartContext";
export const CartPopup = ({ isOpen = false, handleModal }) => {
    const router = useRouter();
    const { cartItems, total, removeFromCart, clearCart } = useCart();
    const [showClearConfirmation, setShowClearConfirmation] = React.useState(false);
    const [isClient, setIsClient] = React.useState(false);
    const [removingItemIndex, setRemovingItemIndex] = React.useState(null);
    const [isClearingCart, setIsClearingCart] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const goToCheckout = () => {
        router.push('/checkout');
        // El modal se cerrará automáticamente cuando la página de checkout cargue
        setTimeout(() => {
            handleModal(false);
        }, 100);
    };
    
    const handleClearCart = async () => {
        if (showClearConfirmation) {
            setIsClearingCart(true);
            
            // Simular un pequeño delay para mostrar el loader
            await new Promise(resolve => setTimeout(resolve, 800));
            
            clearCart();
            setShowClearConfirmation(false);
            setIsClearingCart(false);
        } else {
            setShowClearConfirmation(true);
        }
    };
    
    const cancelClear = () => {
        setShowClearConfirmation(false);
    };
    
    const handleRemoveItem = async (index) => {
        setRemovingItemIndex(index);
        
        // Simular un pequeño delay para mostrar el loader
        await new Promise(resolve => setTimeout(resolve, 500));
        
        removeFromCart(index);
        setRemovingItemIndex(null);
    };

    return (
        <div
            className={`w-full h-full flex justify-center items-center p-4 fixed top-0 left-0 z-50 transition-all duration-300 ${
                isOpen 
                    ? 'bg-black/50 backdrop-blur-sm opacity-100' 
                    : 'bg-black/0 backdrop-blur-none opacity-0 pointer-events-none'
            }`}
            onClick={() => handleModal(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-full max-w-lg mx-auto bg-white rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col transition-all duration-300 transform ${
                    isOpen 
                        ? 'scale-100 opacity-100 translate-y-0' 
                        : 'scale-95 opacity-0 translate-y-4'
                }`}
            >
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-4 sm:p-6 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Your Cart</h2>
                    <button 
                        onClick={() => handleModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
                    >
                        <FaTimes size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto max-h-[50vh] md:max-h-96">
                    {!isClient ? (
                        <div className="p-6 sm:p-8 text-center text-gray-500">
                            <FaShoppingCart size={32} className="mx-auto mb-4 text-gray-300 sm:w-10 sm:h-10" />
                            <p className="text-sm sm:text-base">Loading cart...</p>
                        </div>
                    ) : cartItems.length > 0 ? (
                        <div className="p-4 sm:p-6 space-y-3">
                            {cartItems.map((item, index) => (
                                <div key={index} className={`flex items-start gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-100 rounded-lg transition-all duration-300 ${
                                    removingItemIndex === index ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                                }`}>
                                    {/* Item Badge */}
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-bold flex-shrink-0">
                                        {item.quantity}
                                    </div>
                                    
                                    {/* Item Details */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-800 truncate text-sm sm:text-base">{item.meal}</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">{item.priceType}</p>
                                        <p className="text-gray-500 text-xs hidden sm:block">
                                            Duration: {item.shabbatName}
                                        </p>
                                    </div>
                                    
                                    {/* Price and Remove */}
                                    <div className="flex flex-col items-end gap-1 sm:gap-2 flex-shrink-0">
                                        <span className="font-bold text-gray-800 text-sm sm:text-base">${item.totalPrice.toFixed(2)} USD</span>
                                        <button
                                            onClick={() => handleRemoveItem(index)}
                                            disabled={removingItemIndex === index}
                                            className={`text-xs sm:text-sm cursor-pointer transition-colors duration-200 flex items-center gap-1 ${
                                                removingItemIndex === index 
                                                    ? 'text-gray-300 cursor-not-allowed' 
                                                    : 'text-gray-400 hover:text-primary'
                                            }`}
                                        >
                                            {removingItemIndex === index ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-300 border-t-primary"></div>
                                                    <span>Removing...</span>
                                                </>
                                            ) : (
                                                'Remove'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : isClearingCart ? (
                        <div className="p-6 sm:p-8 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-primary mx-auto mb-4"></div>
                            <p className="text-sm sm:text-base">Clearing cart...</p>
                        </div>
                    ) : (
                        <div className="p-6 sm:p-8 text-center text-gray-500">
                            <FaShoppingCart size={32} className="mx-auto mb-4 text-gray-300 sm:w-10 sm:h-10" />
                            <p className="text-sm sm:text-base">Your cart is empty</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {isClient && cartItems.length > 0 && (
                    <div className="p-4 sm:p-6 border-t border-gray-100 bg-white flex-shrink-0">
                        {/* Total */}
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <span className="text-base sm:text-lg font-medium text-gray-600">Subtotal</span>
                            <span className="text-lg sm:text-xl font-bold text-gray-800">${total.toFixed(2)} USD</span>
                        </div>

                        {/* Confirmation Dialog */}
                        {showClearConfirmation && (
                            <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-800 font-medium mb-3 text-sm sm:text-base">Are you sure you want to empty your cart?</p>
                                <div className="flex gap-2 flex-col sm:flex-row">
                                    <button
                                        onClick={handleClearCart}
                                        disabled={isClearingCart}
                                        className={`px-4 py-2 text-white text-sm rounded transition-colors duration-200 flex-1 sm:flex-none flex items-center justify-center gap-2 ${
                                            isClearingCart 
                                                ? 'bg-primary/70 cursor-not-allowed' 
                                                : 'bg-primary hover:bg-primary/80 cursor-pointer'
                                        }`}
                                    >
                                        {isClearingCart ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                <span>Clearing...</span>
                                            </>
                                        ) : (
                                            'Yes, empty'
                                        )}
                                    </button>
                                    <button
                                        onClick={cancelClear}
                                        disabled={isClearingCart}
                                        className={`px-4 py-2 text-gray-700 text-sm rounded transition-colors duration-200 flex-1 sm:flex-none ${
                                            isClearingCart 
                                                ? 'bg-gray-100 cursor-not-allowed opacity-50' 
                                                : 'bg-gray-200 hover:bg-gray-300 cursor-pointer'
                                        }`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={goToCheckout}
                                className="w-full bg-primary text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium text-base sm:text-lg cursor-pointer"
                            >
                                Continue to Checkout
                            </button>
                            {!showClearConfirmation && (
                                <button
                                    onClick={handleClearCart}
                                    className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium text-sm cursor-pointer"
                                >
                                    Empty cart
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};