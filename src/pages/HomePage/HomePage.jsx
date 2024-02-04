import React from 'react';
import { CardCreationBlock, ExchangeRate, HeroSection } from '../../components';
import styles from './homePage.module.css';

export const HomePage = () => {
   return (
      <div className='homePage'>
         <HeroSection />
         <div className="container">
            <CardCreationBlock />
         </div>
         <div className="container">
            <ExchangeRate />
         </div>
      </div>
   );
};
