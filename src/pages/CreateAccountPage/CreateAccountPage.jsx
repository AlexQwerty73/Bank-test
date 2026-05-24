import React from 'react';
import { CreateAccountForm } from '../../components/Forms/CreateAccountForm/CreateAccountForm';
import styles from './createAccountPage.module.css';

export const CreateAccountPage = () => (
   <div className={styles.page}>
      <div className="container">
         <div className={styles.inner}>
            <h1 className={styles.title}>Open new account</h1>
            <p className={styles.subtitle}>
               Each account is in a single currency. You can hold UAH, EUR and USD simultaneously.
            </p>
            <CreateAccountForm />
         </div>
      </div>
   </div>
);
