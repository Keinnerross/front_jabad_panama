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

    // Conflict modal states
    const [showConflictModal, setShowConflictModal] = useState(false);
    const [pendingItems, setPendingItems] = useState(null);
    const [conflictInfo, setConflictInfo] = useState(null);

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
                message: 'Please complete or clear your current cart before adding different items',
                conflictInfo: {
                    typeMismatch: true,
                    existingType,
                    newType,
                    existingEvent: cartItems[0].shabbatName,
                    newEvent: newItems[0].shabbatName
                }
            };
        }

        // Para mealReservation: verificar mismo Shabbat Y misma fecha
        if (existingType === 'mealReservation') {
            if (cartItems[0].shabbatName !== newItems[0].shabbatName) {
                return {
                    allowed: false,
                    message: `You have items from ${cartItems[0].shabbatName} in your cart`,
                    conflictInfo: {
                        existingType,
                        existingEvent: cartItems[0].shabbatName,
                        newEvent: newItems[0].shabbatName,
                        existingDate: cartItems[0].shabbatDate,
                        newDate: newItems[0].shabbatDate
                    }
                };
            }
            // Verificar que las fechas coincidan
            if (cartItems[0].shabbatDate && newItems[0].shabbatDate &&
                cartItems[0].shabbatDate !== newItems[0].shabbatDate) {
                return {
                    allowed: false,
                    message: `You have items for ${cartItems[0].shabbatDate} in your cart. Please complete or clear your cart before adding items for a different date.`,
                    conflictInfo: {
                        existingType,
                        existingEvent: cartItems[0].shabbatName,
                        newEvent: newItems[0].shabbatName,
                        existingDate: cartItems[0].shabbatDate,
                        newDate: newItems[0].shabbatDate
                    }
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
                    message: `You have items from ${existingEvent} in your cart`,
                    conflictInfo: {
                        existingType,
                        existingEvent,
                        newEvent,
                        existingDate: cartItems[0].eventDate || cartItems[0].shabbatDate,
                        newDate: newItems[0].eventDate || newItems[0].shabbatDate
                    }
                };
            }
            // Verificar que las fechas del evento coincidan
            const existingDate = cartItems[0].eventDate || cartItems[0].shabbatDate;
            const newDate = newItems[0].eventDate || newItems[0].shabbatDate;
            if (existingDate && newDate && existingDate !== newDate) {
                return {
                    allowed: false,
                    message: `You have items for ${existingDate} in your cart. Please complete or clear your cart before adding items for a different date.`,
                    conflictInfo: {
                        existingType,
                        existingEvent,
                        newEvent,
                        existingDate,
                        newDate
                    }
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
                    message: `You have items from ${cartItems[0].shabbatName} in your cart`,
                    conflictInfo: {
                        existingType,
                        existingEvent: cartItems[0].shabbatName,
                        newEvent: newItems[0].shabbatName,
                        existingDate: cartItems[0].deliveryDate || cartItems[0].shabbatDate,
                        newDate: newItems[0].deliveryDate || newItems[0].shabbatDate
                    }
                };
            }
            // Verificar misma fecha de entrega
            const existingDelivery = cartItems[0].deliveryDate || cartItems[0].shabbatDate;
            const newDelivery = newItems[0].deliveryDate || newItems[0].shabbatDate;
            if (existingDelivery && newDelivery && existingDelivery !== newDelivery) {
                return {
                    allowed: false,
                    message: `You have Shabbat Box items for delivery on ${existingDelivery} in your cart. Please complete or clear your cart before adding items for a different delivery date.`,
                    conflictInfo: {
                        existingType,
                        existingEvent: cartItems[0].shabbatName,
                        newEvent: newItems[0].shabbatName,
                        existingDate: existingDelivery,
                        newDate: newDelivery
                    }
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
                // Instead of showing error, open conflict modal
                setPendingItems(newItems);
                setConflictInfo(validation.conflictInfo);
                setShowConflictModal(true);
                return 'conflict'; // Return 'conflict' to indicate modal is shown
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

    // Clear cart and add pending items (called from conflict modal)
    const clearAndAddPending = () => {
        if (!pendingItems) return false;

        try {
            // Clear cart silently
            localStorage.removeItem('shabbatCart');

            // Add pending items
            localStorage.setItem('shabbatCart', JSON.stringify(pendingItems));

            // Update state
            setCartItems(pendingItems);

            const totalAmount = pendingItems.reduce((sum, item) => sum + item.totalPrice, 0);
            setTotal(totalAmount);

            const totalItems = pendingItems.reduce((sum, item) => sum + item.quantity, 0);
            setItemCount(totalItems);

            // Show success notification
            const itemsCount = pendingItems.length;
            const message = itemsCount === 1
                ? `${pendingItems[0].meal} added to cart`
                : `${itemsCount} items added to cart`;
            showSuccess(message);

            // Close modal and clear pending
            setShowConflictModal(false);
            setPendingItems(null);
            setConflictInfo(null);

            return true;
        } catch (error) {
            showError('Failed to update cart. Please try again.');
            return false;
        }
    };

    // Close conflict modal without action
    const closeConflictModal = () => {
        setShowConflictModal(false);
        setPendingItems(null);
        setConflictInfo(null);
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
        updateCart,
        // Conflict modal
        showConflictModal,
        conflictInfo,
        clearAndAddPending,
        closeConflictModal
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};