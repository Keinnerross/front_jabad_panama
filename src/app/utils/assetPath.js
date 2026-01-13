/**
 * Helper para generar rutas de assets considerando el basePath
 */
export function getAssetPath(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return `${basePath}${cleanPath}`;
}