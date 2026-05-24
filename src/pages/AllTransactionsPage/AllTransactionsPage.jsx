import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTransactionsByUserIdQuery, useGetAccountsByUserIdQuery } from '../../store';
import styles from './allTransactionsPage.module.css';

/* ── Helpers ─────────────────────────────────────────── */
const fmt = (n, cur = '') =>
   `${Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${cur ? ' ' + cur : ''}`;

const PERIOD_DAYS = { '7': 7, '30': 30, '90': 90, all: Infinity };

function withinPeriod(dateStr, days) {
   if (!isFinite(days)) return true;
   const cutoff = new Date();
   cutoff.setDate(cutoff.getDate() - days);
   return new Date(dateStr) >= cutoff;
}

const TYPE_LABEL = {
   transfer:          'Transfer',
   'external-transfer': 'External',
   exchange:          'Exchange',
   deposit:           'Deposit',
   withdrawal:        'Withdrawal',
};

const TYPE_ICON = {
   transfer:          '↔️',
   'external-transfer': '🏦',
   exchange:          '🔄',
   deposit:           '💰',
   withdrawal:        '🏧',
};

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

/* ── Direction pill ─────────────────────────────────── */
const DirBadge = ({ dir }) => (
   <span className={dir === 'in' ? styles.badgeIn : styles.badgeOut}>
      {dir === 'in' ? '+' : '−'}
   </span>
);

/* ── Single row ─────────────────────────────────────── */
const TxRow = ({ tx }) => {
   const isIn  = tx.direction === 'in';
   const date  = new Date(tx.date);
   const day   = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
   const time  = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
   return (
      <div className={styles.txRow}>
         <div className={styles.txIcon}>
            {TYPE_ICON[tx.type] ?? '💳'}
         </div>
         <div className={styles.txMeta}>
            <span className={styles.txDesc}>
               {tx.description || TYPE_LABEL[tx.type] || 'Transaction'}
            </span>
            <span className={styles.txSub}>
               {tx.counterName
                  ? `${isIn ? 'From' : 'To'}: ${tx.counterName}`
                  : TYPE_LABEL[tx.type] ?? tx.type}
               <span className={styles.txDot}>·</span>
               <span className={styles.txDate}>{day} {time}</span>
            </span>
         </div>
         <div className={`${styles.txAmount} ${isIn ? styles.amtIn : styles.amtOut}`}>
            {isIn ? '+' : '−'}{fmt(tx.amount, tx.currency)}
         </div>
      </div>
   );
};

/* ════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════ */
export const AllTransactionsPage = () => {
   const { userId } = useParams();

   const { data: allTxs    = [], isLoading: txLoad   } = useGetTransactionsByUserIdQuery(userId);
   const { data: accounts  = [], isLoading: accLoad  } = useGetAccountsByUserIdQuery(userId);

   /* ── Filters state ── */
   const [accountFilter, setAccountFilter] = useState('all');
   const [dirFilter,     setDirFilter]     = useState('all');
   const [periodFilter,  setPeriodFilter]  = useState('30');
   const [search,        setSearch]        = useState('');
   const [typeFilter,    setTypeFilter]    = useState('all');

   /* ── Derived account map ── */
   const accountsById = useMemo(() => {
      const map = {};
      accounts.forEach(a => { map[a.id] = a; });
      return map;
   }, [accounts]);

   /* ── Unique types in data ── */
   const allTypes = useMemo(() => {
      const s = new Set(allTxs.map(t => t.type).filter(Boolean));
      return ['all', ...s];
   }, [allTxs]);

   /* ── Filtered list ── */
   const filtered = useMemo(() => {
      const days = PERIOD_DAYS[periodFilter] ?? Infinity;
      const q = search.trim().toLowerCase();
      return allTxs.filter(tx => {
         if (accountFilter !== 'all' && tx.accountId !== accountFilter) return false;
         if (dirFilter !== 'all'     && tx.direction !== dirFilter)      return false;
         if (typeFilter !== 'all'    && tx.type     !== typeFilter)       return false;
         if (!withinPeriod(tx.date, days))                               return false;
         if (q && !(
            (tx.description ?? '').toLowerCase().includes(q) ||
            (tx.counterName  ?? '').toLowerCase().includes(q) ||
            (tx.counterAccountNumber ?? '').toLowerCase().includes(q)
         )) return false;
         return true;
      });
   }, [allTxs, accountFilter, dirFilter, typeFilter, periodFilter, search]);

   /* ── Summary ── */
   const summary = useMemo(() => {
      let totalIn = 0, totalOut = 0;
      filtered.forEach(tx => {
         if (tx.direction === 'in')  totalIn  += Number(tx.amount);
         if (tx.direction === 'out') totalOut += Number(tx.amount);
      });
      return { totalIn, totalOut, net: totalIn - totalOut };
   }, [filtered]);

   /* ── Group by date ── */
   const grouped = useMemo(() => {
      const groups = {};
      filtered.forEach(tx => {
         const key = new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
         if (!groups[key]) groups[key] = [];
         groups[key].push(tx);
      });
      return Object.entries(groups);
   }, [filtered]);

   const isLoading = txLoad || accLoad;

   return (
      <div className={styles.page}>
         <div className="container">

            {/* ── Page header ── */}
            <div className={styles.pageHead}>
               <div>
                  <h1 className={styles.pageTitle}>Transaction History</h1>
                  <p className={styles.pageSub}>All activity across your accounts</p>
               </div>
               <Link to={`/${userId}/transactions/remittance`} className={styles.transferBtn}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M3 7h14M3 7l3-3M3 7l3 3M17 13H3M17 13l-3-3M17 13l-3 3"/>
                  </svg>
                  New Transfer
               </Link>
            </div>

            {/* ── Summary strip ── */}
            <div className={styles.summaryStrip}>
               <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Incoming</span>
                  <span className={`${styles.summaryVal} ${styles.valIn}`}>
                     +{fmt(summary.totalIn)}
                  </span>
               </div>
               <div className={styles.summarySep} />
               <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Outgoing</span>
                  <span className={`${styles.summaryVal} ${styles.valOut}`}>
                     −{fmt(summary.totalOut)}
                  </span>
               </div>
               <div className={styles.summarySep} />
               <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Net</span>
                  <span className={`${styles.summaryVal} ${summary.net >= 0 ? styles.valIn : styles.valOut}`}>
                     {summary.net >= 0 ? '+' : ''}{fmt(summary.net)}
                  </span>
               </div>
               <div className={styles.summarySep} />
               <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Transactions</span>
                  <span className={styles.summaryVal}>{filtered.length}</span>
               </div>
            </div>

            {/* ── Filters ── */}
            <div className={styles.filters}>

               {/* Search */}
               <div className={styles.searchWrap}>
                  <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                     <circle cx="9" cy="9" r="5"/><path d="M20 20l-4.3-4.3"/>
                  </svg>
                  <input
                     className={styles.searchInput}
                     type="search"
                     placeholder="Search transactions…"
                     value={search}
                     onChange={e => setSearch(e.target.value)}
                  />
               </div>

               {/* Filter row */}
               <div className={styles.filterRow}>

                  {/* Account */}
                  <div className={styles.filterGroup}>
                     <label className={styles.filterLabel}>Account</label>
                     <div className={styles.selectWrap}>
                        <select className={styles.select} value={accountFilter} onChange={e => setAccountFilter(e.target.value)}>
                           <option value="all">All accounts</option>
                           {accounts.map(acc => (
                              <option key={acc.id} value={acc.id}>
                                 {CURRENCY_FLAGS[acc.currency] ?? ''} {acc.currency} · …{acc.accountNumber?.slice(-6) ?? acc.id}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>

                  {/* Direction */}
                  <div className={styles.filterGroup}>
                     <label className={styles.filterLabel}>Direction</label>
                     <div className={styles.pills}>
                        {['all', 'in', 'out'].map(d => (
                           <button
                              key={d}
                              className={`${styles.pill} ${dirFilter === d ? styles.pillActive : ''}`}
                              onClick={() => setDirFilter(d)}
                           >
                              {d === 'all' ? 'All' : d === 'in' ? '↑ In' : '↓ Out'}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Type */}
                  <div className={styles.filterGroup}>
                     <label className={styles.filterLabel}>Type</label>
                     <div className={styles.selectWrap}>
                        <select className={styles.select} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                           {allTypes.map(t => (
                              <option key={t} value={t}>
                                 {t === 'all' ? 'All types' : TYPE_LABEL[t] ?? t}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>

                  {/* Period */}
                  <div className={styles.filterGroup}>
                     <label className={styles.filterLabel}>Period</label>
                     <div className={styles.pills}>
                        {[['7','7D'],['30','1M'],['90','3M'],['all','All']].map(([v,l]) => (
                           <button
                              key={v}
                              className={`${styles.pill} ${periodFilter === v ? styles.pillActive : ''}`}
                              onClick={() => setPeriodFilter(v)}
                           >
                              {l}
                           </button>
                        ))}
                     </div>
                  </div>

               </div>
            </div>

            {/* ── Content ── */}
            {isLoading ? (
               <div className={styles.empty}>Loading…</div>
            ) : grouped.length === 0 ? (
               <div className={styles.empty}>
                  <span>🔍</span>
                  <p>No transactions match your filters.</p>
                  <button className={styles.resetBtn} onClick={() => {
                     setAccountFilter('all'); setDirFilter('all');
                     setTypeFilter('all'); setPeriodFilter('all'); setSearch('');
                  }}>
                     Reset filters
                  </button>
               </div>
            ) : (
               <div className={styles.list}>
                  {grouped.map(([date, txs]) => (
                     <div key={date} className={styles.group}>
                        <div className={styles.groupDate}>{date}</div>
                        <div className={styles.groupRows}>
                           {txs.map(tx => <TxRow key={tx.id} tx={tx} />)}
                        </div>
                     </div>
                  ))}
               </div>
            )}

         </div>
      </div>
   );
};
