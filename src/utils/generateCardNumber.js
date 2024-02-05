export const generateCardNumber = () => {
   return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('');
};
