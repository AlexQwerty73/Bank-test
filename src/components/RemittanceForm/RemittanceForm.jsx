import React from 'react';
import styles from './remittanceForm.module.css';
import { FormComponent } from '../commons';

export const RemittanceForm = () => {

   const onSubmit = data => {
      console.log(data);
   }

   return (
      <div className={styles.remittanceForm}>

         <FormComponent inputs={['number', 'amount', 'usercards']} onSubmit={onSubmit} />

      </div>
   );
};
