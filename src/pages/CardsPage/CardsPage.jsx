import React, { useMemo } from 'react';
import { Cards } from '../../components';
import { Link, useParams, Navigate } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';
import { useGetCardsByUserIdQuery, useGetAccountsByUserIdQuery } from '../../store';
import styles from './cardsPage.module.css';

const LIMITS         = { UAH: 2, EUR: 1, USD: 1 };
const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

export const CardsPage = () => {
   const { userId }      = useParams();
   const localStorUserId = loadFromLocalStorage('userId');

   const { data: cardsData   = [], isLoading: cardsLoading, error } = useGetCardsByUserIdQuery(userId);
   const { data: accountsData = [], isLoading: accLoading  }        = useGetAccountsByUserIdQuery(userId);

   // Build accountsById map for fast lookup
   const accountsById = useMemo(() =>
      accountsData.reduce((map, acc) => { map[acc.id] = acc; return map; }, {}),
   [accountsData]);

   // Count cards already linked to each account
   const cardCountByAccount = useMemo(() =>
      cardsData.reduce((acc, c) => {
         acc[c.accountId] = (acc[c.accountId] || 0) + 1;
         return acc;
      }, {}),
   [cardsData]);

   // All hooks above — early return below
   if (userId !== localStorUserId) {
      return <Navigate to={`/${localStorUserId}/cards`} replace />;
   }

   const isLoading = cardsLoading || accLoading;
   const count     = cardsData.length;

   // Can add = any account still has capacity
   const canAdd = accountsData.some(acc => {
      const limit = LIMITS[acc.currency] ?? 1;
      return (cardCountByAccount[acc.id] || 0) < limit;
   });

   return (
      <div className={styles.page}>
         <div className="container">

            {/* ── Header ── */}
            <div className={styles.header}>
               <div className={styles.titleGroup}>
                  <h1 className={styles.title}>My Cards</h1>
                  {!isLoading && !error && count > 0 && (
                     <p className={styles.subtitle}>
                        {count} {count === 1 ? 'card' : 'cards'} · linked to accounts
                        {accountsData.map(acc => {
                           const limit = LIMITS[acc.currency] ?? 1;
                           const used  = cardCountByAccount[acc.id] || 0;
                           const full  = used >= limit;
                           return (
                              <span
                                 key={acc.id}
                                 className={`${styles.slotPill} ${full ? styles.slotFull : styles.slotFree}`}
                              >
                                 {CURRENCY_FLAGS[acc.currency] ?? ''} {acc.currency} {used}/{limit}
                              </span>
                           );
                        })}
                     </p>
                  )}
               </div>

               {canAdd ? (
                  <Link to={`/${userId}/create-card`} className={styles.addBtn}>
                     <span className={styles.plusIcon}>＋</span>
                     Add card
                  </Link>
               ) : (
                  <span className={styles.limitReached}>Limit reached</span>
               )}
            </div>

            {/* ── Content ── */}
            {isLoading && <p className={styles.statusText}>Loading cards…</p>}
            {error     && <p className={styles.statusText}>Failed to load cards.</p>}

            {!isLoading && !error && count === 0 && (
               <div className={styles.empty}>
                  <span className={styles.emptyIcon}>💳</span>
                  <p className={styles.emptyTitle}>No cards yet</p>
                  <p className={styles.emptyText}>
                     Issue your first card and start managing your finances in one place.
                  </p>
                  <Link to={`/${userId}/create-card`} className={styles.addBtn}>
                     <span className={styles.plusIcon}>＋</span>
                     Add card
                  </Link>
               </div>
            )}

            {!isLoading && !error && count > 0 && (
               <Cards cards={cardsData} accountsById={accountsById} />
            )}

         </div>
      </div>
   );
};
