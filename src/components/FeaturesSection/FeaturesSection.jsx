// FeaturesSection.jsx
import React from 'react';
import styles from './FeaturesSection.module.css';
import { Img } from '../commons';

export const FeaturesSection = () => {
   return (
      <section className={styles.featuresSection}>
         <div className={styles.featureRow}>
            <div className={styles.feature}>
               <div className={styles.featureContent}>
                  <div className={styles.featureIcon}>
                     <Img folder='featuresSection' img='service.png' />
                  </div>
                  <h3>Convenient Service</h3>
               </div>
            </div>

            <div className={styles.feature}>
               <div className={styles.featureContent}>
                  <div className={styles.featureIcon}>
                     <Img folder='featuresSection' img='security.png' />
                  </div>
                  <h3>Data Security</h3>
               </div>
            </div>
         </div>

         <div className={styles.featureRow}>
            <div className={styles.feature}>
               <div className={styles.featureContent}>
                  <div className={styles.featureIcon}>
                     <Img folder='featuresSection' img='flexibility.png' />
                  </div>
                  <h3>Flexibility</h3>
               </div>
            </div>
         </div>
      </section>
   );
};
