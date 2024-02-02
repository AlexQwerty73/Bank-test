import React from 'react';
import { CardCreationBlock, ExchangeRate } from '../../components';
import styles from './homePage.module.css';

export const HomePage = () => {
   return (
      <div className='homePage'>
         <div className={styles.bg1}>
            <div className="container">
               <CardCreationBlock />
            </div>
         </div>
         <div className="container">
            <ExchangeRate />
         </div>
      </div>
   );
};
