import React from 'react';
import styles from './FeaturesSection.module.css';
import { Img } from '../commons';

export const FeaturesSection = () => {
   const features = [
      { title: 'Convenient Service', img: 'service.png' },
      { title: 'Data Security', img: 'security.png' },
      { title: 'Flexibility', img: 'flexibility.png' },
      { title: '24/7 Customer Support', img: 'support.png' },
      { title: 'Mobile Banking', img: 'mobile.png' },
      { title: 'Financial Planning Tools', img: 'planning.png' },
   ];

   return (
      <section className={styles.featuresSection}>
         {features.map((feature, index) => (
            <div className={styles.feature} key={index}>
               <div className={styles.featureContent}>
                  <div className={styles.featureIcon}>
                     <Img folder='featuresSection' img={feature.img} />
                  </div>
                  <h3 className={styles.h3}>{feature.title}</h3>
               </div>
            </div>
         ))}
      </section>
   );
};