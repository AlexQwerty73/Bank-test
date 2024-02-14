import React from 'react';
import { Link } from 'react-router-dom';
import styles from './CardCreationBlock.module.css';
import { Card, Img } from '../commons';
import { loadFromLocalStorage } from '../../utils';
import { useInView } from 'react-intersection-observer';

export const CardCreationBlock = () => {
   const userId = loadFromLocalStorage('userId');
   const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.5
   });

   return (
      <div className={styles.cardCreationBlock}>
         <div className={`${styles.left} ${inView ? styles.leftInView : ''}`} ref={ref}>
            <h2 className={styles.title}>Open a New Card Today!</h2>
            <p className={styles.description}>Unlock Exclusive Benefits and Features</p>
            <Link to={userId ? `/${userId}/create-card` : '/login'} className={styles.createCardButton}>
               Get Started
            </Link>
         </div>

         <div className={`${styles.right} ${inView ? styles.rightInView : ''}`} ref={ref}>
            <div className={styles.img}>
               <Img folder='home' img='cards-v4.png' />
            </div>
         </div>
      </div>
   );
};
