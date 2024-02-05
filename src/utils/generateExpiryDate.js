export const generateExpiryDate = () => {
   const currentDate = new Date();
   const expiryYear = currentDate.getFullYear() + 5;
   const expiryMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
   const expiryDate = `${expiryYear}-${expiryMonth}-31`;

   return expiryDate;
};
