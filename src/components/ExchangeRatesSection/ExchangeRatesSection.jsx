import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './ExchangeRatesSection.module.css';
import { findRecentData, loadFromLocalStorage } from '../../utils';
import ExchangeRateChart from '../ExchangeRate/ExchangeRateChart';

const PAIR_LABELS = {
   usdToUah: { from: 'USD', to: 'UAH', flag: '🇺🇸→🇺🇦' },
   uahToUsd: { from: 'UAH', to: 'USD', flag: '🇺🇦→🇺🇸' },
   eurToUah: { from: 'EUR', to: 'UAH', flag: '🇪🇺→🇺🇦' },
   uahToEur: { from: 'UAH', to: 'EUR', flag: '🇺🇦→🇪🇺' },
   eurToUsd: { from: 'EUR', to: 'USD', flag: '🇪🇺→🇺🇸' },
   usdToEur: { from: 'USD', to: 'EUR', flag: '🇺🇸→🇪🇺' },
};

const PERIOD_OPTIONS = [
   { value: '7',   label: '7D' },
   { value: '30',  label: '1M' },
   { value: '90',  label: '3M' },
   { value: 'all', label: 'All' },
];

function priceDelta(history = []) {
   if (history.length < 2) return null;
   const first = history[0].buy;
   const last  = history[history.length - 1].buy;
   return ((last - first) / first) * 100;
}

const RateTable = ({ history }) => (
   <div className={styles.tableWrap}>
      <table className={styles.table}>
         <thead>
            <tr>
               <th>Date</th>
               <th>Buy</th>
               <th>Sell</th>
            </tr>
         </thead>
         <tbody>
            {[...history].reverse().map(day => (
               <tr key={day.date}>
                  <td>{day.date}</td>
                  <td className={styles.buy}>{day.buy}</td>
                  <td className={styles.sell}>{day.sell}</td>
               </tr>
            ))}
         </tbody>
      </table>
   </div>
);

export const ExchangeRatesSection = ({ data }) => {
   const [selected, setSelected]   = useState('usdToUah');
   const [period,   setPeriod]     = useState('30');
   const [viewType, setViewType]   = useState('chart');

   const userId = loadFromLocalStorage('userId');

   const pairs   = Object.entries(data);
   const current = data[selected];
   const label   = PAIR_LABELS[selected];
   const history = findRecentData(current?.history ?? [], period);
   const delta   = priceDelta(history);

   return (
      <div className={styles.page}>
         <div className="container">
            <div className={styles.pageTitleRow}>
               <h1 className={styles.pageTitle}>Exchange Rates</h1>
               {userId && (
                  <Link
                     to={`/${userId}/transactions/remittance`}
                     className={styles.exchangeBtn}
                  >
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4v5h5M16 16v-5h-5"/><path d="M4 9A8 8 0 0 1 15.7 6M16 11a8 8 0 0 1-11.7 3"/>
                     </svg>
                     Exchange currencies
                  </Link>
               )}
            </div>

            {/* ── Pair cards ── */}
            <div className={styles.pairsGrid}>
               {pairs.map(([key, pair]) => {
                  const lbl    = PAIR_LABELS[key];
                  const hist   = findRecentData(pair.history ?? [], '7');
                  const d      = priceDelta(hist);
                  const isUp   = d !== null && d >= 0;
                  return (
                     <button
                        key={key}
                        className={`${styles.pairCard} ${selected === key ? styles.pairCardActive : ''}`}
                        onClick={() => setSelected(key)}
                     >
                        <div className={styles.pairFlags}>{lbl?.flag ?? key}</div>
                        <div className={styles.pairName}>{lbl?.from} → {lbl?.to}</div>
                        <div className={styles.pairRate}>{pair.buy}</div>
                        {d !== null && (
                           <div className={`${styles.pairDelta} ${isUp ? styles.deltaUp : styles.deltaDown}`}>
                              {isUp ? '▲' : '▼'} {Math.abs(d).toFixed(2)}%
                           </div>
                        )}
                     </button>
                  );
               })}
            </div>

            {/* ── Detail panel ── */}
            <div className={styles.detail}>
               {/* Header */}
               <div className={styles.detailHeader}>
                  <div>
                     <h2 className={styles.detailTitle}>
                        {label?.flag} {label?.from} / {label?.to}
                     </h2>
                     <div className={styles.detailRates}>
                        <span className={styles.rateItem}>
                           <span className={styles.rateLabel}>Buy</span>
                           <span className={styles.buy}>{current?.buy}</span>
                        </span>
                        <span className={styles.rateSep}>·</span>
                        <span className={styles.rateItem}>
                           <span className={styles.rateLabel}>Sell</span>
                           <span className={styles.sell}>{current?.sell}</span>
                        </span>
                        {delta !== null && (
                           <span className={`${styles.deltaTag} ${delta >= 0 ? styles.deltaTagUp : styles.deltaTagDown}`}>
                              {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}%
                           </span>
                        )}
                     </div>
                  </div>

                  <div className={styles.controls}>
                     {/* Period */}
                     <div className={styles.pills}>
                        {PERIOD_OPTIONS.map(opt => (
                           <button
                              key={opt.value}
                              className={`${styles.pill} ${period === opt.value ? styles.pillActive : ''}`}
                              onClick={() => setPeriod(opt.value)}
                           >
                              {opt.label}
                           </button>
                        ))}
                     </div>
                     {/* View toggle */}
                     <div className={styles.pills}>
                        {['chart', 'table'].map(v => (
                           <button
                              key={v}
                              className={`${styles.pill} ${viewType === v ? styles.pillActive : ''}`}
                              onClick={() => setViewType(v)}
                           >
                              {v === 'chart' ? '📈' : '📋'}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Content */}
               <div className={styles.detailContent}>
                  {viewType === 'chart' ? (
                     <ExchangeRateChart
                        height="360px"
                        history={history}
                        currency={selected}
                     />
                  ) : (
                     <RateTable history={history} />
                  )}
               </div>
            </div>

         </div>
      </div>
   );
};
