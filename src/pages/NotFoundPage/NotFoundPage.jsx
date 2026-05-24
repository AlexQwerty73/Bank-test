import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './notFoundPage.module.css';

const NotFoundIllustration = () => (
   <svg width="220" height="200" viewBox="0 0 220 200" fill="none" aria-hidden="true">
      {/* Soft background circle */}
      <circle cx="110" cy="100" r="88" fill="#EEF2FF" />

      {/* Floating document */}
      <rect x="72" y="40" width="76" height="98" rx="10" fill="#fff" stroke="#C7D2FE" strokeWidth="2"/>
      {/* Torn top corner fold */}
      <path d="M126 40 L148 62 L126 62 Z" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" strokeLinejoin="round"/>

      {/* Document lines */}
      <rect x="86" y="76" width="38" height="5" rx="2.5" fill="#E5E7EB"/>
      <rect x="86" y="87" width="28" height="5" rx="2.5" fill="#E5E7EB"/>
      <rect x="86" y="98" width="33" height="5" rx="2.5" fill="#E5E7EB"/>

      {/* Big question mark */}
      <text x="110" y="133" textAnchor="middle" fontFamily="system-ui, sans-serif"
         fontSize="30" fontWeight="800" fill="#4F46E5">?</text>

      {/* Magnifying glass handle */}
      <line x1="148" y1="148" x2="168" y2="168" stroke="#6B7280" strokeWidth="5" strokeLinecap="round"/>
      {/* Magnifying glass circle */}
      <circle cx="138" cy="138" r="20" fill="none" stroke="#6B7280" strokeWidth="5"/>
      {/* Glare */}
      <circle cx="131" cy="131" r="4" fill="rgba(255,255,255,0.5)"/>

      {/* Floating dots */}
      <circle cx="42"  cy="58"  r="6" fill="#C7D2FE" opacity="0.8"/>
      <circle cx="176" cy="74"  r="5" fill="#DDD6FE" opacity="0.9"/>
      <circle cx="36"  cy="148" r="4" fill="#A5B4FC" opacity="0.7"/>
      <circle cx="180" cy="152" r="7" fill="#EDE9FE" opacity="0.8"/>
   </svg>
);

export const NotFoundPage = () => {
   const navigate = useNavigate();

   return (
      <div className={styles.page}>
         <div className={styles.card}>
            <div className={styles.illustration}>
               <NotFoundIllustration />
            </div>

            <div className={styles.code}>404</div>
            <h1 className={styles.title}>Page not found</h1>
            <p className={styles.desc}>
               The page you're looking for doesn't exist,<br />
               was moved, or the link is incorrect.
            </p>

            <div className={styles.actions}>
               <button className={styles.backBtn} onClick={() => navigate(-1)}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M15 10H5M9 6l-4 4 4 4"/>
                  </svg>
                  Go back
               </button>
               <Link to="/" className={styles.homeBtn}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                     <path d="M7 18v-7h6v7"/>
                  </svg>
                  Go home
               </Link>
            </div>
         </div>
      </div>
   );
};
