/**
 * Utility functions to check event availability based on show_repeat_control settings
 */

/**
 * Check if a custom event is currently available
 * @param {Object} event - Event object from Strapi
 * @returns {boolean} - Whether the event is currently available
 */
export function isEventAvailable(event) {
    // If no repeat control, event is always available
    if (!event.show_repeat_control) return true;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentDay = now.getDay(); // 0=Sunday, 1=Monday, etc.
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const { 
        repeat_mode, 
        date, 
        start_date, 
        end_date, 
        all_day, 
        hour_start, 
        hour_end, 
        weekly_repeat 
    } = event.show_repeat_control;

    switch (repeat_mode) {
        case 'once':
            if (!date) return true;
            const eventDate = new Date(date + 'T00:00:00');
            const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

            // Check if event is today
            if (today.getTime() !== eventDateOnly.getTime()) return false;

            // Check time if not all day
            if (all_day) return true;

            if (hour_start && hour_end) {
                const [startHour, startMin] = hour_start.split(':').map(Number);
                const [endHour, endMin] = hour_end.split(':').map(Number);
                const currentTotalMinutes = currentHour * 60 + currentMinutes;
                const startMinutes = startHour * 60 + startMin;
                const endMinutes = endHour * 60 + endMin;

                return currentTotalMinutes >= startMinutes && currentTotalMinutes <= endMinutes;
            }
            return true;

        case 'range':
            if (!start_date || !end_date) return true;
            const startDate = new Date(start_date + 'T00:00:00');
            const endDate = new Date(end_date + 'T00:00:00');
            const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

            // Check if today is within range
            if (today < startDateOnly || today > endDateOnly) return false;

            // Check time if not all day
            if (all_day) return true;

            if (hour_start && hour_end) {
                const [startHour, startMin] = hour_start.split(':').map(Number);
                const [endHour, endMin] = hour_end.split(':').map(Number);
                const currentTotalMinutes = currentHour * 60 + currentMinutes;
                const startMinutes = startHour * 60 + startMin;
                const endMinutes = endHour * 60 + endMin;

                return currentTotalMinutes >= startMinutes && currentTotalMinutes <= endMinutes;
            }
            return true;

        case 'weekly':
            if (!weekly_repeat) return true;

            // Map current day to day name
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const currentDayName = dayNames[currentDay];

            // Check if current day is enabled
            if (!weekly_repeat[currentDayName]) return false;

            // Check time for specific day
            const dayAllDay = weekly_repeat[`${currentDayName.toLowerCase()}_all_day`];
            if (!dayAllDay) {
                const dayStart = weekly_repeat[`${currentDayName.toLowerCase()}_hour_start`];
                const dayEnd = weekly_repeat[`${currentDayName.toLowerCase()}_hour_end`];

                if (dayStart && dayEnd) {
                    const [startHour, startMin] = dayStart.split(':').map(Number);
                    const [endHour, endMin] = dayEnd.split(':').map(Number);
                    const currentTotalMinutes = currentHour * 60 + currentMinutes;
                    const startMinutes = startHour * 60 + startMin;
                    const endMinutes = endHour * 60 + endMin;

                    return currentTotalMinutes >= startMinutes && currentTotalMinutes <= endMinutes;
                }
            }
            return true;

        case 'always':
            // Event is always available, no date or time checks needed
            return true;

        default:
            return true;
    }
}

/**
 * Filter available events from a list
 * @param {Array} events - Array of events from Strapi
 * @returns {Array} - Array of currently available events
 */
export function getAvailableEvents(events) {
    if (!events || !Array.isArray(events)) return [];
    return events.filter(event => isEventAvailable(event));
}