import React from 'react';
import styles from './heroSection.module.css';
import { Link } from 'react-router-dom';
import { PhoneMockup } from './PhoneMockup';
import { loadFromLocalStorage } from '../../utils';

export const HeroSection = () => {
   const userId = loadFromLocalStorage('userId');

   return (
      <section className={styles.heroSection}>
         <div className={styles.heroContent}>
            <div className={styles.badge}>🏦 Modern Online Banking</div>
            <h1 className={styles.heroTitle}>
               Your money,<br />
               <span className={styles.heroAccent}>smarter.</span>
            </h1>
            <p className={styles.heroSub}>
               Open accounts in UAH, USD and EUR. Issue cards, track
               transactions and grow savings — all in one place.
            </p>

            <div className={styles.heroCtas}>
               <Link to={userId ? `/${userId}/transactions` : '/create-user'} className={styles.btnPrimary}>
                  {userId ? 'Go to dashboard' : 'Open free account'}
               </Link>
               {!userId && (
                  <Link to="/login" className={styles.btnGhost}>
                     Sign in
                  </Link>
               )}
            </div>

            <div className={styles.trustBadges}>
               <span>🔒 256-bit encryption</span>
               <span className={styles.dot}>·</span>
               <span>✅ No hidden fees</span>
               <span className={styles.dot}>·</span>
               <span>🕐 24/7 support</span>
            </div>
         </div>

         <div className={styles.heroImageContainer}>
            <PhoneMockup />
         </div>
      </section>
   );
};
