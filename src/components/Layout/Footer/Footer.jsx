import React from 'react';
import { Link } from 'react-router-dom';
import { loadFromLocalStorage } from '../../../utils';
import styles from './footer.module.css';

export const Footer = () => {
   const userId = loadFromLocalStorage('userId');

   return (
      <footer className={styles.footer}>
         <div className="container">
            <div className={styles.grid}>

               {/* ── Brand ── */}
               <div className={styles.brand}>
                  <div className={styles.logo}>◈ Bankify</div>
                  <p className={styles.tagline}>
                     Your finances, one place. Secure, instant, always with you.
                  </p>
                  <div className={styles.socials}>
                     <a href="https://facebook.com/"  className={styles.social} aria-label="Facebook"  target="_blank" rel="noreferrer">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                     </a>
                     <a href="https://instagram.com/" className={styles.social} aria-label="Instagram" target="_blank" rel="noreferrer">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                     </a>
                     <a href="https://t.me/"          className={styles.social} aria-label="Telegram"  target="_blank" rel="noreferrer">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.56 8.19-1.97 9.28c-.14.65-.52.81-1.06.5l-2.9-2.14-1.4 1.35c-.16.16-.29.29-.59.29l.21-2.97 5.37-4.85c.23-.21-.05-.32-.36-.11L7.27 14.6 4.4 13.73c-.63-.2-.64-.63.13-.93l10.88-4.2c.53-.19.99.13.15.59z"/></svg>
                     </a>
                  </div>
               </div>

               {/* ── Navigation ── */}
               <div className={styles.col}>
                  <h4 className={styles.colTitle}>Account</h4>
                  <nav className={styles.links}>
                     {userId && <>
                        <Link to={`/${userId}/cards`}>My Cards</Link>
                        <Link to={`/${userId}/transactions`}>Transactions</Link>
                        <Link to={`/${userId}/profile`}>Profile</Link>
                        <Link to={`/${userId}/create-card`}>Issue Card</Link>
                     </>}
                     <Link to="/exchange-rate">Exchange Rate</Link>
                  </nav>
               </div>

               {/* ── Contact ── */}
               <div className={styles.col}>
                  <h4 className={styles.colTitle}>Contact</h4>
                  <div className={styles.contacts}>
                     <div className={styles.contactItem}>
                        <span className={styles.contactLabel}>Support</span>
                        <a href="mailto:support@bankify.app">support@bankify.app</a>
                     </div>
                     <div className={styles.contactItem}>
                        <span className={styles.contactLabel}>Phone</span>
                        <a href="tel:+18001234567">+1 (800) 123-45-67</a>
                     </div>
                     <div className={styles.contactItem}>
                        <span className={styles.contactLabel}>Hours</span>
                        <span>24/7 · 365 days</span>
                     </div>
                  </div>
               </div>

            </div>

            <div className={styles.bottom}>
               <hr className={styles.divider} />
               <p className={styles.copy}>
                  © {new Date().getFullYear()} Bankify. All rights reserved.
               </p>
            </div>
         </div>
      </footer>
   );
};
