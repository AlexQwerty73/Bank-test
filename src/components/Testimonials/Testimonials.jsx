import React from 'react';
import styles from './testimonials.module.css';
import { useInView } from 'react-intersection-observer';

const REVIEWS = [
   {
      avatar: '👩‍💼',
      name: 'Olena Kovalenko',
      role: 'Freelance Designer',
      stars: 5,
      text: 'Finally a bank that doesn\'t make me go to a branch. Opened three currency accounts in 5 minutes, issued a card — everything is super fast and clear.',
   },
   {
      avatar: '👨‍💻',
      name: 'Dmytro Shevchenko',
      role: 'Software Engineer',
      stars: 5,
      text: 'I receive salary in USD and pay expenses in UAH. The exchange rate is always up to date, and the deposit calculator helped me plan my savings perfectly.',
   },
   {
      avatar: '👩‍🎓',
      name: 'Maryna Bondarenko',
      role: 'Student',
      stars: 4,
      text: 'Very convenient to track transactions by account. Filtering and pagination work great. The interface is clean and not overloaded.',
   },
];

const Stars = ({ count }) => (
   <div className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
         <span key={i} className={i < count ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
   </div>
);

const Card = ({ review, index }) => {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
   return (
      <div
         ref={ref}
         className={`${styles.card} ${inView ? styles.visible : ''}`}
         style={{ transitionDelay: `${index * 0.12}s` }}
      >
         <Stars count={review.stars} />
         <p className={styles.text}>"{review.text}"</p>
         <div className={styles.author}>
            <span className={styles.avatar}>{review.avatar}</span>
            <div>
               <div className={styles.name}>{review.name}</div>
               <div className={styles.role}>{review.role}</div>
            </div>
         </div>
      </div>
   );
};

export const Testimonials = () => (
   <section className={styles.section}>
      <p className={styles.eyebrow}>Customer stories</p>
      <h2 className={styles.title}>Trusted by thousands</h2>
      <div className={styles.grid}>
         {REVIEWS.map((r, i) => <Card key={r.name} review={r} index={i} />)}
      </div>
   </section>
);
