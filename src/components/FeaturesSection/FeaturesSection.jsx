import React from 'react';
import styles from './FeaturesSection.module.css';
import { Img } from '../commons';
import { useInView } from 'react-intersection-observer';

const FEATURES = [
   { title: 'Convenient Service',      img: 'service.png' },
   { title: 'Data Security',           img: 'security.png' },
   { title: 'Flexibility',             img: 'flexibility.png' },
   { title: '24/7 Customer Support',   img: 'support.png' },
   { title: 'Mobile Banking',          img: 'mobile.png' },
   { title: 'Financial Planning Tools', img: 'planning.png' },
];

const FeatureItem = ({ title, img }) => {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.7 });

   return (
      <div className={`${styles.feature} ${inView ? styles.visible : ''}`} ref={ref}>
         <div className={styles.featureContent}>
            <div className={styles.featureIcon}>
               <Img folder="featuresSection" img={img} alt={title} />
            </div>
            <h3 className={styles.h3}>{title}</h3>
         </div>
      </div>
   );
};

export const FeaturesSection = () => (
   <section className={styles.featuresSection}>
      {FEATURES.map((feature) => (
         <FeatureItem key={feature.img} title={feature.title} img={feature.img} />
      ))}
   </section>
);
