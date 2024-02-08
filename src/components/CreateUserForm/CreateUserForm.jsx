import React, { useState } from 'react';
import styles from './createUserForm.module.css';
import { validateForm } from './validateForm';
import { useAddUserMutation } from '../../redux';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage } from '../../utils';

export const CreateUserForm = () => {
   const navigate = useNavigate();
   const [addUser] = useAddUserMutation();
   const [formData, setFormData] = useState({
      name: "",
      surname: "",
      email: "",
      password: "",
      address: "",
      phone: "",
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (validateForm(formData)) {
         const response = await addUser({
            ...formData,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
         });

         const userId = response.data.id;
         saveToLocalStorage('userId', userId);
         navigate('/');
      }
   };

   return (
      <form className={styles.createForm} onSubmit={handleSubmit}>
         <label className={styles.label}>
            Name:
            <input
               className={styles.input}
               type="text"
               name="name"
               value={formData.name}
               onChange={handleInputChange}
               required
            />
         </label>

         <label className={styles.label}>
            Surname:
            <input
               className={styles.input}
               type="text"
               name="surname"
               value={formData.surname}
               onChange={handleInputChange}
               required
            />
         </label>

         <label className={styles.label}>
            Email:
            <input
               className={styles.input}
               type="email"
               name="email"
               value={formData.email}
               onChange={handleInputChange}
               required
            />
         </label>

         <label className={styles.label}>
            Password:
            <input
               className={styles.input}
               type="password"
               name="password"
               value={formData.password}
               onChange={handleInputChange}
               required
            />
         </label>

         <label className={styles.label}>
            Address:
            <input
               className={styles.input}
               type="text"
               name="address"
               value={formData.address}
               onChange={handleInputChange}
               required
            />
         </label>

         <label className={styles.label}>
            Phone:
            <input
               className={styles.input}
               type="tel"
               name="phone"
               value={formData.phone}
               onChange={handleInputChange}
               required
            />
         </label>

         <button className={styles.button} type="submit">Create User</button>
      </form>
   );
};
