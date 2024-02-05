import React, { useState } from 'react';
import styles from './createCardForm.module.css';
import { generateCVV, generateCardNumber, generateExpiryDate } from '../../utils';

export const CreateCardForm = () => {
   const [formData, setFormData] = useState({
      userId: "",
      number: generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv: generateCVV(),
      pin: "",
      balance: 0,
      type: "",
      currency: "",
      history: []
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      // Ваш код для відправки даних на сервер або збереження в базу даних
   };

   return (
      <form className={styles.createCardForm} onSubmit={handleSubmit}>

         <label>
            PIN:
            <input
               type="text"
               name="pin"
               value={formData.pin}
               onChange={handleInputChange}
               required
            />
         </label>

         <label>
            Card Category:
            <select
               name="category"
               value={formData.category}
               onChange={handleInputChange}
               required
            >
               <option value="">Select Category</option>
               <option value="debit">Debit Card</option>
               <option value="credit">Credit Card</option>
            </select>
         </label>

         <label>
            Card Type:
            <select
               name="type"
               value={formData.type}
               onChange={handleInputChange}
               required
            >
               <option value="">Select Type</option>
               <option value="VISA">VISA</option>
               <option value="MASTERCARD">MASTERCARD</option>
            </select>
         </label>

         <label>
            Currency:
            <select
               name="currency"
               value={formData.currency}
               onChange={handleInputChange}
               required
            >
               <option value="">Select Currency</option>
               <option value="UAH">Ukrainian Hryvnia (UAH)</option>
               <option value="USD">US Dollar (USD)</option>
               <option value="EUR">Euro (EUR)</option>
            </select>
         </label>

         <button type="submit">Create Card</button>
      </form>
   );
};
