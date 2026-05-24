import React from 'react';
import styles from './statsStrip.module.css';
import { useInView } from 'react-intersection-observer';

const STATS = [
   { value: '10 000+', label: 'Active customers',    icon: '👥' },
   { value: '₴500M+',  label: 'Processed monthly',   icon: '💸' },
   { value: '99.9%',   label: 'Platform uptime',     icon: '⚡' },
   { value: '3',       label: 'Account currencies',  icon: '🌍' },
];

export const StatsStrip = () => {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

   return (
      <div className={`${styles.strip} ${inView ? styles.visible : ''}`} ref={ref}>
         {STATS.map((s, i) => (
            <div key={i} className={styles.item}>
               <span className={styles.icon}>{s.icon}</span>
               <span className={styles.value}>{s.value}</span>
               <span className={styles.label}>{s.label}</span>
            </div>
         ))}
      </div>
   );
};
