import React, { useMemo, useState } from 'react';
import { Cards } from '../../components';
import { Link, useParams, Navigate } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';
import { useGetCardsByUserIdQuery, useGetAccountsByUserIdQuery } from '../../store';
import { usePagination } from '../../hooks';
import { Pagination } from '../../components/commons';
import styles from './cardsPage.module.css';

const PAGE_SIZE = 6;
const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

export const CardsPage = () => {
   const { userId }      = useParams();
   const localStorUserId = loadFromLocalStorage('userId');

   const { data: cardsData   = [], isLoading: cardsLoading, error } = useGetCardsByUserIdQuery(userId);
   const { data: accountsData = [], isLoading: accLoading }         = useGetAccountsByUserIdQuery(userId);

   const [categoryFilter, setCategoryFilter] = useState('all');

   // accountsById map
   const accountsById = useMemo(() =>
      accountsData.reduce((map, acc) => { map[acc.id] = acc; return map; }, {}),
   [accountsData]);

   // Count debit/credit per account
   const slotsByAccount = useMemo(() =>
      cardsData.reduce((map, c) => {
         if (!map[c.accountId]) map[c.accountId] = { debit: 0, credit: 0 };
         if (c.category === 'debit')  map[c.accountId].debit  += 1;
         if (c.category === 'credit') map[c.accountId].credit += 1;
         return map;
      }, {}),
   [cardsData]);

   // Filtered cards (filter first, then paginate)
   const filteredCards = useMemo(() =>
      categoryFilter === 'all'
         ? cardsData
         : cardsData.filter(c => c.category === categoryFilter),
   [cardsData, categoryFilter]);

   // Pagination on filtered list
   const {
      page, totalPages, totalItems, pageItems,
      setPage, prevPage, nextPage, startIndex, endIndex,
   } = usePagination(filteredCards, PAGE_SIZE);

   // All hooks above — early return below
   if (userId !== localStorUserId) {
      return <Navigate to={`/${localStorUserId}/cards`} replace />;
   }

   const isLoading = cardsLoading || accLoading;
   const count     = cardsData.length;

   const canAdd = accountsData.some(acc => {
      const slots = slotsByAccount[acc.id] || { debit: 0, credit: 0 };
      return slots.debit < 1 || slots.credit < 1;
   });

   const debitCount  = cardsData.filter(c => c.category === 'debit').length;
   const creditCount = cardsData.filter(c => c.category === 'credit').length;

   return (
      <div className={styles.page}>
         <div className="container">

            {/* ── Header ── */}
            <div className={styles.header}>
               <div className={styles.titleGroup}>
                  <h1 className={styles.title}>My Cards</h1>
                  {!isLoading && !error && count > 0 && (
                     <div className={styles.meta}>
                        <span className={styles.metaCount}>
                           {count} {count === 1 ? 'card' : 'cards'}
                        </span>
                        <span className={styles.metaDot}>·</span>
                        <span className={styles.metaChip}>{debitCount} debit</span>
                        <span className={styles.metaChip}>{creditCount} credit</span>
                        {accountsData.map(acc => {
                           const slots   = slotsByAccount[acc.id] || { debit: 0, credit: 0 };
                           const allFull = slots.debit >= 1 && slots.credit >= 1;
                           return (
                              <span
                                 key={acc.id}
                                 className={`${styles.slotPill} ${allFull ? styles.slotFull : styles.slotFree}`}
                                 title={`${acc.currency}: debit ${slots.debit}/1, credit ${slots.credit}/1`}
                              >
                                 {CURRENCY_FLAGS[acc.currency] ?? ''} {acc.currency}
                                 {' '}{slots.debit + slots.credit}/2
                              </span>
                           );
                        })}
                     </div>
                  )}
               </div>

               {canAdd ? (
                  <Link to={`/${userId}/create-card`} className={styles.addBtn}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M10 4v12M4 10h12"/>
                     </svg>
                     Add card
                  </Link>
               ) : (
                  <span className={styles.limitReached}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
                     </svg>
                     Limit reached
                  </span>
               )}
            </div>

            {/* ── Filters (only when there are cards) ── */}
            {!isLoading && !error && count > 0 && (
               <div className={styles.filters}>
                  {['all', 'debit', 'credit'].map(f => (
                     <button
                        key={f}
                        className={`${styles.filterPill} ${categoryFilter === f ? styles.filterActive : ''}`}
                        onClick={() => { setCategoryFilter(f); setPage(1); }}
                     >
                        {f === 'all' ? `All (${count})` : f === 'debit' ? `Debit (${debitCount})` : `Credit (${creditCount})`}
                     </button>
                  ))}
               </div>
            )}

            {/* ── Content ── */}
            {isLoading && (
               <div className={styles.skeletonWrap}>
                  {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
               </div>
            )}

            {error && (
               <div className={styles.errorBox}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                     <circle cx="10" cy="10" r="8"/><path d="M10 6v4M10 14h.01"/>
                  </svg>
                  Failed to load cards. Please try again.
               </div>
            )}

            {!isLoading && !error && count === 0 && (
               <div className={styles.empty}>
                  <div className={styles.emptyIcon}>💳</div>
                  <p className={styles.emptyTitle}>No cards yet</p>
                  <p className={styles.emptyText}>
                     Issue your first card and start managing your finances in one place.
                  </p>
                  <Link to={`/${userId}/create-card`} className={styles.addBtn}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M10 4v12M4 10h12"/>
                     </svg>
                     Add card
                  </Link>
               </div>
            )}

            {!isLoading && !error && filteredCards.length === 0 && count > 0 && (
               <div className={styles.empty}>
                  <div className={styles.emptyIcon}>🔍</div>
                  <p className={styles.emptyTitle}>No {categoryFilter} cards</p>
                  <button className={styles.resetBtn} onClick={() => setCategoryFilter('all')}>
                     Show all cards
                  </button>
               </div>
            )}

            {!isLoading && !error && pageItems.length > 0 && (
               <>
                  <Cards cards={pageItems} accountsById={accountsById} />
                  <Pagination
                     page={page}
                     totalPages={totalPages}
                     totalItems={totalItems}
                     startIndex={startIndex}
                     endIndex={endIndex}
                     onPage={setPage}
                     onPrev={prevPage}
                     onNext={nextPage}
                     label="cards"
                  />
               </>
            )}

         </div>
      </div>
   );
};
