import React from 'react';
import { Calculator, CardCreationBlock, ExchangeRate, FeaturesSection, HeroSection } from '../../components';
import styles from './homePage.module.css';

export const HomePage = () => {
   return (
      <div className='homePage'>
         <div className={styles.bg}>
            <div className="container">
               <HeroSection />
            </div>
         </div>

         <div className={styles.bg1}>
            <div className="container">
               <FeaturesSection />
            </div>
         </div>

         <div className={styles.bg2}>
            <div className="container">
               <Calculator />
            </div>
         </div>

         <div className="container">
            <CardCreationBlock />
            <ExchangeRate />
         </div>
      </div>
   );
};
