import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CardCreationBlock.module.css';
import { Card, Img } from '../commons';
import { loadFromLocalStorage } from '../../utils';

export const CardCreationBlock = () => {
   const userId = loadFromLocalStorage('userId');

   const card = {
      number: 'XXXXXXXXXXXXXXXX',
      cvv: 'XXX',
      currency: 'USD',
      type: 'VISA',
      expiryDate: 'XXXX-XX-XX'
   };

   return (
      <div className={styles.cardCreationBlock}>
         <div className={styles.left}>
            <h2 className={styles.title}>Open a New Card Today!</h2>
            <p className={styles.description}>Unlock Exclusive Benefits and Features</p>
            <Link to={userId ? `/${userId}/create-card` : '/login'} className={styles.createCardButton}>
               Get Started
            </Link>
         </div>

         <div className={styles.right}>
            <div className={styles.img}>
               <Img folder='home' img='cards-v4.png' />
            </div>
         </div>
      </div>
   );
};
