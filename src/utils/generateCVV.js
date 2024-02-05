export const generateCVV = () => {
   return Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
};