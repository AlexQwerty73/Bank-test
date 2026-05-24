import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
   useGetTransactionsByAccountIdQuery,
   useGetAccountByIdQuery,
   useGetCardsByUserIdQuery,
} from '../../store';
import { loadFromLocalStorage } from '../../utils';
import { Card } from '../../components/commons/Card/Card';
import styles from './CardTransactionsPage.module.css';

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

function formatDateTime(iso) {
   const d = new Date(iso);
   return (
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' · ' +
      d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
   );
}

export const CardTransactionsPage = () => {
   const { accountId } = useParams();
   const userId        = loadFromLocalStorage('userId');

   const { data: account,           isLoading: accLoading   } = useGetAccountByIdQuery(accountId);
   const { data: transactions = [],  isLoading: txLoading    } = useGetTransactionsByAccountIdQuery(accountId);
   const { data: allCards = [],      isLoading: cardsLoading } = useGetCardsByUserIdQuery(userId);

   const [copied, setCopied] = useState(false);

   const isLoading   = accLoading || txLoading || cardsLoading;
   const linkedCards = allCards.filter(c => c.accountId === accountId);

   if (isLoading) return <div className={styles.loading}>Loading…</div>;
   if (!account)  return <div className={styles.loading}>Account not found.</div>;

   const handleCopy = () => {
      navigator.clipboard.writeText(account.accountNumber).then(() => {
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      });
   };

   return (
      <div className={styles.page}>
         <div className="container">

            <Link to={`/${userId}/transactions`} className={styles.backLink}>
               ← Back to accounts
            </Link>

            {/* ── Account summary ─────────────────────────────── */}
            <div className={styles.accountHeader}>
               <div className={styles.accountHeaderLeft}>
                  <span className={styles.flag}>{CURRENCY_FLAGS[account.currency] ?? '🏦'}</span>
                  <div>
                     <div className={styles.accountCurrency}>{account.currency} Account</div>
                     <button className={styles.accountNumberBtn} onClick={handleCopy} title="Copy account number">
                        <span className={styles.accountNumber}>
                           {account.accountNumber.replace(/(.{4})/g, '$1 ').trim()}
                        </span>
                        <span className={styles.copyIcon}>
                           {copied
                              ? <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="2 8 6 12 14 4"/></svg>
                              : <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="1" width="9" height="11" rx="2"/><rect x="1" y="4" width="9" height="11" rx="2"/></svg>
                           }
                        </span>
                        {copied && <span className={styles.copiedLabel}>Copied!</span>}
                     </button>
                     <div className={styles.openedDate}>
                        Opened {new Date(account.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                     </div>
                  </div>
               </div>
               <div className={styles.balanceBlock}>
                  <div className={styles.balanceLabel}>Available balance</div>
                  <div className={styles.accountBalance}>
                     {Number(account.balance).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                     })}
                     <span className={styles.balanceCurrency}>{account.currency}</span>
                  </div>
               </div>
            </div>

            {/* ── Quick actions ────────────────────────────────── */}
            <div className={styles.actions}>
               <Link to={`/${userId}/transactions/remittance`} className={styles.actionBtn}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M3 7h14M3 7l3-3M3 7l3 3M17 13H3M17 13l-3-3M17 13l-3 3"/>
                  </svg>
                  Transfer
               </Link>
               <Link to={`/${userId}/create-card`} className={`${styles.actionBtn} ${styles.actionBtnGhost}`}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                     <rect x="2" y="5" width="16" height="11" rx="2"/>
                     <path d="M2 9h16"/>
                  </svg>
                  Add card
               </Link>
            </div>

            {/* ── Linked cards ─────────────────────────────────── */}
            {linkedCards.length > 0 && (
               <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                     Linked cards
                     <span className={styles.sectionCount}>{linkedCards.length}</span>
                  </h2>
                  <div className={styles.cardsRow}>
                     {linkedCards.map(card => (
                        <Link key={card.id} to={`/${userId}/cards/${card.number}`} className={styles.cardLink}>
                           <Card card={card} currency={account.currency} balance={account.balance} />
                        </Link>
                     ))}
                  </div>
               </section>
            )}

            {linkedCards.length === 0 && (
               <div className={styles.noCards}>
                  <span>💳</span>
                  <p>No cards linked to this account yet.</p>
                  <Link to={`/${userId}/create-card`} className={styles.noCardsLink}>Issue a card →</Link>
               </div>
            )}

            {/* ── Transaction history ───────────────────────────── */}
            <section className={styles.section}>
               <h2 className={styles.sectionTitle}>
                  Transaction history
                  {transactions.length > 0 && (
                     <span className={styles.sectionCount}>{transactions.length}</span>
                  )}
               </h2>

               {transactions.length === 0 && (
                  <div className={styles.empty}>
                     <span>📋</span>
                     <p>No transactions yet.</p>
                  </div>
               )}

               <ul className={styles.list}>
                  {transactions.map(tx => (
                     <li key={tx.id} className={styles.item}>
                        <div className={`${styles.dirBadge} ${tx.direction === 'in' ? styles.dirIn : styles.dirOut}`}>
                           {tx.direction === 'in' ? '↓' : '↑'}
                        </div>
                        <div className={styles.itemBody}>
                           <div className={styles.itemName}>{tx.counterName || '—'}</div>
                           {tx.description && (
                              <div className={styles.itemDesc}>{tx.description}</div>
                           )}
                           <div className={styles.itemDate}>{formatDateTime(tx.date)}</div>
                        </div>
                        <div className={`${styles.itemAmount} ${tx.direction === 'in' ? styles.amtIn : styles.amtOut}`}>
                           {tx.direction === 'in' ? '+' : '−'}
                           {Number(tx.amount).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                           })}
                           <span className={styles.amtCurrency}>{tx.currency}</span>
                        </div>
                     </li>
                  ))}
               </ul>
            </section>

         </div>
      </div>
   );
};
