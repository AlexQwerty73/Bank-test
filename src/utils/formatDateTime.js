export const formatDateTime= (dateTimeString) =>{
   const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
   const dateTime = new Date(dateTimeString);
   return dateTime.toLocaleDateString('en-US', options);
 }