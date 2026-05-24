import React from 'react';
import styles from './card.module.css';
import { convertYYYYMMDDToMMYY, convertToNumberCartFormat } from '../../../utils';

const Chip = () => (
   <svg width="38" height="28" viewBox="0 0 38 28" fill="none" aria-hidden="true">
      <rect width="38" height="28" rx="5" fill="#D4AF37" />
      <rect x="13" width="12" height="28" fill="#B8960C" opacity="0.55" />
      <rect y="8" width="38" height="12" fill="#B8960C" opacity="0.55" />
      <rect x="13" y="8" width="12" height="12" rx="2"
            fill="#D4AF37" stroke="#B8960C" strokeWidth="0.6" />
   </svg>
);

const Nfc = () => (
   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" opacity="0.55">
      <path d="M10 3C6.7 3 4 5.7 4 9"    stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M10 6.5C8.3 6.5 7 7.8 7 9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="10" cy="9" r="1.4" fill="white" />
   </svg>
);

const maskNumber = (raw = '') => {
   const d = raw.replace(/\D/g, '');
   return `•••• •••• •••• ${d.slice(-4)}`;
};

export const Card = ({ card, currency: currencyProp }) => {
   const { number, expiryDate, cvv, type, category } = card;
   const currency = currencyProp ?? card.currency ?? '';
   const typeLower    = type?.toLowerCase();
   const gradientCls  = typeLower === 'visa' ? styles.visa : styles.mastercard;

   return (
      <div className={styles.cardWrap}>
         <div className={styles.cardInner}>

            {/* ── Front ── */}
            <div className={`${styles.face} ${styles.front} ${gradientCls}`}>
               <div className={styles.topRow}>
                  <span className={styles.brandName}>Bankify</span>
                  <span className={styles.currencyBadge}>{currency}</span>
               </div>
               <div className={styles.chipRow}>
                  <Chip /><Nfc />
               </div>
               <div className={styles.numberRow}>{maskNumber(number)}</div>
               <div className={styles.bottomRow}>
                  <div>
                     <div className={styles.expiryLabel}>Valid thru</div>
                     <div className={styles.expiryValue}>{convertYYYYMMDDToMMYY(expiryDate)}</div>
                  </div>
                  <img
                     className={styles.cardLogo}
                     src={`/imgs/icon/card/${typeLower}${typeLower === 'visa' ? '2' : ''}.png`}
                     alt={type}
                  />
               </div>
            </div>

            {/* ── Back ── */}
            <div className={`${styles.face} ${styles.back} ${gradientCls}`}>
               <div className={styles.backStripe} />

               <div className={styles.sigLabel}>Authorized Signature</div>

               <div className={styles.sigRow}>
                  <div className={styles.sigHatch} />
                  <div className={styles.cvvBox}>
                     <span className={styles.cvvBoxLabel}>CVV</span>
                     <span className={styles.cvvBoxValue}>{cvv}</span>
                  </div>
               </div>

               <div className={styles.backBottom}>
                  <span className={styles.fullNumber}>
                     {convertToNumberCartFormat(number)}
                  </span>
                  <span className={styles.categoryBadge}>{category}</span>
               </div>
            </div>

         </div>
      </div>
   );
};
