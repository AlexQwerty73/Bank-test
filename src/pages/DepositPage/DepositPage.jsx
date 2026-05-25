import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePagination } from '../../hooks';
import { Pagination } from '../../components/commons';
import {
   useGetDepositApiQuery,
   useGetAccountsByUserIdQuery,
   useGetAccountByIdQuery,
   useUpdateAccountMutation,
   useAddTransactionMutation,
   useGetUserDepositsByUserIdQuery,
   useAddUserDepositMutation,
   useUpdateUserDepositMutation,
} from '../../store';
import styles from './depositPage.module.css';

/* ── helpers ─────────────────────────────────────────── */
const fmt = (n, decimals = 2) =>
   Number(n).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const VALID_CURRENCIES = ['UAH', 'USD', 'EUR'];
const getDefaultCurrency = () => {
   try {
      const v = JSON.parse(localStorage.getItem('app_currency') ?? 'null');
      return VALID_CURRENCIES.includes(v) ? v : 'UAH';
   } catch { return 'UAH'; }
};

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };
const CURRENCY_COLOR = { USD: '#059669', EUR: '#2563EB', UAH: '#D97706' };

function calcDeposit(amount, months, currency, depositData) {
   if (!depositData || !currency) return null;
   const rate = depositData[currency]?.monthlyInterestRates?.[months];
   if (!rate) return null;
   const interest      = ((amount * (rate / 100)) / 12) * months;
   const tax           = interest * (depositData.tax ?? 0.19);
   const total         = amount + interest;
   const totalAfterTax = total - tax;
   return { amount, months, currency, rate, interest, tax, total, totalAfterTax };
}

function maturityDate(openedAt, months) {
   const d = new Date(openedAt);
   d.setMonth(d.getMonth() + months);
   return d;
}

function progress(openedAt, months) {
   const start = new Date(openedAt).getTime();
   const end   = maturityDate(openedAt, months).getTime();
   const now   = Date.now();
   return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}

/* ════════════════════════════════════════════════════════
   CALCULATOR PANEL
   ════════════════════════════════════════════════════════ */
const Calculator = ({ depositData, accounts, userId, onOpened }) => {
   const [currency, setCurrency] = useState(getDefaultCurrency);
   const [months,   setMonths]   = useState(12);
   const [amount,   setAmount]   = useState('');
   const [withTax,  setWithTax]  = useState(true);
   const [fromId,   setFromId]   = useState('');
   const [error,    setError]    = useState('');
   const [loading,  setLoading]  = useState(false);
   const [success,  setSuccess]  = useState(false);

   const [updateAccount]   = useUpdateAccountMutation();
   const [addTransaction]  = useAddTransactionMutation();
   const [addUserDeposit]  = useAddUserDepositMutation();

   const minMonths = depositData?.minMonths ?? 3;
   const maxMonths = depositData?.maxMonths ?? 24;
   const minAmt    = depositData?.[currency]?.minAmount ?? 100;
   const maxAmt    = depositData?.[currency]?.maxAmount ?? 1000000;

   /* filter accounts matching selected currency */
   const validAccounts = useMemo(
      () => accounts.filter(a => a.currency === currency),
      [accounts, currency],
   );

   /* auto-select first matching account */
   useEffect(() => {
      if (validAccounts.length > 0 && !validAccounts.find(a => a.id === fromId)) {
         setFromId(validAccounts[0]?.id ?? '');
      }
   }, [validAccounts]); // eslint-disable-line

   const parsedAmt = parseFloat(amount) || 0;
   const calc      = parsedAmt >= minAmt ? calcDeposit(parsedAmt, months, currency, depositData) : null;
   const sender    = accounts.find(a => a.id === fromId) ?? null;

   const payout    = calc ? (withTax ? calc.totalAfterTax : calc.total) : 0;
   const profit    = calc ? (withTax ? calc.totalAfterTax - parsedAmt : calc.interest) : 0;

   const amtError  = parsedAmt > 0 && (parsedAmt < minAmt || parsedAmt > maxAmt);
   const noAccount = validAccounts.length === 0;
   const noFunds   = sender && parsedAmt > 0 && parsedAmt > Number(sender.balance);

   const canOpen   = calc && !amtError && !noAccount && !noFunds && sender && !loading;

   const handleOpen = async () => {
      if (!canOpen) return;
      setLoading(true); setError('');
      try {
         const now      = new Date().toISOString();
         const matures  = maturityDate(now, months).toISOString();

         /* deduct from account */
         await updateAccount({
            ...sender,
            balance: parseFloat((Number(sender.balance) - parsedAmt).toFixed(2)),
         }).unwrap();

         /* record transaction */
         await addTransaction({
            accountId: sender.id, userId,
            direction: 'out', amount: parsedAmt, currency,
            counterAccountId: null, counterAccountNumber: null,
            counterName: 'Deposit account',
            description: `Deposit opened · ${months} months`,
            type: 'deposit', date: now,
         }).unwrap();

         /* create deposit record */
         await addUserDeposit({
            userId,
            accountId: sender.id,
            currency,
            amount:         parsedAmt,
            months,
            interestRate:   calc.rate,
            interest:       parseFloat(calc.interest.toFixed(2)),
            tax:            parseFloat(calc.tax.toFixed(2)),
            total:          parseFloat(calc.total.toFixed(2)),
            totalAfterTax:  parseFloat(calc.totalAfterTax.toFixed(2)),
            openedAt:  now,
            maturesAt: matures,
            status:    'active',
         }).unwrap();

         setSuccess(true);
         setAmount('');
         setTimeout(() => { setSuccess(false); onOpened?.(); }, 2000);
      } catch { setError('Failed to open deposit. Please try again.'); }
      finally  { setLoading(false); }
   };

   return (
      <div className={styles.calcWrap}>
         <h2 className={styles.calcTitle}>New deposit</h2>

         {/* ── Currency selector ── */}
         <div className={styles.currencyRow}>
            {['UAH', 'USD', 'EUR'].map(cur => (
               <button
                  key={cur}
                  className={`${styles.curBtn} ${currency === cur ? styles.curBtnActive : ''}`}
                  onClick={() => { setCurrency(cur); setAmount(''); }}
               >
                  <span>{CURRENCY_FLAGS[cur]}</span>
                  <span>{cur}</span>
               </button>
            ))}
         </div>

         {/* ── Amount ── */}
         <div className={styles.field}>
            <label className={styles.label}>
               Amount
               <span className={styles.labelHint}> (min {fmt(minAmt, 0)} – max {fmt(maxAmt, 0)} {currency})</span>
            </label>
            <div className={styles.amountWrap}>
               <input
                  className={`${styles.input} ${amtError ? styles.inputErr : ''}`}
                  type="number" min={minAmt} max={maxAmt} step="100"
                  placeholder={`${minAmt}`}
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
               />
               <span className={styles.amountCur} style={{ color: CURRENCY_COLOR[currency] }}>
                  {currency}
               </span>
            </div>
            {amtError && (
               <p className={styles.fieldErr}>
                  Amount must be between {fmt(minAmt, 0)} and {fmt(maxAmt, 0)} {currency}
               </p>
            )}
         </div>

         {/* ── Term slider ── */}
         <div className={styles.field}>
            <div className={styles.sliderHeader}>
               <label className={styles.label}>Term</label>
               <span className={styles.sliderVal}>{months} months</span>
            </div>
            <input
               className={styles.slider}
               type="range" min={minMonths} max={maxMonths} value={months}
               onChange={e => setMonths(parseInt(e.target.value))}
            />
            <div className={styles.sliderTicks}>
               <span>{minMonths}m</span>
               <span>12m</span>
               <span>{maxMonths}m</span>
            </div>
         </div>

         {/* ── Live result ── */}
         {calc && (
            <div className={styles.result}>
               <div className={styles.resultMain}>
                  <span className={styles.resultLabel}>You will receive</span>
                  <span className={styles.resultPayout}>
                     {fmt(payout)} <span className={styles.resultCur}>{currency}</span>
                  </span>
                  <span className={styles.resultProfit}>
                     +{fmt(profit)} profit
                  </span>
               </div>
               <div className={styles.resultRows}>
                  <div className={styles.resultRow}>
                     <span>Annual rate</span>
                     <strong>{calc.rate}%</strong>
                  </div>
                  <div className={styles.resultRow}>
                     <span>Interest earned</span>
                     <strong>+{fmt(calc.interest)} {currency}</strong>
                  </div>
                  <div className={styles.resultRow}>
                     <span>Tax (19%)</span>
                     <strong>−{fmt(calc.tax)} {currency}</strong>
                  </div>
               </div>
               <label className={styles.taxToggle}>
                  <input type="checkbox" checked={withTax} onChange={e => setWithTax(e.target.checked)} />
                  <span className={styles.taxToggleLabel}>Show after tax</span>
               </label>
            </div>
         )}

         {/* ── Account selector ── */}
         {noAccount ? (
            <p className={styles.noAccount}>
               You have no {currency} account. <a href="create-account">Open one</a> first.
            </p>
         ) : (
            <div className={styles.field}>
               <label className={styles.label}>Deduct from account</label>
               <div className={styles.selectWrap}>
                  <select className={styles.select} value={fromId} onChange={e => setFromId(e.target.value)}>
                     {validAccounts.map(acc => (
                        <option key={acc.id} value={acc.id}>
                           {CURRENCY_FLAGS[acc.currency]} {acc.currency} · {fmt(acc.balance)} · …{acc.accountNumber?.slice(-6)}
                        </option>
                     ))}
                  </select>
               </div>
               {sender && (
                  <div className={styles.balanceHint}>
                     Balance: <b>{fmt(sender.balance)} {currency}</b>
                     {noFunds && <span className={styles.fundErr}> — insufficient funds</span>}
                  </div>
               )}
            </div>
         )}

         {error && <p className={styles.error}>{error}</p>}

         {success ? (
            <div className={styles.successMsg}>
               <span>🎉</span> Deposit opened successfully!
            </div>
         ) : (
            <button
               className={styles.openBtn}
               onClick={handleOpen}
               disabled={!canOpen}
            >
               {loading
                  ? 'Opening…'
                  : calc && !amtError && !noAccount && !noFunds
                     ? `Open deposit · ${fmt(payout)} ${currency} at maturity`
                     : 'Open deposit'}
            </button>
         )}
      </div>
   );
};

/* ════════════════════════════════════════════════════════
   DEPOSIT CARD
   ════════════════════════════════════════════════════════ */
/* ── Early close calculation ─────────────────────────
   Returns: earned interest with 50% penalty, after 19% tax
   Real bank rule: you get 50% of proportionally-earned interest
   ─────────────────────────────────────────────────── */
function earlyCloseReturn(dep) {
   const elapsed   = Date.now() - new Date(dep.openedAt).getTime();
   const totalMs   = dep.months * 30 * 86400000;
   const ratio     = Math.min(1, elapsed / totalMs);
   const earned    = dep.interest * ratio;              // proportional interest
   const penalised = earned * 0.5;                      // 50% penalty on earned
   const tax       = penalised * 0.19;
   const payout    = parseFloat((dep.amount + penalised - tax).toFixed(2));
   const netInterest = parseFloat((penalised - tax).toFixed(2));
   const daysDone  = Math.floor(elapsed / 86400000);
   return { payout, netInterest, penalised, tax, daysDone };
}

const DepositCard = ({ dep, userId }) => {
   const [closing,    setClosing]    = useState(false);
   const [confirm,    setConfirm]    = useState(false);

   const { data: linkedAccount } = useGetAccountByIdQuery(dep.accountId);
   const earlyCalc = useMemo(() => earlyCloseReturn(dep), [dep]);

   const [updateAccount]      = useUpdateAccountMutation();
   const [addTransaction]     = useAddTransactionMutation();
   const [updateUserDeposit]  = useUpdateUserDepositMutation();

   const matures  = maturityDate(dep.openedAt, dep.months);
   const prog     = progress(dep.openedAt, dep.months);
   const isActive = dep.status === 'active';
   const isMatured = Date.now() >= matures.getTime();

   /* how many days left */
   const daysLeft = Math.max(0, Math.ceil((matures.getTime() - Date.now()) / 86400000));

   /* early close: return principal + partial earned interest (50% penalty) */
   const handleClose = async () => {
      if (!linkedAccount) return;
      setClosing(true);
      try {
         const now = new Date().toISOString();

         /* credit partial payout (principal + penalised interest after tax) */
         await updateAccount({
            ...linkedAccount,
            balance: parseFloat((Number(linkedAccount.balance) + earlyCalc.payout).toFixed(2)),
         }).unwrap();

         await addTransaction({
            accountId: dep.accountId, userId,
            direction: 'in', amount: earlyCalc.payout, currency: dep.currency,
            counterAccountId: null, counterAccountNumber: null,
            counterName: 'Deposit account',
            description: `Deposit closed early after ${earlyCalc.daysDone}d — partial interest applied`,
            type: 'deposit', date: now,
         }).unwrap();

         await updateUserDeposit({
            id: dep.id, userId,
            status: 'closed',
            closedAt: now,
            earlyClose: true,
            earlyPayout: earlyCalc.payout,
         }).unwrap();

         setConfirm(false);
      } finally { setClosing(false); }
   };

   /* collect payout at maturity */
   const handleCollect = async () => {
      if (!linkedAccount) return;
      setClosing(true);
      try {
         const now = new Date().toISOString();

         /* credit full payout (principal + interest after tax) to account */
         await updateAccount({
            ...linkedAccount,
            balance: parseFloat((Number(linkedAccount.balance) + dep.totalAfterTax).toFixed(2)),
         }).unwrap();

         await addTransaction({
            accountId: dep.accountId, userId,
            direction: 'in', amount: dep.totalAfterTax, currency: dep.currency,
            counterAccountId: null, counterAccountNumber: null,
            counterName: 'Deposit account',
            description: `Deposit matured · ${dep.months}m · +${fmt(dep.interest)} interest`,
            type: 'deposit', date: now,
         }).unwrap();

         await updateUserDeposit({
            id: dep.id, userId,
            status: 'collected',
            collectedAt: now,
         }).unwrap();
      } finally { setClosing(false); }
   };

   const color = CURRENCY_COLOR[dep.currency] ?? '#4F46E5';
   const nearMaturity = isActive && !isMatured && daysLeft > 0 && daysLeft <= 7;

   return (
      <div className={`${styles.depCard} ${!isActive ? styles.depCardClosed : ''} ${nearMaturity ? styles.depCardUrgent : ''}`}>

         {/* Near-maturity warning */}
         {nearMaturity && (
            <div className={styles.maturityBanner}>
               🔔 <strong>Matures in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</strong> — collect your funds soon to avoid missing the payout window.
            </div>
         )}

         {/* Header */}
         <div className={styles.depCardHead}>
            <div className={styles.depCurCircle} style={{ background: color + '22', color }}>
               {CURRENCY_FLAGS[dep.currency]}
            </div>
            <div className={styles.depCardMeta}>
               <span className={styles.depAmount}>{fmt(dep.amount)} {dep.currency}</span>
               <span className={styles.depTerm}>{dep.months}-month deposit</span>
            </div>
            <span className={`${styles.statusChip} ${
               dep.status === 'active'    ? styles.chipActive    :
               dep.status === 'collected' ? styles.chipCollected :
               styles.chipClosed
            }`}>
               {dep.status === 'active' ? (isMatured ? '🔔 Matured' : '✦ Active') :
                dep.status === 'collected' ? '✓ Collected' : '✕ Closed'}
            </span>
         </div>

         {/* Progress bar */}
         {isActive && (
            <div className={styles.progWrap}>
               <div className={styles.progBar}>
                  <div className={styles.progFill} style={{ width: `${prog}%`, background: color }} />
               </div>
               <div className={styles.progLabels}>
                  <span>{new Date(dep.openedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  <span>{daysLeft > 0 ? `${daysLeft}d left` : 'Ready to collect'}</span>
                  <span>{matures.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
               </div>
            </div>
         )}

         {/* Rows */}
         <div className={styles.depRows}>
            <div className={styles.depRow}>
               <span>Annual rate</span>
               <strong>{dep.interestRate}%</strong>
            </div>
            <div className={styles.depRow}>
               <span>Interest</span>
               <strong style={{ color: '#059669' }}>+{fmt(dep.interest)} {dep.currency}</strong>
            </div>
            <div className={styles.depRow}>
               <span>Payout at maturity</span>
               <strong>{fmt(dep.totalAfterTax)} {dep.currency}</strong>
            </div>
         </div>

         {/* Actions */}
         {isActive && (
            <div className={styles.depActions}>
               {isMatured ? (
                  <button
                     className={styles.collectBtn}
                     onClick={handleCollect}
                     disabled={closing}
                  >
                     {closing ? 'Processing…' : `Collect ${fmt(dep.totalAfterTax)} ${dep.currency}`}
                  </button>
               ) : (
                  !confirm ? (
                     <button className={styles.closeEarlyBtn} onClick={() => setConfirm(true)}>
                        Close early
                     </button>
                  ) : (
                     <div className={styles.confirmClose}>
                        <p className={styles.confirmCloseTitle}>⚠ Early closure terms</p>
                        <div className={styles.confirmCloseRows}>
                           <div className={styles.confirmCloseRow}>
                              <span>Days elapsed</span>
                              <strong>{earlyCalc.daysDone}d of {dep.months * 30}d</strong>
                           </div>
                           <div className={styles.confirmCloseRow}>
                              <span>Earned interest (50% rate)</span>
                              <strong>+{fmt(earlyCalc.penalised)} {dep.currency}</strong>
                           </div>
                           <div className={styles.confirmCloseRow}>
                              <span>Tax (19%)</span>
                              <strong>−{fmt(earlyCalc.tax)} {dep.currency}</strong>
                           </div>
                           <div className={`${styles.confirmCloseRow} ${styles.confirmCloseTotal}`}>
                              <span>You receive</span>
                              <strong>{fmt(earlyCalc.payout)} {dep.currency}</strong>
                           </div>
                        </div>
                        <p className={styles.confirmCloseNote}>
                           vs {fmt(dep.totalAfterTax)} {dep.currency} if held to maturity
                        </p>
                        <div className={styles.confirmCloseActions}>
                           <button className={styles.confirmCloseYes} onClick={handleClose} disabled={closing}>
                              {closing ? 'Closing…' : `Close & receive ${fmt(earlyCalc.payout)} ${dep.currency}`}
                           </button>
                           <button className={styles.confirmCloseNo} onClick={() => setConfirm(false)}>
                              Keep deposit
                           </button>
                        </div>
                     </div>
                  )
               )}
            </div>
         )}

         {dep.status === 'closed' && dep.closedAt && (
            <p className={styles.closedNote}>
               Closed {new Date(dep.closedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
               {dep.earlyClose ? ' (early)' : ''}
            </p>
         )}
         {dep.status === 'collected' && dep.collectedAt && (
            <p className={styles.closedNote}>
               Collected {new Date(dep.collectedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
         )}
      </div>
   );
};

/* ════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════ */
const ACTIVE_PAGE_SIZE = 5;
const CLOSED_PAGE_SIZE = 4;

export const DepositPage = () => {
   const { userId } = useParams();
   const [showClosed, setShowClosed] = useState(false);

   const { data: depositData = {} }       = useGetDepositApiQuery();
   const { data: accounts = [] }          = useGetAccountsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });
   const { data: deposits = [], refetch } = useGetUserDepositsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });

   const active  = deposits.filter(d => d.status === 'active');
   const closed  = deposits.filter(d => d.status !== 'active');

   /* Pagination for active deposits */
   const {
      page: activePage, totalPages: activeTotalPages, totalItems: activeTotalItems,
      pageItems: activePageItems, setPage: setActivePage,
      prevPage: activePrev, nextPage: activeNext, startIndex: activeStart, endIndex: activeEnd,
   } = usePagination(active, ACTIVE_PAGE_SIZE);

   /* Pagination for closed deposits */
   const {
      page: closedPage, totalPages: closedTotalPages, totalItems: closedTotalItems,
      pageItems: closedPageItems, setPage: setClosedPage,
      prevPage: closedPrev, nextPage: closedNext, startIndex: closedStart, endIndex: closedEnd,
   } = usePagination(closed, CLOSED_PAGE_SIZE);

   /* rate table: best rate per currency */
   const highlights = useMemo(() => {
      return ['UAH', 'USD', 'EUR'].map(cur => {
         const rates = Object.values(depositData[cur]?.monthlyInterestRates ?? {});
         const best  = rates.length ? Math.max(...rates) : 0;
         return { cur, best };
      });
   }, [depositData]);

   return (
      <div className={styles.page}>
         <div className="container">

            {/* ── Page header ── */}
            <div className={styles.pageHead}>
               <div>
                  <h1 className={styles.pageTitle}>Deposits</h1>
                  <p className={styles.pageSub}>Save and earn interest on your money</p>
               </div>
            </div>

            {/* ── Rate highlights ── */}
            <div className={styles.highlights}>
               {highlights.map(({ cur, best }) => (
                  <div key={cur} className={styles.highlightCard}>
                     <span className={styles.hlFlag}>{CURRENCY_FLAGS[cur]}</span>
                     <div>
                        <div className={styles.hlRate} style={{ color: CURRENCY_COLOR[cur] }}>
                           up to {best}%
                        </div>
                        <div className={styles.hlLabel}>per year in {cur}</div>
                     </div>
                  </div>
               ))}
            </div>

            {/* ── Main layout: calculator + deposits list ── */}
            <div className={styles.layout}>

               {/* Calculator */}
               <div className={styles.layoutLeft}>
                  <Calculator
                     depositData={depositData}
                     accounts={accounts}
                     userId={userId}
                     onOpened={refetch}
                  />
               </div>

               {/* Active deposits */}
               <div className={styles.layoutRight}>
                  <div className={styles.listHead}>
                     <h2 className={styles.listTitle}>
                        Active deposits
                        {active.length > 0 && (
                           <span className={styles.listCount}>{active.length}</span>
                        )}
                     </h2>
                  </div>

                  {active.length === 0 ? (
                     <div className={styles.emptyList}>
                        <span>🏦</span>
                        <p>No active deposits yet.<br/>Open your first one to start earning.</p>
                     </div>
                  ) : (
                     <>
                        <div className={styles.depList}>
                           {activePageItems.map(dep => (
                              <DepositCard key={dep.id} dep={dep} userId={userId} />
                           ))}
                        </div>
                        <Pagination
                           page={activePage}
                           totalPages={activeTotalPages}
                           totalItems={activeTotalItems}
                           startIndex={activeStart}
                           endIndex={activeEnd}
                           onPage={setActivePage}
                           onPrev={activePrev}
                           onNext={activeNext}
                           label="deposits"
                        />
                     </>
                  )}

                  {/* Closed / collected deposits */}
                  {closed.length > 0 && (
                     <div className={styles.closedSection}>
                        <button
                           className={styles.closedToggle}
                           onClick={() => setShowClosed(o => !o)}
                        >
                           {showClosed ? '▲' : '▼'} Past deposits ({closed.length})
                        </button>
                        {showClosed && (
                           <>
                              <div className={styles.depList}>
                                 {closedPageItems.map(dep => (
                                    <DepositCard key={dep.id} dep={dep} userId={userId} />
                                 ))}
                              </div>
                              <Pagination
                                 page={closedPage}
                                 totalPages={closedTotalPages}
                                 totalItems={closedTotalItems}
                                 startIndex={closedStart}
                                 endIndex={closedEnd}
                                 onPage={setClosedPage}
                                 onPrev={closedPrev}
                                 onNext={closedNext}
                                 label="deposits"
                              />
                           </>
                        )}
                     </div>
                  )}
               </div>

            </div>
         </div>
      </div>
   );
};
