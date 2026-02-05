/**
 * Service for resolving city names to geographic location data
 * Used to configure Shabbat times API with the correct location
 */

// Known cities with their GeoNames ID and timezone
// Format: 'city,country' (lowercase) -> { geonameid, timezone }
const KNOWN_CITIES = {
    // Panama
    'panama,panama': { geonameid: 3703443, timezone: 'America/Panama' },
    'panama city,panama': { geonameid: 3703443, timezone: 'America/Panama' },
    'ciudad de panama,panama': { geonameid: 3703443, timezone: 'America/Panama' },

    // Mexico
    'mexico city,mexico': { geonameid: 3530597, timezone: 'America/Mexico_City' },
    'ciudad de mexico,mexico': { geonameid: 3530597, timezone: 'America/Mexico_City' },
    'cdmx,mexico': { geonameid: 3530597, timezone: 'America/Mexico_City' },
    'guadalajara,mexico': { geonameid: 4005539, timezone: 'America/Mexico_City' },
    'monterrey,mexico': { geonameid: 3995465, timezone: 'America/Monterrey' },
    'cancun,mexico': { geonameid: 3531673, timezone: 'America/Cancun' },
    'tijuana,mexico': { geonameid: 3981609, timezone: 'America/Tijuana' },

    // Argentina
    'buenos aires,argentina': { geonameid: 3435910, timezone: 'America/Argentina/Buenos_Aires' },
    'cordoba,argentina': { geonameid: 3860259, timezone: 'America/Argentina/Cordoba' },
    'rosario,argentina': { geonameid: 3838583, timezone: 'America/Argentina/Buenos_Aires' },
    'mendoza,argentina': { geonameid: 3844421, timezone: 'America/Argentina/Mendoza' },

    // Brazil
    'sao paulo,brazil': { geonameid: 3448439, timezone: 'America/Sao_Paulo' },
    'rio de janeiro,brazil': { geonameid: 3451190, timezone: 'America/Sao_Paulo' },
    'brasilia,brazil': { geonameid: 3469058, timezone: 'America/Sao_Paulo' },
    'curitiba,brazil': { geonameid: 3464975, timezone: 'America/Sao_Paulo' },

    // Colombia
    'bogota,colombia': { geonameid: 3688689, timezone: 'America/Bogota' },
    'medellin,colombia': { geonameid: 3674962, timezone: 'America/Bogota' },
    'cali,colombia': { geonameid: 3687925, timezone: 'America/Bogota' },

    // Chile
    'santiago,chile': { geonameid: 3871336, timezone: 'America/Santiago' },
    'valparaiso,chile': { geonameid: 3868626, timezone: 'America/Santiago' },

    // Peru
    'lima,peru': { geonameid: 3936456, timezone: 'America/Lima' },

    // Venezuela
    'caracas,venezuela': { geonameid: 3646738, timezone: 'America/Caracas' },

    // Costa Rica
    'san jose,costa rica': { geonameid: 3621849, timezone: 'America/Costa_Rica' },

    // Uruguay
    'montevideo,uruguay': { geonameid: 3441575, timezone: 'America/Montevideo' },

    // Ecuador
    'quito,ecuador': { geonameid: 3652462, timezone: 'America/Guayaquil' },
    'guayaquil,ecuador': { geonameid: 3657509, timezone: 'America/Guayaquil' },

    // Bolivia
    'la paz,bolivia': { geonameid: 3911925, timezone: 'America/La_Paz' },

    // Paraguay
    'asuncion,paraguay': { geonameid: 3439389, timezone: 'America/Asuncion' },

    // Israel
    'jerusalem,israel': { geonameid: 281184, timezone: 'Asia/Jerusalem' },
    'tel aviv,israel': { geonameid: 293397, timezone: 'Asia/Jerusalem' },
    'haifa,israel': { geonameid: 294801, timezone: 'Asia/Jerusalem' },
    'beer sheva,israel': { geonameid: 295530, timezone: 'Asia/Jerusalem' },
    'eilat,israel': { geonameid: 295277, timezone: 'Asia/Jerusalem' },

    // USA
    'new york,usa': { geonameid: 5128581, timezone: 'America/New_York' },
    'new york,united states': { geonameid: 5128581, timezone: 'America/New_York' },
    'miami,usa': { geonameid: 4164138, timezone: 'America/New_York' },
    'miami,united states': { geonameid: 4164138, timezone: 'America/New_York' },
    'los angeles,usa': { geonameid: 5368361, timezone: 'America/Los_Angeles' },
    'los angeles,united states': { geonameid: 5368361, timezone: 'America/Los_Angeles' },
    'chicago,usa': { geonameid: 4887398, timezone: 'America/Chicago' },
    'houston,usa': { geonameid: 4699066, timezone: 'America/Chicago' },
    'phoenix,usa': { geonameid: 5308655, timezone: 'America/Phoenix' },
    'san francisco,usa': { geonameid: 5391959, timezone: 'America/Los_Angeles' },
    'boston,usa': { geonameid: 4930956, timezone: 'America/New_York' },
    'atlanta,usa': { geonameid: 4180439, timezone: 'America/New_York' },
    'las vegas,usa': { geonameid: 5506956, timezone: 'America/Los_Angeles' },

    // Canada
    'toronto,canada': { geonameid: 6167865, timezone: 'America/Toronto' },
    'montreal,canada': { geonameid: 6077243, timezone: 'America/Montreal' },
    'vancouver,canada': { geonameid: 6173331, timezone: 'America/Vancouver' },

    // Spain
    'madrid,spain': { geonameid: 3117735, timezone: 'Europe/Madrid' },
    'madrid,espana': { geonameid: 3117735, timezone: 'Europe/Madrid' },
    'barcelona,spain': { geonameid: 3128760, timezone: 'Europe/Madrid' },
    'barcelona,espana': { geonameid: 3128760, timezone: 'Europe/Madrid' },
    'valencia,spain': { geonameid: 2509954, timezone: 'Europe/Madrid' },
    'sevilla,spain': { geonameid: 2510911, timezone: 'Europe/Madrid' },
    'malaga,spain': { geonameid: 2514256, timezone: 'Europe/Madrid' },

    // France
    'paris,france': { geonameid: 2988507, timezone: 'Europe/Paris' },
    'paris,francia': { geonameid: 2988507, timezone: 'Europe/Paris' },
    'marseille,france': { geonameid: 2995469, timezone: 'Europe/Paris' },
    'lyon,france': { geonameid: 2996944, timezone: 'Europe/Paris' },
    'nice,france': { geonameid: 2990440, timezone: 'Europe/Paris' },

    // UK
    'london,uk': { geonameid: 2643743, timezone: 'Europe/London' },
    'london,united kingdom': { geonameid: 2643743, timezone: 'Europe/London' },
    'london,england': { geonameid: 2643743, timezone: 'Europe/London' },
    'manchester,uk': { geonameid: 2643123, timezone: 'Europe/London' },

    // Germany
    'berlin,germany': { geonameid: 2950159, timezone: 'Europe/Berlin' },
    'berlin,alemania': { geonameid: 2950159, timezone: 'Europe/Berlin' },
    'munich,germany': { geonameid: 2867714, timezone: 'Europe/Berlin' },
    'frankfurt,germany': { geonameid: 2925533, timezone: 'Europe/Berlin' },
    'hamburg,germany': { geonameid: 2911298, timezone: 'Europe/Berlin' },

    // Italy
    'rome,italy': { geonameid: 3169070, timezone: 'Europe/Rome' },
    'roma,italy': { geonameid: 3169070, timezone: 'Europe/Rome' },
    'roma,italia': { geonameid: 3169070, timezone: 'Europe/Rome' },
    'milan,italy': { geonameid: 3173435, timezone: 'Europe/Rome' },
    'florence,italy': { geonameid: 3176959, timezone: 'Europe/Rome' },

    // Netherlands
    'amsterdam,netherlands': { geonameid: 2759794, timezone: 'Europe/Amsterdam' },

    // Belgium
    'brussels,belgium': { geonameid: 2800866, timezone: 'Europe/Brussels' },
    'antwerp,belgium': { geonameid: 2803138, timezone: 'Europe/Brussels' },

    // Switzerland
    'zurich,switzerland': { geonameid: 2657896, timezone: 'Europe/Zurich' },
    'geneva,switzerland': { geonameid: 2660646, timezone: 'Europe/Zurich' },

    // Austria
    'vienna,austria': { geonameid: 2761369, timezone: 'Europe/Vienna' },

    // Poland
    'warsaw,poland': { geonameid: 756135, timezone: 'Europe/Warsaw' },
    'krakow,poland': { geonameid: 3094802, timezone: 'Europe/Warsaw' },

    // Russia
    'moscow,russia': { geonameid: 524901, timezone: 'Europe/Moscow' },
    'saint petersburg,russia': { geonameid: 498817, timezone: 'Europe/Moscow' },

    // Ukraine
    'kyiv,ukraine': { geonameid: 703448, timezone: 'Europe/Kyiv' },
    'kiev,ukraine': { geonameid: 703448, timezone: 'Europe/Kyiv' },
    'odessa,ukraine': { geonameid: 698740, timezone: 'Europe/Kyiv' },

    // Hungary
    'budapest,hungary': { geonameid: 3054643, timezone: 'Europe/Budapest' },

    // Czech Republic
    'prague,czech republic': { geonameid: 3067696, timezone: 'Europe/Prague' },

    // Greece
    'athens,greece': { geonameid: 264371, timezone: 'Europe/Athens' },

    // Turkey
    'istanbul,turkey': { geonameid: 745044, timezone: 'Europe/Istanbul' },

    // South Africa
    'johannesburg,south africa': { geonameid: 993800, timezone: 'Africa/Johannesburg' },
    'cape town,south africa': { geonameid: 3369157, timezone: 'Africa/Johannesburg' },

    // Morocco
    'casablanca,morocco': { geonameid: 2553604, timezone: 'Africa/Casablanca' },

    // Australia
    'sydney,australia': { geonameid: 2147714, timezone: 'Australia/Sydney' },
    'melbourne,australia': { geonameid: 2158177, timezone: 'Australia/Melbourne' },
    'brisbane,australia': { geonameid: 2174003, timezone: 'Australia/Brisbane' },
    'perth,australia': { geonameid: 2063523, timezone: 'Australia/Perth' },

    // China
    'shanghai,china': { geonameid: 1796236, timezone: 'Asia/Shanghai' },
    'beijing,china': { geonameid: 1816670, timezone: 'Asia/Shanghai' },
    'hong kong,china': { geonameid: 1819729, timezone: 'Asia/Hong_Kong' },
    'hong kong,hong kong': { geonameid: 1819729, timezone: 'Asia/Hong_Kong' },
    'shenzhen,china': { geonameid: 1795565, timezone: 'Asia/Shanghai' },
    'guangzhou,china': { geonameid: 1809858, timezone: 'Asia/Shanghai' },

    // Japan
    'tokyo,japan': { geonameid: 1850147, timezone: 'Asia/Tokyo' },
    'osaka,japan': { geonameid: 1853909, timezone: 'Asia/Tokyo' },
    'kyoto,japan': { geonameid: 1857910, timezone: 'Asia/Tokyo' },

    // South Korea
    'seoul,south korea': { geonameid: 1835848, timezone: 'Asia/Seoul' },
    'seoul,korea': { geonameid: 1835848, timezone: 'Asia/Seoul' },
    'busan,south korea': { geonameid: 1838524, timezone: 'Asia/Seoul' },

    // Taiwan
    'taipei,taiwan': { geonameid: 1668341, timezone: 'Asia/Taipei' },

    // Singapore
    'singapore,singapore': { geonameid: 1880252, timezone: 'Asia/Singapore' },

    // Thailand
    'bangkok,thailand': { geonameid: 1609350, timezone: 'Asia/Bangkok' },

    // India
    'mumbai,india': { geonameid: 1275339, timezone: 'Asia/Kolkata' },
    'new delhi,india': { geonameid: 1261481, timezone: 'Asia/Kolkata' },
    'delhi,india': { geonameid: 1273294, timezone: 'Asia/Kolkata' },
    'bangalore,india': { geonameid: 1277333, timezone: 'Asia/Kolkata' },

    // UAE
    'dubai,uae': { geonameid: 292223, timezone: 'Asia/Dubai' },
    'dubai,united arab emirates': { geonameid: 292223, timezone: 'Asia/Dubai' },
    'abu dhabi,uae': { geonameid: 292968, timezone: 'Asia/Dubai' },

    // New Zealand
    'auckland,new zealand': { geonameid: 2193733, timezone: 'Pacific/Auckland' },
    'wellington,new zealand': { geonameid: 2179537, timezone: 'Pacific/Auckland' },
};

// Fallback indicator - returned when city is not found
const FALLBACK_LOCATION = {
    geonameid: null,
    timezone: null,
    city: null,
    country: null,
    isReferential: true  // Flag to indicate times are referential only
};

/**
 * Normalizes city and country names for lookup
 * @param {string} city - City name
 * @param {string} country - Country name
 * @returns {string} Normalized key for lookup
 */
function normalizeLocationKey(city, country) {
    const normalizedCity = (city || '').toLowerCase().trim();
    const normalizedCountry = (country || '').toLowerCase().trim();
    return `${normalizedCity},${normalizedCountry}`;
}

/**
 * Gets location configuration by city and country names
 * @param {string} ciudad - City name (from platformSettings)
 * @param {string} pais - Country name (from platformSettings)
 * @returns {Object} Location config with geonameid and timezone, or fallback with isReferential flag
 */
export function getLocationByCity(ciudad, pais) {
    if (!ciudad) {
        console.warn('⚠️ No city provided for Shabbat times, returning referential times');
        return { ...FALLBACK_LOCATION };
    }

    const key = normalizeLocationKey(ciudad, pais);
    const location = KNOWN_CITIES[key];

    if (location) {
        return {
            ...location,
            city: ciudad,
            country: pais,
            isReferential: false
        };
    }

    // Try with just the city name (for flexibility)
    for (const [knownKey, knownLocation] of Object.entries(KNOWN_CITIES)) {
        const knownCity = knownKey.split(',')[0];
        if (knownCity === ciudad.toLowerCase().trim()) {
            console.log(`📍 Found city "${ciudad}" with different country, using ${knownKey}`);
            return {
                ...knownLocation,
                city: ciudad,
                country: pais,
                isReferential: false
            };
        }
    }

    console.warn(`⚠️ City "${ciudad}, ${pais}" not found in known cities`);
    console.warn('   To add this city, update KNOWN_CITIES in geoLocationService.js');

    return {
        ...FALLBACK_LOCATION,
        city: ciudad,
        country: pais
    };
}

/**
 * Returns the fallback location configuration (referential only)
 * @returns {Object} Fallback location with isReferential flag
 */
export function getDefaultLocation() {
    return { ...FALLBACK_LOCATION };
}

/**
 * Returns all known cities for reference
 * @returns {Array} Array of city/country combinations
 */
export function getKnownCities() {
    return Object.keys(KNOWN_CITIES).map(key => {
        const [city, country] = key.split(',');
        return { city, country };
    });
}
