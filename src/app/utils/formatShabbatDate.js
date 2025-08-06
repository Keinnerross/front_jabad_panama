export const formatShabbatDate = (shabbat) => {
    // Check if shabbat is null or undefined first
    if (!shabbat) {
        return '';
    }
    
    if (!shabbat.startDate || !shabbat.endDate) {
        return shabbat.date || '';
    }
    
    const startDate = new Date(shabbat.startDate);
    const endDate = new Date(shabbat.endDate);
    
    const startDay = startDate.getUTCDate().toString().padStart(2, '0');
    const endDay = endDate.getUTCDate().toString().padStart(2, '0');
    const month = (endDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = endDate.getUTCFullYear();
    
    return `${startDay}-${endDay}/${month}/${year}`;
};