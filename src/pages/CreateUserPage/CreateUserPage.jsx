import React from 'react';
import { CreateUserForm } from '../../components';
import styles from './createUserPage.module.css';

export const CreateUserPage = () => {
   return (
      <div className={styles.createUserPage}>
         <CreateUserForm />
      </div>
   );
};