import React from 'react';
import styles from './howItWorks.module.css';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';

const STEPS = [
   {
      num: '01',
      icon: '📝',
      title: 'Create an account',
      desc: 'Register in under 2 minutes — just a name, email and password. No paperwork, no branch visits.',
   },
   {
      num: '02',
      icon: '💳',
      title: 'Issue a card',
      desc: 'Open a debit or credit card linked to any of your UAH, USD or EUR accounts instantly.',
   },
   {
      num: '03',
      icon: '💸',
      title: 'Transfer & track',
      desc: 'Send money between accounts, monitor every transaction and grow your savings with deposits.',
   },
];

const Step = ({ step, index }) => {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });
   return (
      <div
         ref={ref}
         className={`${styles.step} ${inView ? styles.visible : ''}`}
         style={{ transitionDelay: `${index * 0.13}s` }}
      >
         <div className={styles.stepNum}>{step.num}</div>
         <div className={styles.stepIcon}>{step.icon}</div>
         <h3 className={styles.stepTitle}>{step.title}</h3>
         <p className={styles.stepDesc}>{step.desc}</p>
      </div>
   );
};

export const HowItWorks = () => {
   const userId = loadFromLocalStorage('userId');
   return (
      <section className={styles.section}>
         <p className={styles.eyebrow}>How it works</p>
         <h2 className={styles.title}>Start in 3 easy steps</h2>
         <div className={styles.steps}>
            {STEPS.map((s, i) => <Step key={s.num} step={s} index={i} />)}
         </div>
         <div className={styles.cta}>
            <Link
               to={userId ? `/${userId}/transactions` : '/create-user'}
               className={styles.ctaBtn}
            >
               {userId ? 'Open dashboard →' : 'Get started for free →'}
            </Link>
         </div>
      </section>
   );
};
