'use client'
import React from 'react';
import { useNotification } from '../../../context/NotificationContext';

export const NotificationDemo = () => {
    const { showSuccess, showError, showWarning, showInfo, clearAll } = useNotification();

    const testNotifications = () => {
        // Mostrar diferentes tipos de notificaciones para testing
        showSuccess('Order placed successfully!', { 
            title: 'Success',
            duration: 5000 
        });
        
        setTimeout(() => {
            showInfo('Your reservation is being processed', { 
                title: 'Processing',
                duration: 4000 
            });
        }, 500);
        
        setTimeout(() => {
            showWarning('Please check your email for confirmation', { 
                title: 'Reminder',
                duration: 6000 
            });
        }, 1000);
        
        setTimeout(() => {
            showError('Payment failed. Please try again.', { 
                title: 'Payment Error',
                duration: 8000 
            });
        }, 1500);
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 space-y-2">
            <div className="bg-white p-4 rounded-lg shadow-lg border">
                <h3 className="font-bold text-sm mb-3 text-darkBlue">Notification Demo</h3>
                <div className="space-y-2">
                    <button
                        onClick={testNotifications}
                        className="w-full bg-primary text-white px-3 py-2 text-xs rounded hover:bg-opacity-90 transition"
                    >
                        Test All Types
                    </button>
                    <button
                        onClick={() => showSuccess('Item added to cart!')}
                        className="w-full bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-opacity-90 transition"
                    >
                        Success
                    </button>
                    <button
                        onClick={() => showError('Something went wrong')}
                        className="w-full bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-opacity-90 transition"
                    >
                        Error
                    </button>
                    <button
                        onClick={() => showWarning('Please verify your info')}
                        className="w-full bg-yellow-600 text-white px-3 py-1 text-xs rounded hover:bg-opacity-90 transition"
                    >
                        Warning
                    </button>
                    <button
                        onClick={() => showInfo('New features available')}
                        className="w-full bg-blue-600 text-white px-3 py-1 text-xs rounded hover:bg-opacity-90 transition"
                    >
                        Info
                    </button>
                    <button
                        onClick={clearAll}
                        className="w-full bg-gray-600 text-white px-3 py-1 text-xs rounded hover:bg-opacity-90 transition"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
};