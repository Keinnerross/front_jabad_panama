import getConfig from 'next/config';

/**
 * Helper para generar rutas de assets considerando el basePath
 */
export function getAssetPath(path) {
  // Asegura que siempre comience con /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  try {
    // Obtiene la configuración de Next.js
    const { publicRuntimeConfig } = getConfig();
    const basePath = publicRuntimeConfig?.basePath || '';
    
    return `${basePath}${cleanPath}`;
  } catch (error) {
    // Fallback si no se puede obtener la configuración
    // Esto puede pasar en contextos donde getConfig no está disponible
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    return `${basePath}${cleanPath}`;
  }
}