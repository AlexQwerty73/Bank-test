import React from 'react';
import styles from './FeaturesSection.module.css';
import { Img } from '../commons';
import { useInView } from 'react-intersection-observer';

const FEATURES = [
   {
      title: 'Convenient Service',
      img:   'service.png',
      desc:  'Manage accounts, cards and transfers from any device — no visits to a branch required.',
   },
   {
      title: 'Data Security',
      img:   'security.png',
      desc:  '256-bit encryption, two-factor authentication and round-the-clock fraud monitoring.',
   },
   {
      title: 'Flexibility',
      img:   'flexibility.png',
      desc:  'Open accounts in UAH, USD or EUR. Issue debit and credit cards whenever you need them.',
   },
   {
      title: '24/7 Customer Support',
      img:   'support.png',
      desc:  'Our support team is always available — chat, email or phone, at any hour of the day.',
   },
   {
      title: 'Mobile Banking',
      img:   'mobile.png',
      desc:  'Access your full banking dashboard on any screen size — fully responsive and touch-friendly.',
   },
   {
      title: 'Financial Planning Tools',
      img:   'planning.png',
      desc:  'Built-in deposit calculator, exchange rate tracker and transaction history with filters.',
   },
];

const FeatureItem = ({ title, img, desc }) => {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

   return (
      <div className={`${styles.feature} ${inView ? styles.visible : ''}`} ref={ref}>
         <div className={styles.featureContent}>
            <div className={styles.featureIcon}>
               <Img folder="featuresSection" img={img} alt={title} />
            </div>
            <h3 className={styles.h3}>{title}</h3>
            <p className={styles.desc}>{desc}</p>
         </div>
      </div>
   );
};

export const FeaturesSection = () => {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
   return (
      <section>
         <div className={`${styles.sectionHead} ${inView ? styles.headVisible : ''}`} ref={ref}>
            <p className={styles.eyebrow}>Why choose us</p>
            <h2 className={styles.sectionTitle}>Everything you need from a bank</h2>
         </div>
         <div className={styles.featuresSection}>
            {FEATURES.map((feature) => (
               <FeatureItem key={feature.img} title={feature.title} img={feature.img} desc={feature.desc} />
            ))}
         </div>
      </section>
   );
};
