'use client';
import { createContext, useContext } from 'react';

// Context simple para configuración del sitio
const SiteConfigContext = createContext();

// Provider que recibe data como prop
export const SiteConfigProvider = ({ children, data }) => {
  return (
    <SiteConfigContext.Provider value={data}>
      {children}
    </SiteConfigContext.Provider>
  );
};

// Hook simple para usar el contexto
export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig debe usarse dentro de SiteConfigProvider');
  }
  return context;
};