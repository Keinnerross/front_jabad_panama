export function imagesArrayValidation(pictures, fallbackData) {
    return pictures.length > 0
        ? pictures.map(pic => `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${pic.url}`)
            .filter(url => url && !url.includes('undefined')) // ← Filtra URLs inválidas
        : fallbackData.imageUrls
}