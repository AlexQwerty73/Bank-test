import React, { useState } from 'react';
import styles from './createUserForm.module.css';
import { validateForm } from './validateForm';
import { useAddUserMutation } from '../../redux';

export const CreateUserForm = () => {
   const [addUser] = useAddUserMutation();
   const [formData, setFormData] = useState({
      name: "",
      surname: "",
      email: "",
      password: "",
      address: "",
      phone: "",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      if (validateForm(formData)) {
         addUser(formData);
      }
   };

   return (
      <form className={styles.createUserForm} onSubmit={handleSubmit}>
         <label>
            Name:
            <input
               type="text"
               name="name"
               value={formData.name}
               onChange={handleInputChange}
               required
            />
         </label>

         <label>
            Surname:
            <input
               type="text"
               name="surname"
               value={formData.surname}
               onChange={handleInputChange}
               required
            />
         </label>

         <label>
            Email:
            <input
               type="email"
               name="email"
               value={formData.email}
               onChange={handleInputChange}
               required
            />
         </label>

         <label>
            Password:
            <input
               type="password"
               name="password"
               value={formData.password}
               onChange={handleInputChange}
               required
            />
         </label>

         <label>
            Address:
            <input
               type="text"
               name="address"
               value={formData.address}
               onChange={handleInputChange}
               required
            />
         </label>

         <label>
            Phone:
            <input
               type="tel"
               name="phone"
               value={formData.phone}
               onChange={handleInputChange}
               required
            />
         </label>

         <button type="submit">Create User</button>
      </form>
   );
};
