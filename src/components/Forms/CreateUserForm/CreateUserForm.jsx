import React, { useState } from 'react';
import styles from './createUserForm.module.css';
import { validateForm } from './validateForm';
import { useAddUserMutation } from '../../../redux';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage } from '../../../utils';
import { FormComponent } from '../.././commons/FormComponent'; 

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
      <div className={styles.createUserForm}>
         <FormComponent
            inputs={['name', 'surname', 'email', 'password', 'address', 'phone']}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
         />
      </div>
   );
};
