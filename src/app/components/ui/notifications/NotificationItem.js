'use client'
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes, FaTimesCircle } from 'react-icons/fa';

export const NotificationItem = ({ notification, onRemove }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);

    // Animación de entrada
    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Manejar cierre con animación
    const handleClose = () => {
        setIsLeaving(true);
        setTimeout(() => {
            onRemove(notification.id);
        }, 300); // Duración de la animación de salida
    };

    // Configuración por tipo de notificación
    const getNotificationConfig = (type) => {
        const configs = {
            success: {
                bgColor: 'bg-green-50',
                borderColor: 'border-green-200',
                textColor: 'text-green-800',
                iconColor: 'text-green-600',
                icon: FaCheckCircle
            },
            error: {
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                textColor: 'text-red-800',
                iconColor: 'text-red-600',
                icon: FaTimesCircle
            },
            warning: {
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                textColor: 'text-yellow-800',
                iconColor: 'text-yellow-600',
                icon: FaExclamationTriangle
            },
            info: {
                bgColor: 'bg-blue-50',
                borderColor: 'border-blue-200',
                textColor: 'text-blue-800',
                iconColor: 'text-blue-600',
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
                relative w-full max-w-sm mb-3 p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out
                ${config.bgColor} ${config.borderColor}
                ${isVisible && !isLeaving 
                    ? 'opacity-100 transform translate-x-0' 
                    : 'opacity-0 transform translate-x-full'
                }
                ${isLeaving ? 'opacity-0 transform translate-x-full' : ''}
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
                            ${config.textColor} hover:bg-black hover:bg-opacity-10
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-gray-400
                        `}
                        aria-label="Cerrar notificación"
                    >
                        <FaTimes size={14} />
                    </button>
                )}
            </div>

            {/* Barra de progreso para auto-dismiss */}
            {notification.duration > 0 && (
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