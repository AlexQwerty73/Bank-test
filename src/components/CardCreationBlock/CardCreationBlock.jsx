import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CardCreationBlock.module.css';
import { Card, Img } from '../commons';
import { loadFromLocalStorage } from '../../utils';
import { useInView } from 'react-intersection-observer';

export const CardCreationBlock = () => {
   const userId = loadFromLocalStorage('userId');
   // Один ref на батьківський контейнер — обидві частини анімуються разом
   const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.3,
   });

   return (
      <div className={styles.cardCreationBlock} ref={ref}>
         <div className={`${styles.left} ${inView ? styles.leftInView : ''}`}>
            <h2 className={styles.title}>Open a New Card Today!</h2>
            <p className={styles.description}>Unlock Exclusive Benefits and Features</p>
            <Link to={userId ? `/${userId}/create-card` : '/login'} className={styles.createCardButton}>
               Get Started
            </Link>
         </div>

         <div className={`${styles.right} ${inView ? styles.rightInView : ''}`}>
            <div className={styles.img}>
               <Img folder='home' img='cards-v4.png' />
            </div>
         </div>
      </div>
   );
};
