import React from 'react';
import { CardCreationBlock, ExchangeRate, FeaturesSection, HeroSection } from '../../components';
import styles from './homePage.module.css';

export const HomePage = () => {
   return (
      <div className='homePage'>
         <HeroSection />

         <div className={styles.bg1}>
            <div className="container">
               <FeaturesSection />
            </div>
         </div>

         <div className="container">
            <CardCreationBlock />
            <ExchangeRate />
         </div>
      </div>
   );
};
