export const findRecentData = (history, days) => {
   if (days === 'all') {
      return [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
   }

   const endDate = new Date();
   const startDate = new Date();
   startDate.setDate(endDate.getDate() - parseInt(days) + 1);

   const recentData = history.filter(day => {
      const dayDate = new Date(day.date);
      return dayDate >= startDate && dayDate <= endDate;
   });

   return recentData.sort((a, b) => new Date(a.date) - new Date(b.date));
};
