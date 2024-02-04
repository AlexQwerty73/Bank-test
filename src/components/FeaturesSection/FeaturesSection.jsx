import React from 'react';
import styles from './FeaturesSection.module.css';

export const FeaturesSection = () => {
   return (
      <section className={styles.featuresSection}>
         <div className={styles.feature}>
            <div className={styles.featureIcon}>Image</div>
            <h3>Convenient Service</h3>
            <p>Our services are always at your convenience.</p>
         </div>

         <div className={styles.feature}>
            <div className={styles.featureIcon}>Image</div>
            <h3>Data Security</h3>
            <p>We guarantee the confidentiality and security of your financial data.</p>
         </div>

         <div className={styles.feature}>
            <div className={styles.featureIcon}>Image</div>
            <h3>Flexibility</h3>
            <p>Choose from various financial products and services to meet your needs.</p>
         </div>
      </section>
   );
};