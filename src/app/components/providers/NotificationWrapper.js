'use client'

import { NotificationProvider } from '../../context/NotificationContext'
import { CartProvider } from '../../context/CartContext'

export const ClientProvidersWrapper = ({ children }) => {
  return (
    <NotificationProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </NotificationProvider>
  )
}