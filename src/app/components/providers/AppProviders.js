'use client';

import React, { useEffect } from 'react';
import { NotificationProvider } from '../../context/NotificationContext';
import { CartProvider } from '../../context/CartContext';
import { SiteConfigProvider } from '@/app/context/SiteConfigContext';
/**
 * Simple Site Configuration Integration Component
 * Only provides basic theme setup for now
 */

/**
 * Main App Providers Component
 * Centralizes all application providers
 */
export const AppProviders = ({ children, siteConfig }) => {
  return (
    <SiteConfigProvider data={siteConfig}>
      <NotificationProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </NotificationProvider>
    </SiteConfigProvider>
  );
};



/**
 * Error Boundary Component
 */
export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center min-h-screen bg-blueBackground">
          <div className="flex flex-col items-center space-y-4 max-w-md text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L3.196 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-darkBlue mb-2">Something went wrong</h2>
              <p className="text-gray-text mb-4">An unexpected error occurred. Please try refreshing the page.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-80 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Complete App Wrapper with Error Boundary
 */
export const AppWrapper = ({ children, siteConfig }) => (
  <AppErrorBoundary>
    <AppProviders siteConfig={siteConfig}>
      {children}
    </AppProviders>
  </AppErrorBoundary>
);

export default AppProviders;