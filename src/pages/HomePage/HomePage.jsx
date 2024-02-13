import React from 'react';
import { Calculator, CardCreationBlock, ExchangeRate, FAQ, FeaturesSection, HeroSection, SecurityInfo } from '../../components';
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
               <SecurityInfo />
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
            <FAQ />
         </div>
      </div>
   );
};
