import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Main } from './Main';
import { Outlet } from 'react-router-dom';
import { loadFromLocalStorage, getSetting } from '../../utils';
import { useGetUsersQuery } from '../../store';
import styles from './layout.module.css';

/* ── Back to top ──────────────────────────────────────── */
const BackToTop = () => {
   const [visible, setVisible] = useState(false);

   useEffect(() => {
      const onScroll = () => setVisible(window.scrollY > 400);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
   }, []);

   if (!visible) return null;
   return (
      <button
         className={styles.backToTop}
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
         aria-label="Back to top"
      >
         <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <path d="M10 16V4M4 10l6-6 6 6"/>
         </svg>
      </button>
   );
};

/* ── Email verification banner ────────────────────────── */
const EmailBanner = ({ userId }) => {
   const [dismissed, setDismissed] = useState(
      () => localStorage.getItem('banner_email_dismissed') === 'true',
   );

   const { data: user } = useGetUsersQuery(userId, {
      skip: !userId || dismissed,
   });

   if (dismissed || !user || user.verified !== false) return null;

   const handleDismiss = () => {
      localStorage.setItem('banner_email_dismissed', 'true');
      setDismissed(true);
   };

   return (
      <div className={styles.emailBanner}>
         <div className="container">
            <div className={styles.emailBannerInner}>
               <span className={styles.emailBannerIcon}>✉️</span>
               <p className={styles.emailBannerText}>
                  <strong>Confirm your email</strong> — we sent a verification link to{' '}
                  <em>{user.email}</em>. Check your inbox to secure your account.
               </p>
               <button className={styles.emailBannerResend}>Resend email</button>
               <button className={styles.emailBannerClose} onClick={handleDismiss} aria-label="Dismiss banner">
                  ✕
               </button>
            </div>
         </div>
      </div>
   );
};

/* ── Apply body classes from saved settings ───────────── */
const useBodyClasses = () => {
   useEffect(() => {
      document.body.classList.toggle('reduce-motion', getSetting('reducedMotion', false));
      document.body.classList.toggle('compact-mode',  getSetting('compactLayout',  false));
      // Clean up on unmount (though Layout is persistent)
      return () => {
         document.body.classList.remove('reduce-motion', 'compact-mode');
      };
   }, []);
};

/* ── Layout ───────────────────────────────────────────── */
export const Layout = () => {
   const userId = loadFromLocalStorage('userId');
   useBodyClasses();

   return (
      <>
         <EmailBanner userId={userId} />
         <Header />
         <Main>
            <Outlet />
         </Main>
         <Footer />
         <BackToTop />
      </>
   );
};
