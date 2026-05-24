export const generateExpiryDate = () => {
   const currentDate = new Date();
   const expiryYear = currentDate.getFullYear() + 5;
   const expiryMonth = currentDate.getMonth() + 1; // 0-based → 1-based

   // Останній день місяця через Date(year, month+1, 0)
   const lastDay = new Date(expiryYear, expiryMonth, 0).getDate();

   return `${expiryYear}-${String(expiryMonth).padStart(2, '0')}-${lastDay}`;
};
