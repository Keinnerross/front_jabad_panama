'use client'
import React from 'react';
import { useNotification } from '../../../context/NotificationContext';
import { NotificationItem } from './NotificationItem';

export const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    if (notifications.length === 0) {
        return null;
    }

    return (
        <>
            {/* Desktop: Esquina inferior derecha */}
            <div className="hidden md:block fixed bottom-4 right-4 z-50 max-w-sm">
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRemove={removeNotification}
                        />
                    ))}
                </div>
            </div>

            {/* Mobile: Parte superior (debajo del header) */}
            <div className="block md:hidden fixed top-20 left-4 right-4 z-50">
                <div className="space-y-3">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="w-full">
                            <NotificationItem
                                notification={notification}
                                onRemove={removeNotification}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};