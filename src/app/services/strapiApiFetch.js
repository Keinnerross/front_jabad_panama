/**
 * Centralized service for Strapi v5 API
 * Handles fetches, populate queries and base configuration
 */

// Variables se evalúan dentro de las funciones para server components
export function getEnvVars() {
    // En server components, usar conexión interna. En client, usar externa
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer
        ? (process.env.STRAPI_INTERNAL_URL || 'http://localhost:1439')  // Configurable para server components
        : (process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://212.85.22.57/chabbat'); // Externa para client

    return {
        STRAPI_BASE_URL: baseUrl,
        STRAPI_TOKEN: process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || null
    };
}




// Validation of environment variables (moved inside functions)

// Función auxiliar para limpiar URLs
function cleanUrl(baseUrl, endpoint) {
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBaseUrl}${cleanEndpoint}`;
}

/**
* Endpoints - moved inside functions to avoid server component initialization issues
*/

export async function strapiFetch(endpoint) {
    const { STRAPI_BASE_URL, STRAPI_TOKEN } = getEnvVars();

    // TEMPORARY DEBUG
    if (typeof window !== 'undefined') {
        console.log('🚨 CLIENT strapiFetch called with:', { endpoint, type: typeof endpoint });
    } else {
        console.log('🚨 SERVER strapiFetch called with:', { endpoint, type: typeof endpoint });
    }

    // Validation of environment variables
    console.log('🔍 ENV VALIDATION:', {
        STRAPI_BASE_URL: STRAPI_BASE_URL,
        STRAPI_TOKEN: STRAPI_TOKEN ? 'EXISTS' : 'MISSING',
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_STRAPI_API_URL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
        NEXT_PUBLIC_STRAPI_API_TOKEN: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN ? 'EXISTS' : 'MISSING'
    });

    if (!endpoint || endpoint === undefined) {
        console.error('ENDPOINT IS UNDEFINED!', { endpoint, type: typeof endpoint });
        return { data: null, error: { message: 'Endpoint is undefined' } };
    }

    try {
        const headers = {};
        if (STRAPI_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }
        // Si ya tiene populate, lo usa. Si no, agrega populate=*
        const url = endpoint.includes('populate')
            ? cleanUrl(STRAPI_BASE_URL, `/api${endpoint}`)
            : cleanUrl(STRAPI_BASE_URL, `/api${endpoint}?populate=*`);

        console.log('🚀 Fetching:', url);
        console.log('📍 Endpoint:', endpoint);
        console.log('📍 Base URL:', STRAPI_BASE_URL);
        console.log('📍 Headers:', headers);

        const response = await fetch(url, {
            method: "GET",
            headers,
            cache: 'no-cache' //Manejo de caché
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json()
        const data = json.data; // <--- directo
        console.log('✅ Response for', endpoint, ':', {
            status: response.status,
            dataType: typeof data,
            dataLength: Array.isArray(data) ? data.length : 'not array',
            data: data
        });
        return data// <--- directo

    } catch (error) {
        console.error('❌ Error:', error);
        return {
            data: null,
            error: { message: error.message }
        };
    }
}
export async function strapiFetchById(endpoint, id, populate) {
    const { STRAPI_BASE_URL, STRAPI_TOKEN } = getEnvVars();

    try {
        const headers = {};
        if (STRAPI_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }

        // Construye URL con ID
        const url = !populate
            ? cleanUrl(STRAPI_BASE_URL, `/api${endpoint}/${id}`)
            : cleanUrl(STRAPI_BASE_URL, `/api${endpoint}/${id}?populate=*`);

        /*  console.log('🚀 Fetching:', url); */

        const response = await fetch(url, {
            method: "GET",
            headers,
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        const data = json.data;

        /*    console.log('✅ Response:', data); */
        return data;

    } catch (error) {
        console.error('❌ Error:', error);
        return {
            data: null,
            error: { message: error.message }
        };
    }
}

export const api = {
    siteConfig: () => strapiFetch("/site-config?populate=*"),
    popUps: () => strapiFetch("/pop-ups?populate=*"),
    customVideo: () => strapiFetch("/content-page?populate[home_video][populate]=*"),
    customPages: () => strapiFetch("/page-customs?populate=*"),
    aboutPage: () => strapiFetch("/about-us?populate[about_page][populate][pictures][populate]=*&populate[sidebar][populate]=*"),
    homeAbout: () => strapiFetch("/about-us?populate[home_about][populate][item_list]=true&populate[home_about][populate][pictures]=true"),
    restaurants: () => strapiFetch("/Restaurants?populate=*"),
    singleRestaurant: (id, populate) => strapiFetchById("/restaurants", id, populate),
    hotels: () => strapiFetch("/hotels?populate=*"),
    activities: () => strapiFetch("/activities?populate=*"),
    infoTourist: () => strapiFetch("/visitor-infos?populate=*"),
    packages: () => strapiFetch("/package?populate[hero_packages][populate]=*&populate[whyPackages][populate]=*"),
    shabbatsAndHolidays: () => strapiFetch("/shabbat-and-holidays?populate[cover_picture]=true&populate[repeat_control][populate]=*&populate[category_menu][populate][option][populate]=*"),
    shabbatsAndHolidaysPage: () => strapiFetch("/shabbat-and-holidays-page?populate[register_for_meal_section][populate]=*&populate[shabbat_box_section][populate]=*"),
    shabbatsRegisterPrices: () => strapiFetch("/shabbat-pricings?populate=*"),
    shabbatBoxOptions: () => strapiFetch("/shabbat-boxes?populate[options][populate][variants]=*"),
    shabbatBoxSingle: () => strapiFetch("/shabbat-box-page?populate=*"),
    socialMediaLinks: () => strapiFetch("/site-config/?fields[0]=id&populate[social_media]=*"),
    copiesPages: () => strapiFetch("/content-page?populate[activities][populate]=*&populate[restaurants][populate]=*&populate[accommodations][populate]=*&populate[visitor_info][populate]=picture&populate[contact_page][populate]=picture&populate[donations][populate]=*"),
    copiesPages: () => strapiFetch("/content-page?populate[activities][populate]=*&populate[restaurants][populate]=*&populate[accommodations][populate]=*&populate[visitor_info][populate]=picture&populate[contact_page][populate]=picture&populate[donations][populate]=*"),
    termsAndConditions: () => strapiFetch("/content-page?populate[terms_and_conditions][populate]=*"),
    privacyPolicy: () => strapiFetch("/content-page?populate[privacy_policy][populate]=*"),
}