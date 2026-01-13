export const formatShabbatDate = (shabbat) => {
    // Check if shabbat is null or undefined first
    if (!shabbat) {
        return '';
    }
    
    if (!shabbat.startDate || !shabbat.endDate) {
        return shabbat.date || '';
    }
    
    try {
        const startDate = new Date(shabbat.startDate);
        const endDate = new Date(shabbat.endDate);
        
        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return '';
        }
        
        const startDay = startDate.getDate().toString().padStart(2, '0');
        const endDay = endDate.getDate().toString().padStart(2, '0');
        const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
        const year = endDate.getFullYear();
        
        return `${startDay}-${endDay}/${month}/${year}`;
    } catch (error) {
        return '';
    }
};