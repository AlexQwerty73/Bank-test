export const convertDateFormat = (inputDate) => {
   const dateParts = inputDate.split('-');
   const year = dateParts[0].substring(2);
   const month = dateParts[1];

   const outputDate = `${month}/${year}`;

   return outputDate;
}