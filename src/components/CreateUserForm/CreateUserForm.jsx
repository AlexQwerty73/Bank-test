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
      setFormData(prevData => ({
         ...prevData,
         [name]: value
      }));
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
         {Object.entries(formData).map(([fieldName, fieldValue]) => (
            <label key={fieldName} className={styles.label}>
               {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}:
               <input
                  className={styles.input}
                  type={fieldName === 'password' ? 'password' : 'text'}
                  name={fieldName}
                  value={fieldValue}
                  onChange={handleInputChange}
                  required
               />
            </label>
         ))}
         <button className={styles.button} type="submit">Create User</button>
      </form>
   );
};
