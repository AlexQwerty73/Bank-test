import React from 'react';
import {
   Calculator,
   CardCreationBlock,
   CtaBanner,
   ExchangeRate,
   FAQ,
   FeaturesSection,
   HeroSection,
   HowItWorks,
   StatsStrip,
   Testimonials,
} from '../../components';
import styles from './homePage.module.css';

export const HomePage = () => {
   return (
      <div className='homePage'>

         {/* ── Hero (dark gradient) ── */}
         <div className={styles.bgHero}>
            <div className="container">
               <HeroSection />
            </div>
         </div>

         {/* ── Stats strip — floats over the border of Hero / white ── */}
         <div className={styles.bgLight}>
            <div className="container">
               <StatsStrip />
               <HowItWorks />
               <FeaturesSection />
            </div>
         </div>

         {/* ── Calculator (soft blue) ── */}
         <div className={styles.bgBlue}>
            <div className="container">
               <Calculator />
            </div>
         </div>

         {/* ── Cards CTA + Exchange Rate (white) ── */}
         <div className={styles.bgLight2}>
            <div className="container">
               <CardCreationBlock />
               <ExchangeRate />
            </div>
         </div>

         {/* ── Testimonials (very light grey) ── */}
         <div className={styles.bgGrey}>
            <div className="container">
               <Testimonials />
            </div>
         </div>

         {/* ── FAQ + Final CTA (white) ── */}
         <div className={styles.bgLight2}>
            <div className="container">
               <FAQ />
               <CtaBanner />
            </div>
         </div>

      </div>
   );
};
