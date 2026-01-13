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

/** Endpoints - moved inside functions to avoid server component initialization issues*/


export async function strapiFetch(endpoint) {
    const { STRAPI_BASE_URL, STRAPI_TOKEN } = getEnvVars();


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
        let url;
        if (endpoint.includes('populate')) {
            url = cleanUrl(STRAPI_BASE_URL, `/api${endpoint}`);
        } else {
            const separator = endpoint.includes('?') ? '&' : '?';
            url = cleanUrl(STRAPI_BASE_URL, `/api${endpoint}${separator}populate=*`);
        }

        const response = await fetch(url, {
            method: "GET",
            headers,
            // next: { revalidate: 300 } 
            cache: 'no-cache'
            // ISR: Revalida cada 5 minutos
        });


        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json()
        const data = json.data; // <--- directo

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
            // next: { revalidate: 60 } // ISR: Revalida cada 5 minutos
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
    singleHotel: (id, populate) => strapiFetchById("/hotels", id, populate),

    activities: () => strapiFetch("/activities?populate=*"),
    singleActivity: (id, populate) => strapiFetchById("/activities", id, populate),

    infoTourist: () => strapiFetch("/visitor-infos?populate=*"),
    packages: () => strapiFetch("/package?populate[hero_packages][populate]=*&populate[whyPackages][populate]=*"),

    //Esta de acá es la que llama los eventos, su nombre debe ser cambiado a Custom Events
    shabbatsAndHolidays: () => strapiFetch("/shabbat-and-holidays?populate[cover_picture]=true&populate[show_repeat_control][populate]=*&populate[date_event][populate]=*&populate[category_menu][populate][option][populate]=*&populate[announce][populate]=*"),

    pwywSiteConfig: () => strapiFetch("/platform-setting?fields=pay_wy_want_reservations,pay_wy_want_shabbat_box"),

    shabbatRegisterSingleReservation: () => strapiFetch("/reservations-shabbat-page?populate=*"),
    shabbatsAndHolidaysPage: () => strapiFetch("/shabbat-and-holidays-page?populate[register_for_meal_section][populate]=*&populate[shabbat_box_section][populate]=*"),
    shabbatsRegisterPrices: () => strapiFetch("/shabbat-pricings?populate=*"),
    shabbatBoxOptions: () => strapiFetch("/shabbat-boxes?populate[options][populate][variants]=*"),
    shabbatBoxSingle: () => strapiFetch("/shabbat-box-page?populate=*"),
    socialMediaLinks: () => strapiFetch("/site-config/?fields[0]=id&populate[social_media]=*"),
    copiesPages: () => strapiFetch("/content-page?populate[activities][populate]=*&populate[restaurants][populate]=*&populate[accommodations][populate]=*&populate[visitor_info][populate]=picture&populate[contact_page][populate]=picture&populate[donations][populate]=*"),
    copiesPages: () => strapiFetch("/content-page?populate[activities][populate]=*&populate[restaurants][populate]=*&populate[accommodations][populate]=*&populate[visitor_info][populate]=picture&populate[contact_page][populate]=picture&populate[donations][populate]=*"),
    termsAndConditions: () => strapiFetch("/content-page?populate[terms_and_conditions][populate]=*"),
    privacyPolicy: () => strapiFetch("/content-page?populate[privacy_policy][populate]=*"),


    // Este endpoint es el que trae la configuracion de algunas vistas de personalizacion que controlamos nosotros como proovedores de la plataforma,
    // Por ahora solo controla:
    // PWYW, PACKAGES, SHABBATBOX

    platformSettings: () => strapiFetch("/platform-setting?populate=*"),

}