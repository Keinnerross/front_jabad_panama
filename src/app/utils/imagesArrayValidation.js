/**
 * Validates and processes Strapi image arrays with optional format optimization
 * @param {Array} pictures - Array of Strapi media objects or URL strings
 * @param {Object} fallbackData - Fallback data with imageUrls array
 * @param {string} format - Optional Strapi format: 'thumbnail' (~156px), 'small' (~500px), 'medium' (~750px), 'large' (~1000px)
 * @returns {Array} Array of processed image URLs
 */
export function imagesArrayValidation(pictures, fallbackData, format = null) {
    if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
        return Array.isArray(fallbackData?.imageUrls) ? fallbackData.imageUrls : [];
    }

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    const result = pictures.map(pic => {
        // Handle different data types
        if (typeof pic === 'string') {
            // If it's already a URL string, return as is
            return pic;
        } else if (pic && typeof pic === 'object' && pic.url && pic.url !== undefined) {
            // If format is specified, try to use the optimized version
            if (format && pic.formats && pic.formats[format]?.url) {
                return `${baseUrl}${pic.formats[format].url}`;
            }
            // Fallback to original URL if format not available
            return `${baseUrl}${pic.url}`;
        } else {
            // Return null for invalid entries
            return null;
        }
    }).filter(url => url && !url.includes('undefined')); // ← Filtra URLs inválidas

    // Ensure we always return an array
    return Array.isArray(result) ? result : [];
}

/**
 * Gets a single optimized image URL from a Strapi media object
 * @param {Object|string} image - Strapi media object or URL string
 * @param {string} format - Strapi format: 'thumbnail', 'small', 'medium', 'large'
 * @param {string} fallbackUrl - Fallback URL if image is invalid
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(image, format = 'medium', fallbackUrl = '') {
    if (!image) return fallbackUrl;

    // If it's already a URL string, return as is
    if (typeof image === 'string') return image;

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;

    // Try to get the requested format
    if (image.formats && image.formats[format]?.url) {
        return `${baseUrl}${image.formats[format].url}`;
    }

    // Fallback to original URL
    if (image.url) {
        return `${baseUrl}${image.url}`;
    }

    return fallbackUrl;
}