export const formatShabbatDate = (shabbat) => {
    // Check if shabbat is null or undefined first
    if (!shabbat) {
        return '';
    }
    
    if (!shabbat.startDate || !shabbat.endDate) {
        return shabbat.date || '';
    }
    
    try {
        // Parse the date-only parts directly from the "YYYY-MM-DD" strings.
        // Do NOT use `new Date(str).getDate()`: that parses as UTC midnight but
        // reads the day in the server's local time, shifting the day west of UTC.
        // A Shabbat window is a pure calendar date (no time/zone), so string
        // parsing keeps it stable on any server. (Punto 2 — TZ independence.)
        const parse = (s) => {
            const m = String(s).split('T')[0].match(/^(\d{4})-(\d{2})-(\d{2})$/);
            return m ? { year: m[1], month: m[2], day: m[3] } : null;
        };

        const start = parse(shabbat.startDate);
        const end = parse(shabbat.endDate);

        if (!start || !end) {
            return '';
        }

        // Keep the original convention: range days, with end's month/year.
        return `${start.day}-${end.day}/${end.month}/${end.year}`;
    } catch (error) {
        return '';
    }
};