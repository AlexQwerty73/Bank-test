/**
 * Generates a Ukraine-style IBAN-like account number.
 * Format: UA + 2 check digits + 6-digit bank code + 16-digit account number
 * Total: 28 characters (displayed with spaces: UA28 3006 5000 XXXX XXXX XXXX)
 */
export const generateAccountNumber = (currency = '') => {
   const random = () => Math.floor(Math.random() * 9000000000000000 + 1000000000000000).toString();
   const digits = random().slice(0, 13);
   const suffix = currency ? currency.toUpperCase() : 'XXX';
   return `UA28300650${digits}${suffix}`;
};
