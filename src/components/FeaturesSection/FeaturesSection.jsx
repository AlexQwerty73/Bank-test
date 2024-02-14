import React from 'react';
import styles from './FeaturesSection.module.css';
import { Img } from '../commons';
import { useInView } from 'react-intersection-observer';

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
            <FeatureItem key={index} title={feature.title} img={feature.img} />
         ))}
      </section>
   );
};

const FeatureItem = ({ title, img }) => {
   const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: .7
   });

   return (
      <div className={`${styles.feature} ${inView ? styles.visible : ''}`} ref={ref}>
         <div className={`${styles.featureContent} `}>
            <div className={styles.featureIcon}>
               <Img folder='featuresSection' img={img} />
            </div>
            <h3 className={styles.h3}>{title}</h3>
         </div>
      </div>
   );
};
