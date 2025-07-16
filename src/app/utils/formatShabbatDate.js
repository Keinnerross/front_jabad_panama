export const formatShabbatDate = (shabbat) => {
    if (!shabbat.startDate || !shabbat.endDate) {
        return shabbat.date || '';
    }
    
    const startDate = new Date(shabbat.startDate);
    const endDate = new Date(shabbat.endDate);
    
    const startDay = startDate.getDate().toString().padStart(2, '0');
    const endDay = endDate.getDate().toString().padStart(2, '0');
    const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
    const year = endDate.getFullYear();
    
    return `${startDay}-${endDay}/${month}/${year}`;
};