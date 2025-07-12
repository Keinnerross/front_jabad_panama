/**
 * Centralized service for Strapi v5 API
 * Handles fetches, populate queries and base configuration
 */

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;


/**
* Endpoints   
*/
const siteConfigEndpoint = "/site-config?populate=*"
const aboutEndpoint = "/about-us?populate[about_page][populate][pictures][populate]=*"
const aboutHomeEndpoint = "/about-us?populate[home_about][populate][item_list]=true&populate[home_about][populate][pictures]=true"
const restaurantsEndpoint = "/Restaurants?populate=*"
const singleRestaurantEndpoint = "/restaurants"
const hotelsEndpoint = "/hotels?populate=*"
const activitiesEndpoint = "/activities?populate=*"
const infoTouristEndpoint = "/visitor-infos?populate=*"





export async function strapiFetch(endpoint) {
    try {
        const headers = {};
        if (STRAPI_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }

        // Si ya tiene populate, lo usa. Si no, agrega populate=*
        const url = endpoint.includes('populate')
            ? `${STRAPI_BASE_URL}/api${endpoint}`
            : `${STRAPI_BASE_URL}/api${endpoint}?populate=*`;

        /*   console.log('🚀 Fetching:', url); */

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

        /*    console.log('✅ Response:', data) */
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
    try {
        const headers = {};
        if (STRAPI_TOKEN) {
            headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;
        }

        // Construye URL con ID
        const url = !populate
            ? `${STRAPI_BASE_URL}/api${endpoint}/${id}`
            : `${STRAPI_BASE_URL}/api${endpoint}/${id}?populate=*`;

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



/* export const api = {
    siteConfig() { return strapiFetch(siteConfigEndpoint) },
    aboutPage() { return strapiFetch(aboutEndpoint) },
    homeAbout() { return strapiFetch(aboutHomeEndpoint) },
    restaurants() { return strapiFetch(restaurantsEndpoint) },
    singleRestaurant(id, populate) { return strapiFetchById(singleRestaurantEndpoint, id, populate) },
    hotels() { return strapiFetch(hotelsEndpoint) },
    activities() { return strapiFetch(activitiesEndpoint) },
    infoTourist() { return strapiFetch(infoTouristEndpoint) },

}
 */


export const api = {
    siteConfig: () => strapiFetch(siteConfigEndpoint),
    aboutPage: () => strapiFetch(aboutEndpoint),
    homeAbout: () => strapiFetch(aboutHomeEndpoint),
    restaurants: () => strapiFetch(restaurantsEndpoint),
    singleRestaurant: (id, populate) => strapiFetchById(singleRestaurantEndpoint, id, populate),
    hotels: () => strapiFetch(hotelsEndpoint),
    activities: () => strapiFetch(activitiesEndpoint),
    infoTourist: () => strapiFetch(infoTouristEndpoint),
}




