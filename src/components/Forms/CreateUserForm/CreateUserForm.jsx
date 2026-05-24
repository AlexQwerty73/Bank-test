import React from 'react';
import styles from './createUserForm.module.css';
import { useAddUserMutation } from '../../../store';
import { useNavigate } from 'react-router-dom';
import { saveToLocalStorage } from '../../../utils';
import { FormComponent } from '../../commons/FormComponent';

export const CreateUserForm = () => {
   const navigate = useNavigate();
   const [addUser] = useAddUserMutation();

   // FormComponent використовує react-hook-form — своя логіка стану тут зайва.
   // Отримуємо дані форми через onSubmit від react-hook-form.
   const onSubmit = async (formData) => {
      const response = await addUser({
         ...formData,
         createdAt: new Date().toISOString(),
         lastLogin: new Date().toISOString(),
         verified: false,
      });

      if (response.data?.id) {
         saveToLocalStorage('userId', response.data.id);
         navigate('/');
      }
   };

   return (
      <div className={styles.createUserForm}>
         <FormComponent
            inputs={['name', 'surname', 'email', 'password', 'address', 'phone']}
            onSubmit={onSubmit}
         />
      </div>
   );
};
