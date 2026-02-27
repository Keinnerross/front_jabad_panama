/**
 * Service for fetching Shabbat times from Hebcal.com API
 * Handles Shabbat candle lighting and havdalah times based on configured location
 */

import { getDefaultLocation } from './geoLocationService';

const HEBCAL_BASE_URL = 'https://www.hebcal.com/shabbat';
const DEFAULT_CANDLE_LIGHTING_OFFSET = 18; // minutes before sunset

/**
 * Fetches current Shabbat times from Hebcal API
 * @param {Object} locationConfig - Location configuration with geonameid and timezone
 * @param {number} locationConfig.geonameid - GeoNames ID for the city
 * @param {string} locationConfig.timezone - Timezone string (e.g., 'America/Panama')
 * @param {boolean} locationConfig.isReferential - If true, location is not configured
 * @returns {Promise<{candleLighting: string, havdalah: string, isReferential: boolean}>}
 */
export async function getShabbatTimes(locationConfig = null) {
    const location = locationConfig || getDefaultLocation();

    // If location is referential (not found), return fixed referential times
    if (location.isReferential || !location.geonameid) {
        return getReferentialShabbatTimes();
    }

    try {
        const params = new URLSearchParams({
            cfg: 'json',
            geonameid: location.geonameid,
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
        const shabbatTimes = extractShabbatTimes(data.items, location.timezone);

        return {
            ...shabbatTimes,
            isReferential: false
        };

    } catch (error) {
        console.error('❌ Error fetching Shabbat times:', error);

        // Return referential times if API fails
        return getReferentialShabbatTimes();
    }
}

/**
 * Extracts candle lighting and havdalah times from Hebcal API response
 * @param {Array} items - Array of Shabbat events from API
 * @param {string} timezone - Timezone string for formatting times
 * @returns {Object} Object with candleLighting and havdalah times
 */
function extractShabbatTimes(items, timezone = 'America/Panama') {
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
        candleLighting = formatTime(candleLightingEvent.date, timezone);
    }

    if (havdalahEvent) {
        havdalah = formatTime(havdalahEvent.date, timezone);
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
 * Formats a date to HH:MM format in the specified timezone
 * @param {string} dateString - ISO date string
 * @param {string} timezone - Timezone string (e.g., 'America/Panama')
 * @returns {string} Formatted time string
 */
function formatTime(dateString, timezone = 'America/Panama') {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: timezone
    });
}

/**
 * Returns referential Shabbat times when city is not configured or API fails
 * These are approximate times - actual times depend on location
 * @returns {Object} Object with referential candleLighting and havdalah times
 */
function getReferentialShabbatTimes() {
    return {
        candleLighting: "18:00",
        havdalah: "19:00",
        isReferential: true
    };
}

/**
 * Fetches upcoming Shabbat events (Parashiot and Holidays) from Hebcal API
 * @param {Object} locationConfig - Location configuration with geonameid and timezone
 * @param {number} locationConfig.geonameid - GeoNames ID for the city
 * @param {string} locationConfig.timezone - Timezone string (e.g., 'America/Panama')
 * @param {boolean} locationConfig.isReferential - If true, location is not configured
 * @returns {Promise<{events: Array, isReferential: boolean}>} Array of upcoming Shabbat events with formatted dates
 */
export async function getUpcomingShabbatEvents(locationConfig = null) {
    const location = locationConfig || getDefaultLocation();
    const isReferential = location.isReferential || !location.geonameid;

    // For referential locations, use a default geonameid just to get parasha names
    // (parasha names are the same regardless of location)
    const geonameidForApi = location.geonameid || 281184; // Jerusalem as fallback for parasha names

    try {
        const today = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 12); // Get events for next 12 months (1 year)

        const params = new URLSearchParams({
            cfg: 'json',
            v: '1',
            s: 'on', // Include Parashat ha-Shavuah
            maj: 'off', // Exclude major holidays
            min: 'off', // Exclude minor holidays
            geonameid: geonameidForApi,
            start: today.toISOString().split('T')[0],
            end: endDate.toISOString().split('T')[0],
            leyning: 'on' // Include Torah readings
        });

        const url = `https://www.hebcal.com/hebcal?${params}`;
        
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

        // Process and format events
        const events = processShabbatEvents(data.items);

        return {
            events,
            isReferential
        };

    } catch (error) {
        console.error('❌ Error fetching Shabbat events:', error);
        return {
            events: getFallbackShabbatEvents(),
            isReferential: true
        };
    }
}

/**
 * Processes and formats Shabbat events from Hebcal API
 * @param {Array} items - Raw items from Hebcal API
 * @returns {Array} Formatted events array
 */
function processShabbatEvents(items) {
    const events = [];
    const processedDates = new Set();
    const holidayGroups = new Map(); // For grouping multi-day holidays

    // First pass: collect and group holidays
    items.forEach(item => {
        // Only process Parashat and major holidays (using subcat field)
        if (item.category === 'parashat' || (item.category === 'holiday' && item.subcat === 'major')) {
            const eventDate = new Date(item.date);
            const dateKey = eventDate.toISOString().split('T')[0];
            
            if (item.category === 'holiday') {
                // Group multi-day holidays by base name
                let baseName = item.title
                    .replace(/\s+(I+|[IVX]+)(\s+\(.*?\))?$/, '') // Remove Roman numerals and (CH'M) etc
                    .replace(/^Erev\s+/, '') // Remove "Erev" prefix
                    .replace(/:\s+\d+\s+Candles?$/, '') // Remove Chanukah candle count
                    .replace(/\s+\(.*?\)$/, '') // Remove any parenthetical additions
                    .trim();
                
                // Special handling for certain holidays
                if (item.title.includes('Shmini Atzeret') || item.title.includes('Simchat Torah')) {
                    baseName = 'Shmini Atzeret & Simchat Torah';
                } else if (item.title.includes('Sukkot')) {
                    // Group all Sukkot days together
                    baseName = 'Sukkot';
                } else if (item.title.includes('Pesach') || item.title.includes('Passover')) {
                    // Group all Pesach days together
                    baseName = 'Pesach';
                } else if (item.title.includes('Chanukah')) {
                    // Group all Chanukah days together
                    baseName = 'Chanukah';
                } else if (item.title.includes('Rosh Hashana')) {
                    baseName = 'Rosh Hashana';
                }
                
                if (!holidayGroups.has(baseName)) {
                    holidayGroups.set(baseName, []);
                }
                holidayGroups.get(baseName).push({
                    date: eventDate,
                    dateKey: dateKey,
                    title: item.title,
                    hebrew: item.hebrew || '',
                    original: item
                });
            } else if (item.category === 'parashat' && !processedDates.has(dateKey)) {
                // Process Parashat immediately
                processedDates.add(dateKey);
                
                const friday = new Date(eventDate);
                friday.setDate(friday.getDate() - 1); // Parashat date is Saturday, get Friday
                
                const fridayDay = friday.getDate().toString().padStart(2, '0');
                const saturdayDay = eventDate.getDate().toString().padStart(2, '0');
                const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
                const year = eventDate.getFullYear();
                
                const formattedDate = `${fridayDay}-${saturdayDay}/${month}/${year}`;
                
                events.push({
                    id: `parashat-${dateKey}`,
                    title: item.title,
                    hebrew: item.hebrew || '',
                    date: item.date,
                    formattedDate: formattedDate,
                    category: 'parashat',
                    displayName: `${item.title} (${formattedDate})`,
                    // Incluir datos de lecturas si están disponibles
                    leyning: item.leyning || null,
                    hdate: item.hdate || null
                });
            }
        }
    });

    // Second pass: process grouped holidays
    holidayGroups.forEach((dates, baseName) => {
        if (dates.length === 0) return;
        
        // Sort dates
        dates.sort((a, b) => a.date - b.date);
        
        const firstDate = dates[0].date;
        const lastDate = dates[dates.length - 1].date;
        
        let formattedDate = '';
        
        if (dates.length === 1) {
            // Single day holiday
            const day = firstDate.getDate().toString().padStart(2, '0');
            const month = (firstDate.getMonth() + 1).toString().padStart(2, '0');
            const year = firstDate.getFullYear();
            formattedDate = `${day}/${month}/${year}`;
        } else {
            // Multi-day holiday - check if consecutive days
            const daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= dates.length) {
                // Consecutive days - show range
                const firstDay = firstDate.getDate().toString().padStart(2, '0');
                const lastDay = lastDate.getDate().toString().padStart(2, '0');
                const month = (firstDate.getMonth() + 1).toString().padStart(2, '0');
                const year = firstDate.getFullYear();
                
                if (firstDate.getMonth() === lastDate.getMonth()) {
                    formattedDate = `${firstDay}-${lastDay}/${month}/${year}`;
                } else {
                    // Spans multiple months
                    const lastMonth = (lastDate.getMonth() + 1).toString().padStart(2, '0');
                    formattedDate = `${firstDay}/${month}-${lastDay}/${lastMonth}/${year}`;
                }
            } else {
                // Non-consecutive days - list individually
                const firstDay = firstDate.getDate().toString().padStart(2, '0');
                const month = (firstDate.getMonth() + 1).toString().padStart(2, '0');
                const year = firstDate.getFullYear();
                formattedDate = `${firstDay}/${month}/${year}`;
            }
        }
        
        events.push({
            id: `holiday-${dates[0].dateKey}`,
            title: baseName,
            hebrew: dates[0].hebrew,
            date: dates[0].original.date,
            formattedDate: formattedDate,
            category: 'holiday',
            displayName: `${baseName} (${formattedDate})`
        });
    });

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return events;
}

/**
 * Fetches Shabbat times for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {Object} locationConfig - Location configuration with geonameid and timezone
 * @param {number} locationConfig.geonameid - GeoNames ID for the city
 * @param {string} locationConfig.timezone - Timezone string (e.g., 'America/Panama')
 * @returns {Promise<Object>} Object with candle lighting, havdalah, and other info
 */
export async function getShabbatTimesForDate(date, locationConfig = null) {
    const location = locationConfig || getDefaultLocation();
    const geonameidForApi = location.geonameid || 281184; // Jerusalem as fallback
    const timezoneForApi = location.timezone || 'Asia/Jerusalem';

    try {
        const targetDate = new Date(date);
        const friday = new Date(targetDate);

        // Adjust to get the Friday of that week
        const dayOfWeek = targetDate.getDay();
        if (dayOfWeek === 6) { // Saturday
            friday.setDate(friday.getDate() - 1);
        } else if (dayOfWeek !== 5) { // Not Friday
            const daysToFriday = (5 - dayOfWeek + 7) % 7;
            friday.setDate(friday.getDate() + daysToFriday);
        }

        // Get Saturday (end of Shabbat)
        const saturday = new Date(friday);
        saturday.setDate(saturday.getDate() + 1);

        const params = new URLSearchParams({
            cfg: 'json',
            geonameid: geonameidForApi,
            M: 'on',
            b: DEFAULT_CANDLE_LIGHTING_OFFSET,
            s: 'on', // Include Parashat
            leyning: 'on', // Include Torah readings
            start: friday.toISOString().split('T')[0],
            end: saturday.toISOString().split('T')[0] // Include Saturday for havdalah
        });

        // Use hebcal endpoint for specific dates
        const url = `https://www.hebcal.com/hebcal?${params}`;
        
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
        
        // Extract all relevant information
        const shabbatInfo = {
            candleLighting: null,
            havdalah: null,
            parashat: null,
            hebrew: null,
            hdate: null,
            torah: null,
            haftarah: null,
            maftir: null,
            memo: null
        };
        
        if (data.items) {
            data.items.forEach(item => {
                if (item.category === 'candles') {
                    shabbatInfo.candleLighting = formatTime(item.date, timezoneForApi);
                    shabbatInfo.memo = item.memo || null;
                } else if (item.category === 'havdalah') {
                    shabbatInfo.havdalah = formatTime(item.date, timezoneForApi);
                } else if (item.category === 'parashat') {
                    shabbatInfo.parashat = item.title;
                    shabbatInfo.hebrew = item.hebrew;
                    shabbatInfo.hdate = item.hdate;
                    if (item.leyning) {
                        shabbatInfo.torah = item.leyning.torah;
                        shabbatInfo.haftarah = item.leyning.haftarah;
                        shabbatInfo.maftir = item.leyning.maftir;
                    }
                } else if (item.category === 'mevarchim') {
                    shabbatInfo.mevarchim = item.title;
                    shabbatInfo.molad = item.memo;
                }
            });
        }
        
        return shabbatInfo;
        
    } catch (error) {
        console.error('❌ Error fetching Shabbat times for date:', error);
        return {
            candleLighting: null,
            havdalah: null,
            parashat: null,
            hebrew: null,
            hdate: null,
            torah: null,
            haftarah: null,
            maftir: null
        };
    }
}

/**
 * Returns fallback Shabbat events when API is unavailable
 * @returns {Array} Array with sample events
 */
function getFallbackShabbatEvents() {
    const today = new Date();
    const events = [];
    
    // Generate some sample Shabbat events as fallback
    for (let i = 0; i < 8; i++) {
        const friday = new Date(today);
        friday.setDate(friday.getDate() + (i * 7) + ((5 - today.getDay() + 7) % 7));
        
        const saturday = new Date(friday);
        saturday.setDate(saturday.getDate() + 1);
        
        const fridayDay = friday.getDate().toString().padStart(2, '0');
        const saturdayDay = saturday.getDate().toString().padStart(2, '0');
        const month = (friday.getMonth() + 1).toString().padStart(2, '0');
        const year = friday.getFullYear();
        
        events.push({
            id: `shabbat-${i}`,
            title: `Shabbat`,
            hebrew: 'שבת',
            date: saturday.toISOString(),
            formattedDate: `${fridayDay}-${saturdayDay}/${month}/${year}`,
            category: 'parashat',
            displayName: `Shabbat (${fridayDay}-${saturdayDay}/${month}/${year})`
        });
    }
    
    return events;
}