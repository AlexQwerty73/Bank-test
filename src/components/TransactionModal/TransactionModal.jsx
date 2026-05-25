import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './transactionModal.module.css';

const TYPE_LABEL = {
   transfer:            'Transfer',
   'external-transfer': 'External transfer',
   exchange:            'Exchange',
   deposit:             'Deposit',
   withdrawal:          'Withdrawal',
};

const TYPE_ICON = {
   transfer:            '↔️',
   'external-transfer': '🏦',
   exchange:            '🔄',
   deposit:             '💰',
   withdrawal:          '🏧',
};

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

const fmt = (n) =>
   Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const TransactionModal = ({ tx, onClose }) => {
   /* Close on Escape, lock body scroll */
   useEffect(() => {
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      return () => {
         document.removeEventListener('keydown', onKey);
         document.body.style.overflow = '';
      };
   }, [onClose]);

   if (!tx) return null;

   const isIn   = tx.direction === 'in';
   const date   = new Date(tx.date);
   const dayStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
   const timStr = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

   return ReactDOM.createPortal(
      <div className={styles.overlay} onClick={onClose}>
         <div className={styles.sheet} onClick={e => e.stopPropagation()}>

            {/* Drag handle */}
            <div className={styles.handle} />

            {/* Close button */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M15 5L5 15M5 5l10 10"/>
               </svg>
            </button>

            {/* ── Amount hero ── */}
            <div className={styles.hero}>
               <div className={styles.heroIcon}>{TYPE_ICON[tx.type] ?? '💳'}</div>
               <div className={`${styles.heroAmount} ${isIn ? styles.amtIn : styles.amtOut}`}>
                  {isIn ? '+' : '−'}{fmt(tx.amount)}
                  <span className={styles.heroCur}>{tx.currency}</span>
               </div>
               <div className={styles.heroType}>{TYPE_LABEL[tx.type] ?? tx.type}</div>
            </div>

            {/* ── Status pill ── */}
            <div className={styles.statusRow}>
               <span className={styles.statusCompleted}>
                  <span className={styles.statusDot} />
                  Completed
               </span>
               <span className={styles.refChip}>#{tx.id}</span>
            </div>

            {/* ── Detail rows ── */}
            <div className={styles.rows}>

               <div className={styles.row}>
                  <span className={styles.rowLabel}>Date</span>
                  <span className={styles.rowVal}>{dayStr}</span>
               </div>

               <div className={styles.row}>
                  <span className={styles.rowLabel}>Time</span>
                  <span className={styles.rowVal}>{timStr}</span>
               </div>

               <div className={styles.row}>
                  <span className={styles.rowLabel}>Direction</span>
                  <span className={`${styles.rowVal} ${isIn ? styles.dirIn : styles.dirOut}`}>
                     {isIn ? '↓ Incoming' : '↑ Outgoing'}
                  </span>
               </div>

               {tx.counterName && (
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>{isIn ? 'From' : 'To'}</span>
                     <span className={styles.rowVal}>{tx.counterName}</span>
                  </div>
               )}

               {tx.counterAccountNumber && (
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>Account</span>
                     <span className={`${styles.rowVal} ${styles.mono}`}>
                        {tx.counterAccountNumber.replace(/(.{4})/g, '$1 ').trim()}
                     </span>
                  </div>
               )}

               {tx.description && (
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>Note</span>
                     <span className={styles.rowVal}>{tx.description}</span>
                  </div>
               )}

               <div className={styles.row}>
                  <span className={styles.rowLabel}>Currency</span>
                  <span className={styles.rowVal}>
                     {CURRENCY_FLAGS[tx.currency] ?? ''} {tx.currency}
                  </span>
               </div>

               <div className={styles.row}>
                  <span className={styles.rowLabel}>Amount</span>
                  <span className={`${styles.rowVal} ${styles.rowAmountBig} ${isIn ? styles.amtIn : styles.amtOut}`}>
                     {isIn ? '+' : '−'}{fmt(tx.amount)} {tx.currency}
                  </span>
               </div>

            </div>

            <button className={styles.doneBtn} onClick={onClose}>Done</button>
         </div>
      </div>,
      document.body,
   );
};
