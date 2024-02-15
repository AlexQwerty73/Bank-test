export const validateForm = (formData) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!formData.email.match(emailRegex)) {
      alert('Please enter a valid email address');
      return false;
   }

   const phoneRegex = /^\d{10}$/;
   if (!formData.phone.match(phoneRegex)) {
      alert('Please enter a valid phone number');
      return false;
   }

   return true;
};