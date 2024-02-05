export const generateExpiryDate = () => {
   const currentDate = new Date();
   const expiryYear = currentDate.getFullYear() + 5;
   const expiryDate = `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${expiryYear}`;

   return expiryDate;
};