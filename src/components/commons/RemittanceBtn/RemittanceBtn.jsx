import React from 'react';
import styles from './remittanceBtn.module.css';
import { Link } from 'react-router-dom';

export const RemittanceBtn = () => {
   return (
      <Link to='remittance'>
         <button className={styles.btn}>
            Remittance
         </button>
      </Link>
   );
};