import React from 'react';
import styles from './ctaBanner.module.css';
import { Link } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';
import { useInView } from 'react-intersection-observer';

export const CtaBanner = () => {
   const userId  = loadFromLocalStorage('userId');
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

   return (
      <section className={`${styles.banner} ${inView ? styles.visible : ''}`} ref={ref}>
         <div className={styles.inner}>
            <p className={styles.eyebrow}>Ready to start?</p>
            <h2 className={styles.title}>Take control of your finances today</h2>
            <p className={styles.sub}>
               Open a free account in minutes. No fees, no paperwork.
            </p>
            <div className={styles.actions}>
               <Link
                  to={userId ? `/${userId}/transactions` : '/create-user'}
                  className={styles.btnPrimary}
               >
                  {userId ? 'Go to dashboard' : 'Open free account'}
               </Link>
               {!userId && (
                  <Link to="/login" className={styles.btnGhost}>
                     Sign in
                  </Link>
               )}
            </div>
         </div>
      </section>
   );
};
