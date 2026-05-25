import React from 'react';
import styles from './card.module.css';
import { convertYYYYMMDDToMMYY, convertToNumberCartFormat } from '../../../utils';

const getMaskSetting = () => {
   try { return JSON.parse(localStorage.getItem('app_hideCardNums') ?? 'null') ?? true; }
   catch { return true; }
};

const getHideBalances = () => {
   try { return JSON.parse(localStorage.getItem('app_hideBalances') ?? 'null') ?? false; }
   catch { return false; }
};

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
   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3C6.7 3 4 5.7 4 9"    stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <path d="M10 6.5C8.3 6.5 7 7.8 7 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.7"/>
      <circle cx="10" cy="9" r="1.4" fill="white" />
   </svg>
);

const maskNumber = (raw = '') => {
   const d = raw.replace(/\D/g, '');
   return `•••• •••• •••• ${d.slice(-4)}`;
};

const fmt = (n) =>
   Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const isCardExpired = (expiryDate) => {
   if (!expiryDate) return false;
   return new Date(expiryDate) < new Date();
};

export const Card = ({ card, currency: currencyProp, balance }) => {
   const { number, expiryDate, cvv, type, category, frozen } = card;
   const currency    = currencyProp ?? card.currency ?? '';
   const typeLower   = (type ?? 'visa').toLowerCase();
   const gradientCls = typeLower === 'visa' ? styles.visa : styles.mastercard;
   const expired     = isCardExpired(expiryDate);
   const masking      = getMaskSetting();
   const hideBalances = getHideBalances();
   const displayNum   = masking ? maskNumber(number) : convertToNumberCartFormat(number);

   return (
      <div className={styles.cardWrap}>
         <div className={styles.cardInner}>

            {/* ── Front ── */}
            <div className={`${styles.face} ${styles.front} ${gradientCls}`}>

               {/* Expired overlay */}
               {expired && <div className={styles.expiredOverlay}>EXPIRED</div>}

               {/* Frozen overlay */}
               {frozen && !expired && (
                  <div className={styles.frozenOverlay}>
                     <span className={styles.frozenIcon}>❄️</span>
                     <span className={styles.frozenText}>FROZEN</span>
                  </div>
               )}

               <div className={styles.topRow}>
                  <span className={styles.brandName}>Bankify</span>
                  <div className={styles.topRight}>
                     {currency && <span className={styles.currencyBadge}>{currency}</span>}
                     <span className={`${styles.categoryBadgeFront} ${category === 'credit' ? styles.creditBadge : styles.debitBadge}`}>
                        {category ?? 'debit'}
                     </span>
                  </div>
               </div>

               <div className={styles.chipRow}>
                  <Chip /><Nfc />
               </div>

               <div className={styles.numberRow}>{displayNum}</div>

               {balance != null && (
                  <div className={styles.balanceRow}>
                     <div className={styles.balanceLabel}>Available</div>
                     <div className={styles.balanceValue}>
                        {hideBalances
                           ? <span className={styles.balanceHidden}>••••••</span>
                           : `${fmt(balance)}${currency ? ` ${currency}` : ''}`
                        }
                     </div>
                  </div>
               )}

               <div className={styles.bottomRow}>
                  <div>
                     <div className={styles.expiryLabel}>Valid thru</div>
                     <div className={`${styles.expiryValue} ${expired ? styles.expiryExpired : ''}`}>
                        {convertYYYYMMDDToMMYY(expiryDate)}
                     </div>
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
                  <span className={styles.fullNumber}>{displayNum}</span>
                  <span className={styles.categoryBadgeBack}>{category}</span>
               </div>
            </div>

         </div>
      </div>
   );
};
