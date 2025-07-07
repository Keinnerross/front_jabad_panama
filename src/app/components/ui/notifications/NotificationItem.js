'use client'
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

export const NotificationItem = ({ notification, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    // Animación de entrada
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Auto-dismiss con animación
    useEffect(() => {
        if (notification.duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, notification.duration);
            return () => clearTimeout(timer);
        }
    }, [notification.duration]);

    // Manejar cierre con animación mejorada
    const handleClose = () => {
        if (isLeaving) return; // Prevenir doble ejecución
        setIsLeaving(true);
        // Tiempo suficiente para que la animación se complete
        setTimeout(() => {
            onRemove(notification.id);
        }, 500);
    };

    // Configuración por tipo de notificación
    const getNotificationConfig = (type) => {
        const configs = {
            success: {
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                textColor: 'text-green-800',
                iconColor: 'text-green-600',
                hoverColor: 'hover:bg-green-100',
                icon: FaCheckCircle
            },
            error: {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-800',
                iconColor: 'text-red-600',
                hoverColor: 'hover:bg-red-100',
                icon: FaTimesCircle
            },
            warning: {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
                iconColor: 'text-yellow-600',
                hoverColor: 'hover:bg-yellow-100',
                icon: FaExclamationTriangle
            },
            info: {
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800',
                iconColor: 'text-blue-600',
                hoverColor: 'hover:bg-blue-100',
                icon: FaInfoCircle
            }
        };
        return configs[type] || configs.info;
    };

    const config = getNotificationConfig(notification.type);
    const IconComponent = config.icon;

    return (
        <div
            className={`
                relative w-full max-w-sm mb-3 p-4 rounded-lg shadow-lg border 
                ${config.bgColor} ${config.borderColor}
                transition-all duration-500 ease-in-out
                ${!isVisible 
                    ? 'opacity-0 transform translate-x-full scale-95' 
                    : isLeaving
                        ? 'opacity-0 transform translate-x-full scale-90'
                        : 'opacity-100 transform translate-x-0 scale-100'
                }
            `}
            role="alert"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                {/* Icono */}
                <div className={`flex-shrink-0 ${config.iconColor}`}>
                    <IconComponent size={20} />
                </div>

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                    {notification.title && (
                        <h4 className={`font-semibold text-sm mb-1 ${config.textColor}`}>
                            {notification.title}
                        </h4>
                    )}
                    <p className={`text-sm ${config.textColor} break-words`}>
                        {notification.message}
                    </p>
                </div>

                {/* Botón de cerrar */}
                {notification.dismissible && (
                    <button
                        onClick={handleClose}
                        className={`
                            flex-shrink-0 p-1 rounded-md transition-colors duration-200
                            ${config.textColor} ${config.hoverColor}
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-gray-400
                        `}
                        aria-label="Cerrar notificación"
                    >
                        <FaTimes size={14} />
                    </button>
                )}
            </div>

            {/* Barra de progreso para auto-dismiss */}
            {notification.duration > 0 && !isLeaving && (
                <div className={`absolute bottom-0 left-0 h-1 ${config.borderColor} rounded-bl-lg overflow-hidden`}>
                    <div 
                        className={`h-full ${config.iconColor.replace('text-', 'bg-')} transition-all linear`}
                        style={{
                            animation: `shrink ${notification.duration}ms linear`,
                            transformOrigin: 'left'
                        }}
                    />
                </div>
            )}

            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
};