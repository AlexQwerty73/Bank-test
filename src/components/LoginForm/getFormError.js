export const getFormError = (email, password, userData, isPassworrOk) => {
   if (!email || !password) {
      if (!email && !password) {
         return 'Password input and email input are empty';
      } else if (!email) {
         return 'Email input is empty';
      } else if (!password) {
         return 'Password input is empty';
      }
   } else if (!userData) {
      return 'User not found';
   } else if (!isPassworrOk) {
      return 'Wrong password';
   }
}