export const convertToNumberCartFormat = (number) => {
   return number.split('').map((char, i) => char + `${(i + 1) % 4 === 0 && i + 1 !== 16 ? ' ' : ''}`);
}