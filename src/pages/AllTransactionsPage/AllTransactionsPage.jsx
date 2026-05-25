import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetTransactionsByUserIdQuery, useGetAccountsByUserIdQuery } from '../../store';
import { usePagination } from '../../hooks';
import { Pagination } from '../../components/commons';
import { TransactionModal } from '../../components/TransactionModal';
import styles from './allTransactionsPage.module.css';

/* ── Skeleton ─────────────────────────────────────────── */
const WIDTHS = [[72, 55, 80], [60, 45, 70], [85, 50, 65]];
const AllTxSkeleton = () => (
   <div className={styles.list}>
      {[0, 1, 2].map(g => (
         <div key={g} className={styles.skGroup}>
            <div className={styles.skDateBar}>
               <div className={`${styles.sk} ${styles.skDateLabel}`} />
            </div>
            {WIDTHS[g].map((w, i) => (
               <div key={i} className={styles.skTxRow}>
                  <div className={`${styles.sk} ${styles.skTxIcon}`} />
                  <div className={styles.skTxMeta}>
                     <div className={`${styles.sk} ${styles.skTxDesc}`} style={{ width: `${w}%` }} />
                     <div className={`${styles.sk} ${styles.skTxSub}`} />
                  </div>
                  <div className={`${styles.sk} ${styles.skTxAmt}`} />
               </div>
            ))}
         </div>
      ))}
   </div>
);

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
   transfer:            'Transfer',
   'external-transfer': 'External',
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

const PAGE_SIZE_OPTIONS = [10, 20, 50];

/* ── Single row ─────────────────────────────────────── */
const TxRow = ({ tx, onOpen }) => {
   const isIn  = tx.direction === 'in';
   const date  = new Date(tx.date);
   const day   = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
   const time  = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
   return (
      <div className={styles.txRow} onClick={() => onOpen(tx)} title="View details">
         <div className={styles.txIcon}>{TYPE_ICON[tx.type] ?? '💳'}</div>
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

   const { data: allTxs   = [], isLoading: txLoad  } = useGetTransactionsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });
   const { data: accounts = [], isLoading: accLoad } = useGetAccountsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });

   /* ── Modal state ── */
   const [selectedTx, setSelectedTx] = useState(null);

   /* ── Filter state ── */
   const [accountFilter, setAccountFilter] = useState('all');
   const [dirFilter,     setDirFilter]     = useState('all');
   const [periodFilter,  setPeriodFilter]  = useState('all');
   const [search,        setSearch]        = useState('');
   const [typeFilter,    setTypeFilter]    = useState('all');
   const [pageSize,      setPageSize]      = useState(10);

   /* ── Unique types in data ── */
   const allTypes = useMemo(() => {
      const s = new Set(allTxs.map(t => t.type).filter(Boolean));
      return ['all', ...s];
   }, [allTxs]);

   /* ── Filtered list ── */
   const filtered = useMemo(() => {
      const days = PERIOD_DAYS[periodFilter] ?? Infinity;
      const q    = search.trim().toLowerCase();
      return allTxs.filter(tx => {
         if (accountFilter !== 'all' && tx.accountId !== accountFilter) return false;
         if (dirFilter     !== 'all' && tx.direction !== dirFilter)     return false;
         if (typeFilter    !== 'all' && tx.type      !== typeFilter)    return false;
         if (!withinPeriod(tx.date, days))                              return false;
         if (q && !(
            (tx.description          ?? '').toLowerCase().includes(q) ||
            (tx.counterName          ?? '').toLowerCase().includes(q) ||
            (tx.counterAccountNumber ?? '').toLowerCase().includes(q)
         )) return false;
         return true;
      });
   }, [allTxs, accountFilter, dirFilter, typeFilter, periodFilter, search]);

   /* ── Summary (grouped by currency) ── */
   const summary = useMemo(() => {
      const byCurrency = {};
      filtered.forEach(tx => {
         const cur = tx.currency ?? '?';
         if (!byCurrency[cur]) byCurrency[cur] = { in: 0, out: 0 };
         if (tx.direction === 'in')  byCurrency[cur].in  += Number(tx.amount);
         if (tx.direction === 'out') byCurrency[cur].out += Number(tx.amount);
      });
      return { byCurrency, currencies: Object.keys(byCurrency) };
   }, [filtered]);

   /* ── Pagination ── */
   const {
      page, totalPages, totalItems, pageItems,
      setPage, prevPage, nextPage, startIndex, endIndex,
   } = usePagination(filtered, pageSize);

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

   /* ── Summary renderers ── */
   const renderAmounts = (dir) => {
      const sign   = dir === 'in' ? '+' : '−';
      const valCls = dir === 'in'
         ? `${styles.summaryVal} ${styles.valIn}`
         : `${styles.summaryVal} ${styles.valOut}`;
      const items = summary.currencies
         .map(cur => ({ cur, val: summary.byCurrency[cur][dir] }))
         .filter(({ val }) => val > 0);
      if (items.length === 0) return <span className={styles.summaryVal}>—</span>;
      return items.map(({ cur, val }) => (
         <span key={cur} className={valCls}>{sign}{fmt(val)} {cur}</span>
      ));
   };

   const renderNet = () => {
      if (summary.currencies.length === 0) return <span className={styles.summaryVal}>—</span>;
      return summary.currencies.map(cur => {
         const net = summary.byCurrency[cur].in - summary.byCurrency[cur].out;
         const cls = net >= 0
            ? `${styles.summaryVal} ${styles.valIn}`
            : `${styles.summaryVal} ${styles.valOut}`;
         return (
            <span key={cur} className={cls}>
               {net >= 0 ? '+' : ''}{fmt(net)} {cur}
            </span>
         );
      });
   };

   const isLoading = txLoad || accLoad;

   const resetFilters = () => {
      setAccountFilter('all'); setDirFilter('all');
      setTypeFilter('all');    setPeriodFilter('all'); setSearch('');
   };

   return (
      <>
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
                  {renderAmounts('in')}
               </div>
               <div className={styles.summarySep} />
               <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Outgoing</span>
                  {renderAmounts('out')}
               </div>
               <div className={styles.summarySep} />
               <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Net</span>
                  {renderNet()}
               </div>
               <div className={styles.summarySep} />
               <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total</span>
                  <span className={styles.summaryVal}>{filtered.length}</span>
               </div>
            </div>

            {/* ── Filters ── */}
            <div className={styles.filters}>

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

               <div className={styles.filterRow}>

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

                  {/* Per-page selector */}
                  <div className={styles.filterGroup}>
                     <label className={styles.filterLabel}>Per page</label>
                     <div className={styles.pills}>
                        {PAGE_SIZE_OPTIONS.map(n => (
                           <button
                              key={n}
                              className={`${styles.pill} ${pageSize === n ? styles.pillActive : ''}`}
                              onClick={() => setPageSize(n)}
                           >
                              {n}
                           </button>
                        ))}
                     </div>
                  </div>

               </div>
            </div>

            {/* ── Content ── */}
            {isLoading ? (
               <AllTxSkeleton />
            ) : grouped.length === 0 ? (
               <div className={styles.empty}>
                  <span>🔍</span>
                  <p>No transactions match your filters.</p>
                  <button className={styles.resetBtn} onClick={resetFilters}>Reset filters</button>
               </div>
            ) : (
               <>
                  <div className={styles.list}>
                     {grouped.map(([date, txs]) => (
                        <div key={date} className={styles.group}>
                           <div className={styles.groupDate}>{date}</div>
                           <div className={styles.groupRows}>
                              {txs.map(tx => <TxRow key={tx.id} tx={tx} onOpen={setSelectedTx} />)}
                           </div>
                        </div>
                     ))}
                  </div>

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

         </div>
      </div>

      {selectedTx && (
         <TransactionModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
      )}
      </>
   );
};
