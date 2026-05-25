import React from 'react';
import { useGetExchangeRateApiQuery } from '../../store';
import { ExchangeRatesSection } from '../../components';
import styles from './exchangeRatePage.module.css';

/* ── Skeleton ── */
const ExchangeRateSkeleton = () => (
   <div className={styles.skPage}>
      <div className="container">
         <div className={styles.skTitleRow}>
            <div className={`${styles.sk} ${styles.skTitle}`} />
            <div className={`${styles.sk} ${styles.skBtn}`} />
         </div>

         <div className={styles.skGrid}>
            {[...Array(6)].map((_, i) => (
               <div key={i} className={styles.skCard}>
                  <div className={`${styles.sk} ${styles.skFlag}`} />
                  <div className={`${styles.sk} ${styles.skPairName}`} />
                  <div className={`${styles.sk} ${styles.skRate}`} />
                  <div className={`${styles.sk} ${styles.skDelta}`} />
               </div>
            ))}
         </div>

         <div className={styles.skDetail} />
      </div>
   </div>
);

/* ── Page ── */
export const ExchangeRatePage = () => {
   const { data: exchangeRates = [], isLoading } = useGetExchangeRateApiQuery();

   if (isLoading) return <ExchangeRateSkeleton />;

   return (
      <section className='exchangeRatePage'>
         <ExchangeRatesSection data={exchangeRates} />
      </section>
   );
};
