/**
 * Service for fetching Shabbat times from Hebcal.com API
 * Handles Shabbat candle lighting and havdalah times for Panama
 */

const HEBCAL_BASE_URL = 'https://www.hebcal.com/shabbat';
const PANAMA_GEONAME_ID = 3703443; // Panama City GeoNames ID
const DEFAULT_CANDLE_LIGHTING_OFFSET = 18; // minutes before sunset

/**
 * Fetches current Shabbat times from Hebcal API
 * @returns {Promise<{candleLighting: string, havdalah: string}>}
 */
export async function getShabbatTimes() {
    try {
        const params = new URLSearchParams({
            cfg: 'json',
            geonameid: PANAMA_GEONAME_ID,
            M: 'on', // Havdalah at nightfall
            b: DEFAULT_CANDLE_LIGHTING_OFFSET,
            leyning: 'off' // Disable Torah reading details for faster response
        });

        const url = `${HEBCAL_BASE_URL}?${params}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract candle lighting and havdalah times from the response
        const shabbatTimes = extractShabbatTimes(data.items);
        
        return shabbatTimes;

    } catch (error) {
        console.error('❌ Error fetching Shabbat times:', error);
        
        // Return fallback times if API fails
        return getFallbackShabbatTimes();
    }
}

/**
 * Extracts candle lighting and havdalah times from Hebcal API response
 * @param {Array} items - Array of Shabbat events from API
 * @returns {Object} Object with candleLighting and havdalah times
 */
function extractShabbatTimes(items) {
    const currentDate = new Date();
    const nextFriday = getNextFriday(currentDate);
    const nextSaturday = getNextSaturday(currentDate);

    let candleLighting = null;
    let havdalah = null;

    // Look for candle lighting time (usually on Friday)
    const candleLightingEvent = items.find(item => 
        item.category === 'candles' && 
        isSameDay(new Date(item.date), nextFriday)
    );

    // Look for havdalah time (usually on Saturday)
    const havdalahEvent = items.find(item => 
        item.category === 'havdalah' && 
        isSameDay(new Date(item.date), nextSaturday)
    );

    if (candleLightingEvent) {
        candleLighting = formatTime(candleLightingEvent.date);
    }

    if (havdalahEvent) {
        havdalah = formatTime(havdalahEvent.date);
    }

    return {
        candleLighting: candleLighting || "18:20", // fallback
        havdalah: havdalah || "19:12" // fallback
    };
}

/**
 * Gets the next Friday from the given date
 * @param {Date} date - Current date
 * @returns {Date} Next Friday
 */
function getNextFriday(date) {
    const result = new Date(date);
    const dayOfWeek = result.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    
    if (daysUntilFriday === 0 && result.getHours() >= 18) {
        // If it's Friday after 6 PM, get next Friday
        result.setDate(result.getDate() + 7);
    } else {
        result.setDate(result.getDate() + daysUntilFriday);
    }
    
    return result;
}

/**
 * Gets the next Saturday from the given date
 * @param {Date} date - Current date
 * @returns {Date} Next Saturday
 */
function getNextSaturday(date) {
    const result = new Date(date);
    const dayOfWeek = result.getDay();
    const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
    
    if (daysUntilSaturday === 0 && result.getHours() >= 20) {
        // If it's Saturday after 8 PM, get next Saturday
        result.setDate(result.getDate() + 7);
    } else {
        result.setDate(result.getDate() + daysUntilSaturday);
    }
    
    return result;
}

/**
 * Checks if two dates are the same day
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns {boolean}
 */
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

/**
 * Formats a date to HH:MM format in local timezone
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted time string
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Panama'
    });
}

/**
 * Returns fallback Shabbat times when API is unavailable
 * @returns {Object} Object with default candleLighting and havdalah times
 */
function getFallbackShabbatTimes() {
    return {
        candleLighting: "18:20",
        havdalah: "19:12"
    };
}