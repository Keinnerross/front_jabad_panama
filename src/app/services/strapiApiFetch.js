/**
 * Centralized service for Strapi v5 API
 * Handles fetches, populate queries and base configuration
 */

// Variables se evalúan dentro de las funciones para server components
function getEnvVars() {
    // En server components, usar conexión interna. En client, usar externa
    const isServer = typeof window === 'undefined';
    const baseUrl = isServer 
        ? (process.env.STRAPI_INTERNAL_URL || 'http://localhost:1437')  // Configurable para server components
        : (process.env.NEXT_PUBLIC_STRAPI_API_URL || 'https://212.85.22.57/chabbat'); // Externa para client
    
    return {
        STRAPI_BASE_URL: baseUrl,
        STRAPI_TOKEN: process.env.STRAPI_API_TOKEN || process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || 'b67eefc50b0a1cda8be30955b82e5d1e623d11d71caebacb0dde67c217b4dcc40921d5c7b8e9d8d376c8912eda1eff8e3d9a9d7af316bca761b4b54f5bd509049da7cb3590d86829b6835747e4130335ff6d499da0080f6098d366b7bb5bd978b68dad9b3bf93150fceea8e7613b5c692dff3dcee608f19148d2e3dff71504a7'
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
    aboutPage: () => strapiFetch("/about-us?populate[about_page][populate][pictures][populate]=*&populate[sidebar][populate]=*"),
    homeAbout: () => strapiFetch("/about-us?populate[home_about][populate][item_list]=true&populate[home_about][populate][pictures]=true"),
    restaurants: () => strapiFetch("/Restaurants?populate=*"),
    singleRestaurant: (id, populate) => strapiFetchById("/restaurants", id, populate),
    hotels: () => strapiFetch("/hotels?populate=*"),
    activities: () => strapiFetch("/activities?populate=*"),
    infoTourist: () => strapiFetch("/visitor-infos?populate=*"),
    packages: () => strapiFetch("/package?populate[hero_packages][populate]=*&populate[whyPackages][populate]=*"),
    shabbatsAndHolidays: () => strapiFetch("/shabbat-and-holidays?populate=*"),
    shabbatsRegisterPrices: () => strapiFetch("/shabbat-pricings?populate=*"),
    shabbatBoxOptions: () => strapiFetch("/shabbat-boxes?populate[options][populate][variants]=*"),
    shabbatBoxSingle: () => strapiFetch("/shabbat-box-page?populate=*"),
    socialMediaLinks: () => strapiFetch("/site-config/?fields[0]=id&populate[social_media]=*"),
    copiesPages: () => strapiFetch("/content-page?populate[activities][populate]=*&populate[restaurants][populate]=*&populate[accommodations][populate]=*&populate[visitor_info][populate]=picture&populate[contact_page][populate]=picture&populate[donations][populate]=*"),
}