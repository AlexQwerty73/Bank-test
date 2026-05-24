import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useGetAccountsByUserIdQuery } from '../../store';
import { loadFromLocalStorage } from '../../utils';
import styles from './TransactionsCardsPage.module.css';

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };
const CURRENCY_NAMES = { USD: 'US Dollar', EUR: 'Euro', UAH: 'Ukrainian Hryvnia' };
const CURRENCY_COLOR = { USD: '#059669', EUR: '#2563EB', UAH: '#D97706' };

export const TransactionsCardsPage = () => {
   const { userId }  = useParams();
   const localUserId = loadFromLocalStorage('userId');

   const { data: accounts = [], isLoading } = useGetAccountsByUserIdQuery(userId);

   if (userId !== localUserId) {
      return <Navigate to={`/${localUserId}/transactions`} replace />;
   }

   return (
      <div className={styles.page}>
         <div className="container">

            {/* ── Header ── */}
            <div className={styles.header}>
               <div>
                  <h1 className={styles.title}>My Accounts</h1>
                  {!isLoading && (
                     <p className={styles.subtitle}>
                        {accounts.length === 0
                           ? 'No accounts yet'
                           : `${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'} open`}
                     </p>
                  )}
               </div>
               <div className={styles.headerActions}>
                  <Link to="remittance" className={styles.transferBtn}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 7h14M3 7l3-3M3 7l3 3M17 13H3M17 13l-3-3M17 13l-3 3"/>
                     </svg>
                     Transfer
                  </Link>
                  <Link to={`/${userId}/create-account`} className={styles.addBtn}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M10 4v12M4 10h12"/>
                     </svg>
                     New account
                  </Link>
               </div>
            </div>

            {isLoading && <p className={styles.loading}>Loading accounts…</p>}

            {!isLoading && accounts.length === 0 && (
               <div className={styles.empty}>
                  <span>🏦</span>
                  <p>No accounts yet. Open your first account to get started.</p>
                  <Link to={`/${userId}/create-account`} className={styles.emptyLink}>
                     Open an account →
                  </Link>
               </div>
            )}

            {/* ── Accounts list ── */}
            {!isLoading && accounts.length > 0 && (
               <div className={styles.list}>
                  {accounts.map(account => (
                     <Link
                        key={account.id}
                        to={account.id}
                        className={styles.accountRow}
                     >
                        {/* Left: flag + info */}
                        <div className={styles.accountLeft}>
                           <div
                              className={styles.flagWrap}
                              style={{ background: `${CURRENCY_COLOR[account.currency]}18` }}
                           >
                              <span className={styles.flag}>{CURRENCY_FLAGS[account.currency] ?? '🏦'}</span>
                           </div>
                           <div>
                              <div className={styles.accountName}>
                                 {CURRENCY_NAMES[account.currency] ?? account.currency} Account
                              </div>
                              <div className={styles.accountNumber}>
                                 {account.accountNumber.replace(/(.{4})/g, '$1 ').trim()}
                              </div>
                           </div>
                        </div>

                        {/* Right: balance + arrow */}
                        <div className={styles.accountRight}>
                           <div className={styles.balanceWrap}>
                              <span
                                 className={styles.balance}
                                 style={{ color: CURRENCY_COLOR[account.currency] ?? '#111827' }}
                              >
                                 {Number(account.balance).toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                 })}
                              </span>
                              <span className={styles.currency}>{account.currency}</span>
                           </div>
                           <svg className={styles.arrow} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M7 5l5 5-5 5"/>
                           </svg>
                        </div>
                     </Link>
                  ))}
               </div>
            )}

         </div>
      </div>
   );
};
