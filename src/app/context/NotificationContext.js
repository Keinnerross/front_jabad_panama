'use client'
import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Agregar una nueva notificación
    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random(); // ID único
        const newNotification = {
            id,
            type: 'info', // default type
            duration: 5000, // 5 segundos por defecto
            dismissible: true,
            ...notification
        };

        setNotifications(prev => [...prev, newNotification]);

        // El auto-dismiss ahora se maneja en el componente NotificationItem
        // para permitir animaciones de salida

        return id;
    }, []);

    // Remover una notificación específica
    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    // Limpiar todas las notificaciones
    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    // Funciones de conveniencia para diferentes tipos
    const showSuccess = useCallback((message, options = {}) => {
        return addNotification({
            type: 'success',
            message,
            ...options
        });
    }, [addNotification]);

    const showError = useCallback((message, options = {}) => {
        return addNotification({
            type: 'error',
            message,
            duration: 8000, // Errores duran más tiempo
            ...options
        });
    }, [addNotification]);

    const showWarning = useCallback((message, options = {}) => {
        return addNotification({
            type: 'warning',
            message,
            duration: 6000,
            ...options
        });
    }, [addNotification]);

    const showInfo = useCallback((message, options = {}) => {
        return addNotification({
            type: 'info',
            message,
            ...options
        });
    }, [addNotification]);

    const value = {
        notifications,
        addNotification,
        removeNotification,
        clearAll,
        showSuccess,
        showError,
        showWarning,
        showInfo
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};