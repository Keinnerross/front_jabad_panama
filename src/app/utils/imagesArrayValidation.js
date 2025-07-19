export function imagesArrayValidation(pictures, fallbackData) {
    if (!pictures || !Array.isArray(pictures) || pictures.length === 0) {
        return Array.isArray(fallbackData?.imageUrls) ? fallbackData.imageUrls : [];
    }
    
    const result = pictures.map(pic => {
        // Handle different data types
        if (typeof pic === 'string') {
            // If it's already a URL string, return as is
            return pic;
        } else if (pic && typeof pic === 'object' && pic.url && pic.url !== undefined) {
            // If it's a Strapi media object with url property (and url is not undefined)
            return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pic.url}`;
        } else {
            // Return null for invalid entries
            return null;
        }
    }).filter(url => url && !url.includes('undefined')); // ← Filtra URLs inválidas
    
    // Ensure we always return an array
    return Array.isArray(result) ? result : [];
}