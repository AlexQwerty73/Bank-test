import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
   useGetAccountsByUserIdQuery,
   useLazyGetAccountByNumberQuery,
   useUpdateAccountMutation,
   useAddTransactionMutation,
   useGetExchangeRateApiQuery,
} from '../../../store';
import styles from './remittanceForm.module.css';

/* ── helpers ─────────────────────────────────────────────── */
function getRate(exchangeRate, from, to) {
   if (!from || !to || from === to) return 1;
   const key = `${from.toLowerCase()}To${to.charAt(0).toUpperCase()}${to.slice(1).toLowerCase()}`;
   return exchangeRate?.[key]?.buy ?? null;
}

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

const fmt = (n, decimals = 2) =>
   Number(n).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
   });

/* ── Exchange success animation ──────────────────────────── */
const ExchangeAnimation = ({ fromAmount, fromCur, toAmount, toCur }) => (
   <div className={styles.animWrap}>
      <div className={styles.animRow}>
         <div className={styles.animSide}>
            <span className={styles.animFlag}>{CURRENCY_FLAGS[fromCur]}</span>
            <span className={styles.animAmount + ' ' + styles.animAmtOut}>
               −{fmt(fromAmount)} <span className={styles.animCur}>{fromCur}</span>
            </span>
         </div>

         <div className={styles.animArrowWrap}>
            <svg className={styles.animArrow} viewBox="0 0 100 24" fill="none">
               <path
                  className={styles.animArrowPath}
                  d="M0 12 H88 M76 4 L92 12 76 20"
                  stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
               />
               {[0,1,2].map(i => (
                  <circle
                     key={i}
                     className={styles.animDot}
                     cx={20 + i * 25} cy="12" r="3"
                     fill="#4F46E5"
                     style={{ animationDelay: `${0.4 + i * 0.15}s` }}
                  />
               ))}
            </svg>
         </div>

         <div className={styles.animSide + ' ' + styles.animSideRight}>
            <span className={styles.animFlag}>{CURRENCY_FLAGS[toCur]}</span>
            <span className={styles.animAmount + ' ' + styles.animAmtIn}>
               +{fmt(toAmount)} <span className={styles.animCur}>{toCur}</span>
            </span>
         </div>
      </div>

      <div className={styles.animCheck}>
         <svg viewBox="0 0 52 52" fill="none">
            <circle
               className={styles.animCircle}
               cx="26" cy="26" r="23"
               stroke="#059669" strokeWidth="2.5"
            />
            <path
               className={styles.animTick}
               d="M14 26l8 8 16-16"
               stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            />
         </svg>
      </div>
      <p className={styles.animLabel}>Exchange complete!</p>
   </div>
);

/* ════════════════════════════════════════════════════════════
   TAB 1 — SEND
   ════════════════════════════════════════════════════════════ */
const SendTab = ({ myAccounts, exchangeRate, userId, navigate }) => {
   const [fromId,   setFromId]   = useState('');
   const [toNumber, setToNumber] = useState('');
   const [amount,   setAmount]   = useState('');
   const [external, setExternal] = useState(false);
   const [preview,  setPreview]  = useState(null);
   const [recipAcc, setRecipAcc] = useState(null);
   const [error,    setError]    = useState('');
   const [loading,  setLoading]  = useState(false);
   const [success,  setSuccess]  = useState(false);

   const [getAccountByNumber] = useLazyGetAccountByNumberQuery();
   const [updateAccount]      = useUpdateAccountMutation();
   const [addTransaction]     = useAddTransactionMutation();

   useEffect(() => {
      if (myAccounts.length > 0 && !fromId) setFromId(myAccounts[0].id);
   }, [myAccounts, fromId]);

   const sender = myAccounts.find(a => a.id === fromId) ?? null;

   // Effective balance = real balance + credit limit (if account has one)
   const effectiveBalance = sender
      ? Number(sender.balance) + Number(sender.creditLimit ?? 0)
      : 0;

   const handleCalculate = async (e) => {
      e.preventDefault();
      setError(''); setPreview(null); setRecipAcc(null);

      if (!sender) { setError('Select a sender account.'); return; }
      const amt = parseFloat(amount);
      if (!amt || amt <= 0) { setError('Enter a valid amount.'); return; }
      if (amt > effectiveBalance) { setError('Insufficient funds (including credit limit).'); return; }

      const clean = toNumber.replace(/\s/g, '');
      if (!clean) { setError('Enter recipient account number.'); return; }

      if (external) {
         setPreview({ amountFrom: amt, amountTo: amt, commission: 0, externalNumber: clean });
         return;
      }

      setLoading(true);
      try {
         const { data: found = [] } = await getAccountByNumber(clean);
         const recip = found[0];
         if (!recip)            { setError('Account not found.'); return; }
         if (recip.id === sender.id) { setError('Cannot transfer to the same account.'); return; }

         const rate = getRate(exchangeRate, sender.currency, recip.currency);
         if (rate === null) { setError(`No rate for ${sender.currency}→${recip.currency}.`); return; }

         const gross      = amt * rate;
         const commission = parseFloat((gross * 0.01).toFixed(2));
         const amountTo   = parseFloat((gross - commission).toFixed(2));

         setRecipAcc(recip);
         setPreview({ amountFrom: amt, amountTo, rate, commission });
      } finally { setLoading(false); }
   };

   const handleConfirm = async () => {
      if (!sender || !preview) return;
      setLoading(true); setError('');
      try {
         const now = new Date().toISOString();
         await updateAccount({
            ...sender,
            balance: parseFloat((Number(sender.balance) - preview.amountFrom).toFixed(2)),
         }).unwrap();

         if (external) {
            await addTransaction({
               accountId: sender.id, userId,
               direction: 'out', amount: preview.amountFrom, currency: sender.currency,
               counterAccountId: null, counterAccountNumber: preview.externalNumber,
               counterName: `External: …${preview.externalNumber.slice(-6)}`,
               description: 'Transfer to external bank', type: 'external-transfer', date: now,
            }).unwrap();
         } else {
            await updateAccount({
               ...recipAcc,
               balance: parseFloat((Number(recipAcc.balance) + preview.amountTo).toFixed(2)),
            }).unwrap();
            await addTransaction({
               accountId: sender.id, userId,
               direction: 'out', amount: preview.amountFrom, currency: sender.currency,
               counterAccountId: recipAcc.id, counterAccountNumber: recipAcc.accountNumber,
               counterName: `…${recipAcc.accountNumber.slice(-7)}`,
               description: `Transfer to ${recipAcc.currency} account`, type: 'transfer', date: now,
            }).unwrap();
            await addTransaction({
               accountId: recipAcc.id, userId: recipAcc.userId ?? null,
               direction: 'in', amount: preview.amountTo, currency: recipAcc.currency,
               counterAccountId: sender.id, counterAccountNumber: sender.accountNumber,
               counterName: `…${sender.accountNumber.slice(-7)}`,
               description: `Transfer from ${sender.currency} account`, type: 'transfer', date: now,
            }).unwrap();
         }
         setSuccess(true);
         setTimeout(() => navigate(`/${userId}/transactions`), 1800);
      } catch { setError('Transfer failed. Try again.'); }
      finally   { setLoading(false); }
   };

   if (success) return (
      <div className={styles.successCard}>
         <div className={styles.successIcon}>✓</div>
         <h3>Sent!</h3><p>Redirecting…</p>
      </div>
   );

   const isCross = sender && recipAcc && sender.currency !== recipAcc.currency;

   return (
      <div>
         <div className={styles.field}>
            <label className={styles.label}>From account</label>
            <div className={styles.selectWrap}>
               <select className={styles.select} value={fromId}
                  onChange={e => { setFromId(e.target.value); setPreview(null); setRecipAcc(null); }}>
                  {myAccounts.map(acc => (
                     <option key={acc.id} value={acc.id}>
                        {CURRENCY_FLAGS[acc.currency]} {acc.currency} — {fmt(acc.balance)} {acc.currency}
                        {Number(acc.creditLimit) > 0 ? ` (credit +${fmt(acc.creditLimit, 0)})` : ''}
                     </option>
                  ))}
               </select>
            </div>
            {sender && (
               <div className={styles.balanceHint}>
                  <span>Balance: <b>{fmt(sender.balance)} {sender.currency}</b></span>
                  {Number(sender.creditLimit) > 0 && (
                     <span className={styles.creditBadge}>
                        Credit: +{fmt(sender.creditLimit, 0)} {sender.currency}
                     </span>
                  )}
               </div>
            )}
         </div>

         <form onSubmit={handleCalculate}>
            <div className={styles.field}>
               <label className={styles.label}>Recipient account number</label>
               <input className={styles.input} type="text" placeholder="UA28 3006 5000 …"
                  value={toNumber}
                  onChange={e => { setToNumber(e.target.value); setPreview(null); setRecipAcc(null); }}
                  autoComplete="off"
               />
            </div>
            <div className={styles.field}>
               <label className={styles.label}>Amount {sender ? `(${sender.currency})` : ''}</label>
               <input className={styles.input} type="number" min="0.01" step="0.01" placeholder="0.00"
                  value={amount}
                  onChange={e => { setAmount(e.target.value); setPreview(null); setRecipAcc(null); }}
               />
            </div>

            <label className={styles.toggle}>
               <input type="checkbox" checked={external}
                  onChange={e => { setExternal(e.target.checked); setPreview(null); setRecipAcc(null); }}/>
               <span className={styles.toggleTrack}><span className={styles.toggleThumb}/></span>
               <span className={styles.toggleLabel}>
                  External bank
                  <span className={styles.toggleNote}> — money leaves the system</span>
               </span>
            </label>

            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.primaryBtn} type="submit" disabled={loading}>
               {loading ? 'Checking…' : 'Calculate'}
            </button>
         </form>

         {preview && (
            <div className={styles.confirmCard}>
               <h3 className={styles.confirmTitle}>Confirm transfer</h3>
               <div className={styles.confirmRow}><span>You send</span>
                  <strong>{fmt(preview.amountFrom)} {sender.currency}</strong></div>
               <div className={styles.confirmRow}><span>To</span>
                  <strong className={styles.mono}>
                     {recipAcc ? recipAcc.accountNumber.replace(/(.{4})/g, '$1 ').trim()
                               : preview.externalNumber + ' (external)'}
                  </strong></div>
               {isCross && <div className={styles.confirmRow}><span>Rate</span>
                  <strong>1 {sender.currency} = {preview.rate} {recipAcc.currency}</strong></div>}
               {!external && preview.commission > 0 && (
                  <div className={styles.confirmRow}><span>Commission (1%)</span>
                     <strong>{preview.commission} {recipAcc?.currency}</strong></div>)}
               {!external && (
                  <div className={`${styles.confirmRow} ${styles.confirmTotal}`}><span>Recipient gets</span>
                     <strong>{fmt(preview.amountTo)} {recipAcc?.currency ?? sender.currency}</strong></div>)}
               {external && (
                  <div className={`${styles.confirmRow} ${styles.confirmTotal}`}><span>⚠ External — no recipient record</span>
                     <strong style={{ color: '#DC2626' }}>Irreversible</strong></div>)}
               <div className={styles.confirmActions}>
                  <button className={styles.primaryBtn} onClick={handleConfirm} disabled={loading}>
                     {loading ? 'Sending…' : 'Confirm'}</button>
                  <button className={styles.ghostBtn}
                     onClick={() => { setPreview(null); setRecipAcc(null); }}>Cancel</button>
               </div>
            </div>
         )}
      </div>
   );
};

/* ════════════════════════════════════════════════════════════
   TAB 2 — EXCHANGE (live preview, no separate calculate step)
   ════════════════════════════════════════════════════════════ */
const ExchangeTab = ({ myAccounts, exchangeRate, userId, navigate }) => {
   const [fromId,  setFromId]  = useState('');
   const [toId,    setToId]    = useState('');
   const [amount,  setAmount]  = useState('');
   const [loading, setLoading] = useState(false);
   const [error,   setError]   = useState('');
   const [animData, setAnimData] = useState(null); // triggers success animation

   const [updateAccount]  = useUpdateAccountMutation();
   const [addTransaction] = useAddTransactionMutation();

   // Auto-select accounts
   useEffect(() => {
      if (myAccounts.length >= 1 && !fromId) setFromId(myAccounts[0].id);
   }, [myAccounts, fromId]);

   const fromAcc    = myAccounts.find(a => a.id === fromId) ?? null;
   const toOptions  = myAccounts.filter(a => a.id !== fromId);

   // Keep toId valid when fromId changes
   useEffect(() => {
      if (toOptions.length > 0 && !toOptions.find(a => a.id === toId)) {
         setToId(toOptions[0]?.id ?? '');
      }
   }, [fromId, myAccounts]); // eslint-disable-line

   const toAcc = toOptions.find(a => a.id === toId) ?? toOptions[0] ?? null;

   // Live calculation
   const liveRate   = useMemo(
      () => fromAcc && toAcc ? getRate(exchangeRate, fromAcc.currency, toAcc.currency) : null,
      [fromAcc, toAcc, exchangeRate],
   );
   const parsedAmt  = parseFloat(amount) || 0;
   const liveResult = liveRate && parsedAmt > 0
      ? parseFloat((parsedAmt * liveRate).toFixed(2))
      : null;

   const effectiveBalance = fromAcc
      ? Number(fromAcc.balance) + Number(fromAcc.creditLimit ?? 0)
      : 0;

   const isInsufficient = parsedAmt > 0 && parsedAmt > effectiveBalance;
   const canConfirm = parsedAmt > 0 && !isInsufficient && liveResult !== null && !loading;

   const handleConfirm = async () => {
      if (!canConfirm || !fromAcc || !toAcc) return;
      setLoading(true); setError('');
      try {
         const now = new Date().toISOString();
         await updateAccount({
            ...fromAcc,
            balance: parseFloat((Number(fromAcc.balance) - parsedAmt).toFixed(2)),
         }).unwrap();
         await updateAccount({
            ...toAcc,
            balance: parseFloat((Number(toAcc.balance) + liveResult).toFixed(2)),
         }).unwrap();
         await addTransaction({
            accountId: fromAcc.id, userId,
            direction: 'out', amount: parsedAmt, currency: fromAcc.currency,
            counterAccountId: toAcc.id, counterAccountNumber: toAcc.accountNumber,
            counterName: `Own ${toAcc.currency} account`,
            description: `Exchange ${fromAcc.currency} → ${toAcc.currency}`,
            type: 'exchange', date: now,
         }).unwrap();
         await addTransaction({
            accountId: toAcc.id, userId,
            direction: 'in', amount: liveResult, currency: toAcc.currency,
            counterAccountId: fromAcc.id, counterAccountNumber: fromAcc.accountNumber,
            counterName: `Own ${fromAcc.currency} account`,
            description: `Exchange from ${fromAcc.currency}`,
            type: 'exchange', date: now,
         }).unwrap();

         setAnimData({ fromAmount: parsedAmt, fromCur: fromAcc.currency, toAmount: liveResult, toCur: toAcc.currency });
         setTimeout(() => navigate(`/${userId}/transactions`), 3200);
      } catch { setError('Exchange failed. Try again.'); }
      finally   { setLoading(false); }
   };

   if (animData) return <ExchangeAnimation {...animData} />;

   if (myAccounts.length < 2) return (
      <div className={styles.emptyTab}>
         <span>🏦</span>
         <p>You need at least two accounts in different currencies to exchange.</p>
      </div>
   );

   return (
      <div>
         <p className={styles.exchangeNote}>Convert between your own accounts at live rates. No commission.</p>

         {/* From */}
         <div className={styles.field}>
            <label className={styles.label}>Sell from</label>
            <div className={styles.selectWrap}>
               <select className={styles.select} value={fromId}
                  onChange={e => { setFromId(e.target.value); setAmount(''); }}>
                  {myAccounts.map(acc => (
                     <option key={acc.id} value={acc.id}>
                        {CURRENCY_FLAGS[acc.currency]} {acc.currency} — {fmt(acc.balance)} {acc.currency}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         {/* To */}
         <div className={styles.field}>
            <label className={styles.label}>Buy into</label>
            <div className={styles.selectWrap}>
               <select className={styles.select} value={toId}
                  onChange={e => { setToId(e.target.value); }}>
                  {toOptions.map(acc => (
                     <option key={acc.id} value={acc.id}>
                        {CURRENCY_FLAGS[acc.currency]} {acc.currency} — {fmt(acc.balance)} {acc.currency}
                     </option>
                  ))}
               </select>
            </div>
         </div>

         {/* Amount + live preview */}
         <div className={styles.field}>
            <label className={styles.label}>
               Amount to sell {fromAcc ? `(${fromAcc.currency})` : ''}
            </label>
            <input
               className={`${styles.input} ${isInsufficient ? styles.inputErr : ''}`}
               type="number" min="0.01" step="0.01" placeholder="0.00"
               value={amount}
               onChange={e => setAmount(e.target.value)}
               autoFocus
            />
            {fromAcc && (
               <div className={styles.balanceHint}>
                  Available: <b>{fmt(effectiveBalance)} {fromAcc.currency}</b>
                  {Number(fromAcc.creditLimit) > 0 && (
                     <span className={styles.creditBadge}>
                        incl. credit +{fmt(fromAcc.creditLimit, 0)}
                     </span>
                  )}
               </div>
            )}
            {isInsufficient && <p className={styles.fieldErr}>Insufficient funds</p>}
         </div>

         {/* Live result panel */}
         {liveRate && parsedAmt > 0 && !isInsufficient && (
            <div className={styles.livePreview}>
               <div className={styles.liveFrom}>
                  <span className={styles.liveFlag}>{CURRENCY_FLAGS[fromAcc?.currency]}</span>
                  <span className={styles.liveSell}>−{fmt(parsedAmt)} {fromAcc?.currency}</span>
               </div>
               <div className={styles.liveArrow}>
                  <svg viewBox="0 0 40 16" fill="none">
                     <path d="M0 8h34M28 2l8 6-8 6" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className={styles.liveRate}>1 {fromAcc?.currency} = {liveRate} {toAcc?.currency}</span>
               </div>
               <div className={styles.liveTo}>
                  <span className={styles.liveFlag}>{CURRENCY_FLAGS[toAcc?.currency]}</span>
                  <span className={styles.liveBuy}>+{fmt(liveResult)} {toAcc?.currency}</span>
               </div>
            </div>
         )}

         {error && <p className={styles.error}>{error}</p>}

         <button
            className={styles.primaryBtn}
            onClick={handleConfirm}
            disabled={!canConfirm}
         >
            {loading
               ? 'Exchanging…'
               : canConfirm
                  ? `Exchange ${fmt(parsedAmt)} ${fromAcc?.currency} → ${fmt(liveResult)} ${toAcc?.currency}`
                  : 'Enter amount to exchange'}
         </button>
      </div>
   );
};

/* ════════════════════════════════════════════════════════════
   MAIN
   ════════════════════════════════════════════════════════════ */
export const RemittanceForm = () => {
   const { userId } = useParams();
   const navigate   = useNavigate();
   const [tab, setTab] = useState('send');

   const { data: myAccounts = [] }   = useGetAccountsByUserIdQuery(userId);
   const { data: exchangeRate = {} } = useGetExchangeRateApiQuery();

   const common = { myAccounts, exchangeRate, userId, navigate };

   return (
      <div className={styles.wrap}>
         <h1 className={styles.heading}>Money</h1>
         <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'send' ? styles.tabActive : ''}`} onClick={() => setTab('send')}>
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h14M3 7l3-3M3 7l3 3M17 13H3M17 13l-3-3M17 13l-3 3"/>
               </svg>
               Send
            </button>
            <button className={`${styles.tab} ${tab === 'exchange' ? styles.tabActive : ''}`} onClick={() => setTab('exchange')}>
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4v5h5M16 16v-5h-5"/><path d="M4 9A8 8 0 0 1 15.7 6M16 11a8 8 0 0 1-11.7 3"/>
               </svg>
               Exchange
            </button>
         </div>

         {tab === 'send'     && <SendTab     key="send"     {...common} />}
         {tab === 'exchange' && <ExchangeTab key="exchange" {...common} />}
      </div>
   );
};
