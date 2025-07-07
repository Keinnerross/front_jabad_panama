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
    const [cartItems, setCartItems] = useState([]);
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

    const addToCart = (newItems) => {
        try {
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
            
        } catch (error) {
            showError('Failed to add items to cart. Please try again.');
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

    const clearCart = () => {
        try {
            localStorage.removeItem('shabbatCart');
            setCartItems([]);
            setTotal(0);
            setItemCount(0);
            showSuccess('Cart cleared successfully');
        } catch (error) {
            showError('Failed to clear cart. Please try again.');
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