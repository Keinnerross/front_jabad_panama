'use client';
import React from 'react';

/**
 * Componente de loader global para toda la aplicación
 * Se muestra cuando hay datos cargando para evitar contenido parcial
 */
export const GlobalLoader = ({ isLoading, children }) => {
  if (!isLoading) {
    return children;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blueBackground">
      <div className="text-center">
        {/* Spinner animado */}
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          <div className="w-12 h-12 border-4 border-transparent border-t-primary/40 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2"></div>
        </div>
        
        {/* Logo o texto */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-primary mb-2">
            Chabad Boquete
          </h2>
          <p className="text-gray-text text-sm">
            Loading your Jewish home in the mountains...
          </p>
        </div>

        {/* Dots animados */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Loader más pequeño para secciones específicas
 */
export const SectionLoader = ({ isLoading, children, className = "" }) => {
  if (!isLoading) {
    return children;
  }

  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-text text-sm">Loading...</p>
      </div>
    </div>
  );
};

/**
 * Skeleton loader para contenido específico
 */
export const SkeletonLoader = ({ type = "text", className = "" }) => {
  const skeletonClasses = "bg-gray-200 animate-pulse rounded";
  
  switch (type) {
    case "title":
      return <div className={`${skeletonClasses} h-8 w-3/4 mb-4 ${className}`}></div>;
    case "text":
      return (
        <div className={`space-y-2 ${className}`}>
          <div className={`${skeletonClasses} h-4 w-full`}></div>
          <div className={`${skeletonClasses} h-4 w-5/6`}></div>
          <div className={`${skeletonClasses} h-4 w-4/5`}></div>
        </div>
      );
    case "image":
      return <div className={`${skeletonClasses} aspect-square w-full ${className}`}></div>;
    case "card":
      return (
        <div className={`p-4 border border-gray-200 rounded-lg ${className}`}>
          <div className={`${skeletonClasses} aspect-square w-full mb-4`}></div>
          <div className={`${skeletonClasses} h-6 w-3/4 mb-2`}></div>
          <div className={`${skeletonClasses} h-4 w-full`}></div>
        </div>
      );
    default:
      return <div className={`${skeletonClasses} h-4 w-full ${className}`}></div>;
  }
};

export default GlobalLoader;