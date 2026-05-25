import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
   useGetTransactionsByAccountIdQuery,
   useGetAccountByIdQuery,
   useGetCardsByUserIdQuery,
} from '../../store';
import { loadFromLocalStorage, formatDateTime, getSetting } from '../../utils';
import { usePagination } from '../../hooks';
import { Card, Pagination } from '../../components/commons';
import { TransactionModal } from '../../components/TransactionModal';
import styles from './CardTransactionsPage.module.css';

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

const TYPE_LABEL = {
   transfer:            'Transfer',
   'external-transfer': 'External',
   exchange:            'Exchange',
   deposit:             'Deposit',
   withdrawal:          'Withdrawal',
};

const PAGE_SIZE = 10;

const CardTxSkeleton = () => (
   <div className={styles.page}>
      <div className="container">
         <div className={`${styles.sk} ${styles.skBackLink}`} />
         <div className={`${styles.sk} ${styles.skHeader}`} />
         <div className={styles.skListWrap}>
            {[...Array(6)].map((_, i) => (
               <div key={i} className={styles.skTxRow}>
                  <div className={`${styles.sk} ${styles.skTxIcon}`} />
                  <div className={styles.skTxMeta}>
                     <div className={`${styles.sk} ${styles.skTxDesc}`}
                          style={{ width: `${[75, 60, 80, 55, 70, 65][i]}%` }} />
                     <div className={`${styles.sk} ${styles.skTxSub}`} />
                  </div>
                  <div className={`${styles.sk} ${styles.skTxAmount}`} />
               </div>
            ))}
         </div>
      </div>
   </div>
);

export const CardTransactionsPage = () => {
   const { accountId } = useParams();
   const userId        = loadFromLocalStorage('userId');

   const { data: account,          isLoading: accLoading   } = useGetAccountByIdQuery(accountId);
   const { data: transactions = [], isLoading: txLoading    } = useGetTransactionsByAccountIdQuery(accountId, { refetchOnMountOrArgChange: true });
   const { data: allCards = [],     isLoading: cardsLoading } = useGetCardsByUserIdQuery(userId);

   const [copied,     setCopied]     = useState(false);
   const [dirFilter,  setDirFilter]  = useState('all');
   const [typeFilter, setTypeFilter] = useState('all');
   const [selectedTx, setSelectedTx] = useState(null);

   const hideBalances = getSetting('hideBalances', false);

   const isLoading   = accLoading || txLoading || cardsLoading;
   const linkedCards = allCards.filter(c => c.accountId === accountId);

   /* ── All unique types ── */
   const allTypes = useMemo(() => {
      const s = new Set(transactions.map(t => t.type).filter(Boolean));
      return ['all', ...s];
   }, [transactions]);

   /* ── Filtered ── */
   const filtered = useMemo(() =>
      transactions.filter(tx => {
         if (dirFilter  !== 'all' && tx.direction !== dirFilter)  return false;
         if (typeFilter !== 'all' && tx.type      !== typeFilter) return false;
         return true;
      }),
   [transactions, dirFilter, typeFilter]);

   /* ── Pagination ── */
   const {
      page, totalPages, totalItems, pageItems,
      setPage, prevPage, nextPage, startIndex, endIndex,
   } = usePagination(filtered, PAGE_SIZE);

   /* ── Monthly spending (out txs this calendar month) ── */
   const monthlySpent = useMemo(() => {
      const now   = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return transactions
         .filter(tx => tx.direction === 'out' && new Date(tx.date) >= start)
         .reduce((sum, tx) => sum + Number(tx.amount), 0);
   }, [transactions]);

   /* ── Group current page by date ── */
   const grouped = useMemo(() => {
      const groups = {};
      pageItems.forEach(tx => {
         const key = new Date(tx.date).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric',
         });
         if (!groups[key]) groups[key] = [];
         groups[key].push(tx);
      });
      return Object.entries(groups);
   }, [pageItems]);

   if (isLoading) return <CardTxSkeleton />;
   if (!account)  return <div className={styles.loading}>Account not found.</div>;

   const handleCopy = () => {
      navigator.clipboard.writeText(account.accountNumber).then(() => {
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      });
   };

   const fmt = n => Number(n).toLocaleString('en-US', {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
   });

   return (
      <>
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
                        Opened {new Date(account.createdAt).toLocaleDateString('en-GB', {
                           day: 'numeric', month: 'long', year: 'numeric',
                        })}
                     </div>
                  </div>
               </div>
               <div className={styles.balanceBlock}>
                  <div className={styles.balanceLabel}>Available balance</div>
                  <div className={styles.accountBalance}>
                     {hideBalances
                        ? <span className={styles.balanceHidden}>••••••</span>
                        : <>{fmt(account.balance)}<span className={styles.balanceCurrency}>{account.currency}</span></>
                     }
                  </div>
               </div>
            </div>

            {/* ── Quick actions ── */}
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

            {/* ── Linked cards ── */}
            {linkedCards.length > 0 && (
               <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                     Linked cards
                     <span className={styles.sectionCount}>{linkedCards.length}</span>
                  </h2>
                  <div className={styles.cardsRow}>
                     {linkedCards.map(card => {
                        const limit = Number(card.spendingLimit ?? 0);
                        const pct   = limit > 0 ? Math.min((monthlySpent / limit) * 100, 100) : 0;
                        const over  = limit > 0 && monthlySpent > limit;
                        return (
                           <div key={card.id}>
                              <Link to={`/${userId}/cards/${card.number}`} className={styles.cardLink}>
                                 <Card card={card} currency={account.currency} balance={account.balance} />
                              </Link>
                              {limit > 0 && (
                                 <div className={styles.limitBar}>
                                    <div className={styles.limitBarHead}>
                                       <span className={styles.limitLabel}>Monthly limit</span>
                                       <span className={`${styles.limitValue} ${over ? styles.limitOver : ''}`}>
                                          {fmt(monthlySpent)} / {fmt(limit)} {account.currency}
                                       </span>
                                    </div>
                                    <div className={styles.limitTrack}>
                                       <div
                                          className={`${styles.limitFill} ${over ? styles.limitFillOver : ''}`}
                                          style={{ width: `${pct}%` }}
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        );
                     })}
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

            {/* ── Transaction history ── */}
            <section className={styles.section}>
               <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>
                     Transaction history
                     {transactions.length > 0 && (
                        <span className={styles.sectionCount}>{transactions.length}</span>
                     )}
                  </h2>

                  {/* ── Inline filters ── */}
                  {transactions.length > 0 && (
                     <div className={styles.txFilters}>
                        {/* Direction pills */}
                        <div className={styles.txPills}>
                           {['all', 'in', 'out'].map(d => (
                              <button
                                 key={d}
                                 className={`${styles.txPill} ${dirFilter === d ? styles.txPillActive : ''}`}
                                 onClick={() => setDirFilter(d)}
                              >
                                 {d === 'all' ? 'All' : d === 'in' ? '↑ In' : '↓ Out'}
                              </button>
                           ))}
                        </div>
                        {/* Type select */}
                        <select
                           className={styles.txTypeSelect}
                           value={typeFilter}
                           onChange={e => setTypeFilter(e.target.value)}
                        >
                           {allTypes.map(t => (
                              <option key={t} value={t}>
                                 {t === 'all' ? 'All types' : TYPE_LABEL[t] ?? t}
                              </option>
                           ))}
                        </select>
                     </div>
                  )}
               </div>

               {filtered.length === 0 && (
                  <div className={styles.empty}>
                     <span>📋</span>
                     <p>{transactions.length === 0 ? 'No transactions yet.' : 'No transactions match the filter.'}</p>
                  </div>
               )}

               {grouped.length > 0 && (
                  <>
                     {grouped.map(([date, txs]) => (
                        <div key={date} className={styles.dateGroup}>
                           <div className={styles.dateLabel}>{date}</div>
                           <ul className={styles.list}>
                              {txs.map(tx => (
                                 <li key={tx.id} className={styles.item} onClick={() => setSelectedTx(tx)} style={{ cursor: 'pointer' }}>
                                    <div className={`${styles.dirBadge} ${tx.direction === 'in' ? styles.dirIn : styles.dirOut}`}>
                                       {tx.direction === 'in' ? '↓' : '↑'}
                                    </div>
                                    <div className={styles.itemBody}>
                                       <div className={styles.itemName}>{tx.counterName || TYPE_LABEL[tx.type] || '—'}</div>
                                       {tx.description && (
                                          <div className={styles.itemDesc}>{tx.description}</div>
                                       )}
                                       <div className={styles.itemDate}>{formatDateTime(tx.date)}</div>
                                    </div>
                                    <div className={`${styles.itemAmount} ${tx.direction === 'in' ? styles.amtIn : styles.amtOut}`}>
                                       {tx.direction === 'in' ? '+' : '−'}
                                       {fmt(tx.amount)}
                                       <span className={styles.amtCurrency}>{tx.currency}</span>
                                    </div>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     ))}

                     <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        onPage={setPage}
                        onPrev={prevPage}
                        onNext={nextPage}
                        label="transactions"
                     />
                  </>
               )}
            </section>

         </div>
      </div>

      {selectedTx && (
         <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
   </>
   );
};

