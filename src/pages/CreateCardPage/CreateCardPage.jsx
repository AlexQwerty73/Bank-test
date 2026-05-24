import React from 'react';
import { CreateCardForm } from '../../components/Forms/CreateCardForm';
import styles from './createCardPage.module.css';

export const CreateCardPage = () => (
   <div className={styles.page}>
      <div className="container">
         <div className={styles.inner}>
            <h1 className={styles.title}>Issue new card</h1>
            <p className={styles.subtitle}>
               Cards are linked to an existing account. Each account supports up to its currency limit.
            </p>
            <CreateCardForm />
         </div>
      </div>
   </div>
);
