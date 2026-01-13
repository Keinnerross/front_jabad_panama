'use client'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Ensure cartItems is always an array, even during SSR
        if (typeof window === 'undefined') return [];
        try {
            const saved = localStorage.getItem('shabbatCart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    const [total, setTotal] = useState(0);
    const [itemCount, setItemCount] = useState(0);
    const { showSuccess, showError } = useNotification();

    // Cargar carrito desde localStorage al inicializar
    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = () => {
        try {
            const savedCart = JSON.parse(localStorage.getItem('shabbatCart') || '[]');
            setCartItems(savedCart);
            
            const totalAmount = savedCart.reduce((sum, item) => sum + item.totalPrice, 0);
            setTotal(totalAmount);
            
            const totalItems = savedCart.reduce((sum, item) => sum + item.quantity, 0);
            setItemCount(totalItems);
        } catch (error) {
            // Handle cart loading error gracefully
            setCartItems([]);
            setTotal(0);
            setItemCount(0);
        }
    };

    // Validar si se pueden agregar items al carrito
    const canAddToCart = (newItems) => {
        if (!cartItems || cartItems.length === 0) return { allowed: true };
        
        const existingType = cartItems[0].productType;
        const newType = newItems[0].productType;
        
        // No mezclar tipos diferentes
        if (existingType !== newType) {
            return { 
                allowed: false, 
                message: 'Please complete or clear your current cart before adding different items'
            };
        }
        
        // Para mealReservation: verificar mismo Shabbat Y misma fecha
        if (existingType === 'mealReservation') {
            if (cartItems[0].shabbatName !== newItems[0].shabbatName) {
                return { 
                    allowed: false, 
                    message: `You have items from ${cartItems[0].shabbatName} in your cart`
                };
            }
            // Verificar que las fechas coincidan
            if (cartItems[0].shabbatDate && newItems[0].shabbatDate && 
                cartItems[0].shabbatDate !== newItems[0].shabbatDate) {
                return { 
                    allowed: false, 
                    message: `You have items for ${cartItems[0].shabbatDate} in your cart. Please complete or clear your cart before adding items for a different date.`
                };
            }
        }
        
        // Para customEvent: verificar mismo evento Y misma fecha
        if (existingType === 'customEvent') {
            const existingEvent = cartItems[0].shabbatName; // Los custom events usan shabbatName
            const newEvent = newItems[0].shabbatName;
            if (existingEvent !== newEvent) {
                return { 
                    allowed: false, 
                    message: `You have items from ${existingEvent} in your cart`
                };
            }
            // Verificar que las fechas del evento coincidan
            const existingDate = cartItems[0].eventDate || cartItems[0].shabbatDate;
            const newDate = newItems[0].eventDate || newItems[0].shabbatDate;
            if (existingDate && newDate && existingDate !== newDate) {
                return { 
                    allowed: false, 
                    message: `You have items for ${existingDate} in your cart. Please complete or clear your cart before adding items for a different date.`
                };
            }
        }
        
        // Para shabbatBox: verificar mismo Shabbat Y misma fecha de entrega
        if (existingType === 'shabbatBox') {
            // Verificar mismo Shabbat/Parashá
            if (cartItems[0].shabbatName && newItems[0].shabbatName && 
                cartItems[0].shabbatName !== newItems[0].shabbatName) {
                return { 
                    allowed: false, 
                    message: `You have items from ${cartItems[0].shabbatName} in your cart`
                };
            }
            // Verificar misma fecha de entrega
            const existingDelivery = cartItems[0].deliveryDate || cartItems[0].shabbatDate;
            const newDelivery = newItems[0].deliveryDate || newItems[0].shabbatDate;
            if (existingDelivery && newDelivery && existingDelivery !== newDelivery) {
                return { 
                    allowed: false, 
                    message: `You have Shabbat Box items for delivery on ${existingDelivery} in your cart. Please complete or clear your cart before adding items for a different delivery date.`
                };
            }
        }
        
        return { allowed: true };
    };

    const addToCart = (newItems) => {
        try {
            // Validar antes de agregar
            const validation = canAddToCart(newItems);
            if (!validation.allowed) {
                showError(validation.message);
                return false;
            }

            const existingCart = JSON.parse(localStorage.getItem('shabbatCart') || '[]');
            const updatedCart = [...existingCart, ...newItems];
            localStorage.setItem('shabbatCart', JSON.stringify(updatedCart));
            
            // Actualizar estado inmediatamente
            setCartItems(updatedCart);
            
            const totalAmount = updatedCart.reduce((sum, item) => sum + item.totalPrice, 0);
            setTotal(totalAmount);
            
            const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
            setItemCount(totalItems);
            
            // Mostrar notificación de éxito
            const itemsCount = newItems.length;
            const message = itemsCount === 1 
                ? `${newItems[0].meal} added to cart`
                : `${itemsCount} items added to cart`;
            showSuccess(message);
            
            return true;
        } catch (error) {
            showError('Failed to add items to cart. Please try again.');
            return false;
        }
    };

    const removeFromCart = (index) => {
        try {
            const itemToRemove = cartItems[index];
            const updatedCart = cartItems.filter((_, i) => i !== index);
            localStorage.setItem('shabbatCart', JSON.stringify(updatedCart));
            
            // Actualizar estado inmediatamente
            setCartItems(updatedCart);
            
            const totalAmount = updatedCart.reduce((sum, item) => sum + item.totalPrice, 0);
            setTotal(totalAmount);
            
            const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
            setItemCount(totalItems);
            
            // Mostrar notificación
            if (itemToRemove) {
                showSuccess(`${itemToRemove.meal} removed from cart`);
            }
        } catch (error) {
            showError('Failed to remove item from cart. Please try again.');
        }
    };

    const clearCart = (silent = false) => {
        try {
            localStorage.removeItem('shabbatCart');
            setCartItems([]);
            setTotal(0);
            setItemCount(0);
            if (!silent) {
                showSuccess('Cart cleared successfully');
            }
        } catch (error) {
            if (!silent) {
                showError('Failed to clear cart. Please try again.');
            }
        }
    };

    const updateCart = () => {
        loadCartItems();
    };

    const value = {
        cartItems,
        total,
        itemCount,
        addToCart,
        removeFromCart,
        clearCart,
        updateCart
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};