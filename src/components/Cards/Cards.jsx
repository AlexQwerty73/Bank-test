import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../commons';
import styles from './cards.module.css';

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

const fmt = (n) =>
   Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const Cards = ({ cards, accountsById = {} }) => {
   // Group cards by accountId
   const groups = useMemo(() => {
      const g = {};
      cards.forEach(card => {
         if (!g[card.accountId]) g[card.accountId] = [];
         g[card.accountId].push(card);
      });
      return Object.entries(g);
   }, [cards]);

   if (groups.length === 0) return null;

   return (
      <div className={styles.groups}>
         {groups.map(([accountId, groupCards]) => {
            const acc = accountsById[accountId];
            return (
               <div key={accountId} className={styles.group}>
                  {acc && (
                     <div className={styles.groupHeader}>
                        <div className={styles.groupHeaderLeft}>
                           <span className={styles.groupFlag}>{CURRENCY_FLAGS[acc.currency] ?? '🏦'}</span>
                           <div>
                              <span className={styles.groupCurrency}>{acc.currency} Account</span>
                              <span className={styles.groupNumber}>···{acc.accountNumber?.slice(-6)}</span>
                           </div>
                        </div>
                        <div className={styles.groupBalance}>
                           <span className={styles.groupBalanceLabel}>Balance</span>
                           <span className={styles.groupBalanceValue}>
                              {fmt(acc.balance)} <span className={styles.groupBalanceCur}>{acc.currency}</span>
                           </span>
                        </div>
                     </div>
                  )}
                  <div className={styles.grid}>
                     {groupCards.map(card => (
                        <Link key={card.id} to={`${card.number}`} className={styles.cardLink}>
                           <Card
                              card={card}
                              currency={acc?.currency}
                              balance={acc?.balance}
                           />
                        </Link>
                     ))}
                  </div>
               </div>
            );
         })}
      </div>
   );
};
