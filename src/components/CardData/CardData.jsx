import React, { useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './cardData.module.css';
import {
   convertToNumberCartFormat,
   generateCVV,
   generateCardNumber,
   generateExpiryDate,
   loadFromLocalStorage,
} from '../../utils';
import { useUpdateCardMutation, useDeleteCardMutation, useGetAccountByIdQuery, usePatchCardMutation } from '../../store';
import { useToast } from '../../context';
import { Card } from '../commons';

const fmt = (n) =>
   Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const isExpired = (date) => date && new Date(date) < new Date();

const maskNumber = (raw = '') => {
   const d = raw.replace(/\D/g, '');
   return `•••• •••• •••• ${d.slice(-4)}`;
};

const getMaskSetting = () => {
   try { return JSON.parse(localStorage.getItem('app_hideCardNums') ?? 'null') ?? true; }
   catch { return true; }
};

/* ── Masked field row ── */
const SecretRow = ({ label, value, isEditable, editValue, isEdit, isVisible, error,
                     onEdit, onCancel, onToggleVisible, onEditChange, maxLen, pattern, hint }) => (
   <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowRight}>
         {isEditable && isEdit ? (
            <div className={styles.editGroup}>
               <input
                  className={`${styles.rowInput} ${error ? styles.rowInputError : ''}`}
                  type="text"
                  value={editValue}
                  onChange={e => onEditChange(e.target.value)}
                  maxLength={maxLen}
                  pattern={pattern}
                  autoFocus
                  placeholder={hint}
               />
               <button className={styles.iconBtn} onClick={onEdit} title="Save">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 10 8 14 16 6"/></svg>
               </button>
               <button className={`${styles.iconBtn} ${styles.iconBtnCancel}`} onClick={onCancel} title="Cancel">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M15 5L5 15M5 5l10 10"/></svg>
               </button>
               {error && <span className={styles.fieldError}>{error}</span>}
            </div>
         ) : (
            <span className={styles.rowText}>
               {isVisible ? value : '•'.repeat(String(value).length)}
            </span>
         )}
         <div className={styles.rowActions}>
            <button className={styles.iconBtn} onClick={onToggleVisible} title={isVisible ? 'Hide' : 'Show'}>
               {isVisible
                  ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 10A9.9 9.9 0 0 1 10 17 9.9 9.9 0 0 1 2.06 10 9.9 9.9 0 0 1 10 3a9.9 9.9 0 0 1 7.94 7z"/><circle cx="10" cy="10" r="3"/></svg>
                  : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 2l16 16M6.7 6.7A7 7 0 0 0 3.1 10 9.9 9.9 0 0 0 10 17c1.6 0 3-.4 4.3-1.1M8.1 4.2A9 9 0 0 1 10 4a9.9 9.9 0 0 1 7.9 6 9.8 9.8 0 0 1-2.4 3.5"/></svg>
               }
            </button>
            {isEditable && !isEdit && (
               <button className={styles.iconBtn} onClick={onEdit} title="Edit">
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 3.3a1 1 0 0 1 2 2L7 15l-4 1 1-4 10.7-8.7z"/></svg>
               </button>
            )}
         </div>
      </div>
   </div>
);

/* ── PIN change modal ──────────────────────────────────── */
const PinModal = ({ currentPin, onSave, onClose }) => {
   const [step,       setStep]       = useState('verify'); // 'verify' | 'new'
   const [curInput,   setCurInput]   = useState('');
   const [newPin,     setNewPin]     = useState('');
   const [confirmPin, setConfirmPin] = useState('');
   const [err,        setErr]        = useState('');
   const [showCur,    setShowCur]    = useState(false);
   const [showNew,    setShowNew]    = useState(false);

   const handleVerify = () => {
      if (curInput !== String(currentPin)) { setErr('Incorrect current PIN'); return; }
      setErr(''); setStep('new');
   };

   const handleSave = () => {
      if (!/^\d{4}$/.test(newPin))   { setErr('New PIN must be exactly 4 digits'); return; }
      if (newPin !== confirmPin)      { setErr('PINs do not match'); return; }
      if (newPin === String(currentPin)) { setErr('New PIN must differ from current PIN'); return; }
      onSave(newPin);
   };

   return (
      <div className={styles.modalOverlay} onClick={onClose}>
         <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
               <h3 className={styles.modalTitle}>
                  {step === 'verify' ? '🔐 Verify identity' : '🔑 Set new PIN'}
               </h3>
               <button className={styles.modalClose} onClick={onClose}>✕</button>
            </div>

            {step === 'verify' ? (
               <>
                  <p className={styles.modalSub}>Enter your current 4-digit PIN to continue.</p>
                  <div className={styles.modalField}>
                     <label className={styles.modalLabel}>Current PIN</label>
                     <div className={styles.modalInputWrap}>
                        <input
                           className={styles.modalInput}
                           type={showCur ? 'text' : 'password'}
                           maxLength={4}
                           value={curInput}
                           onChange={e => { setCurInput(e.target.value.replace(/\D/g, '')); setErr(''); }}
                           placeholder="••••"
                           autoFocus
                        />
                        <button className={styles.modalEye} onClick={() => setShowCur(v => !v)}>
                           {showCur ? '🙈' : '👁'}
                        </button>
                     </div>
                  </div>
                  {err && <p className={styles.modalErr}>{err}</p>}
                  <div className={styles.modalActions}>
                     <button className={styles.modalPrimary} onClick={handleVerify} disabled={curInput.length !== 4}>
                        Continue
                     </button>
                     <button className={styles.modalGhost} onClick={onClose}>Cancel</button>
                  </div>
               </>
            ) : (
               <>
                  <p className={styles.modalSub}>Choose a new 4-digit PIN.</p>
                  <div className={styles.modalField}>
                     <label className={styles.modalLabel}>New PIN</label>
                     <div className={styles.modalInputWrap}>
                        <input
                           className={styles.modalInput}
                           type={showNew ? 'text' : 'password'}
                           maxLength={4}
                           value={newPin}
                           onChange={e => { setNewPin(e.target.value.replace(/\D/g, '')); setErr(''); }}
                           placeholder="••••"
                           autoFocus
                        />
                        <button className={styles.modalEye} onClick={() => setShowNew(v => !v)}>
                           {showNew ? '🙈' : '👁'}
                        </button>
                     </div>
                  </div>
                  <div className={styles.modalField}>
                     <label className={styles.modalLabel}>Confirm PIN</label>
                     <div className={styles.modalInputWrap}>
                        <input
                           className={styles.modalInput}
                           type="password"
                           maxLength={4}
                           value={confirmPin}
                           onChange={e => { setConfirmPin(e.target.value.replace(/\D/g, '')); setErr(''); }}
                           placeholder="••••"
                        />
                     </div>
                  </div>
                  {err && <p className={styles.modalErr}>{err}</p>}
                  <div className={styles.modalActions}>
                     <button
                        className={styles.modalPrimary}
                        onClick={handleSave}
                        disabled={newPin.length !== 4 || confirmPin.length !== 4}
                     >
                        Save new PIN
                     </button>
                     <button className={styles.modalGhost} onClick={() => { setStep('verify'); setNewPin(''); setConfirmPin(''); setErr(''); }}>
                        Back
                     </button>
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

/* ── Spending limit editor ─────────────────────────────── */
const LimitEditor = ({ current, currency, onSave, onClose }) => {
   const [val, setVal] = useState(current > 0 ? String(current) : '');
   const [err, setErr] = useState('');

   const handleSave = () => {
      const n = parseFloat(val);
      if (val !== '' && (isNaN(n) || n <= 0)) { setErr('Enter a positive amount or leave empty to remove the limit'); return; }
      onSave(val === '' ? null : n);
   };

   return (
      <div className={styles.modalOverlay} onClick={onClose}>
         <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
               <h3 className={styles.modalTitle}>💳 Monthly spending limit</h3>
               <button className={styles.modalClose} onClick={onClose}>✕</button>
            </div>
            <p className={styles.modalSub}>
               Set a maximum amount you can spend from this card per calendar month.
               Leave empty to remove the limit.
            </p>
            <div className={styles.modalField}>
               <label className={styles.modalLabel}>Limit amount {currency ? `(${currency})` : ''}</label>
               <input
                  className={styles.modalInput}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="e.g. 5000"
                  value={val}
                  onChange={e => { setVal(e.target.value); setErr(''); }}
                  autoFocus
               />
            </div>
            {err && <p className={styles.modalErr}>{err}</p>}
            <div className={styles.modalActions}>
               <button className={styles.modalPrimary} onClick={handleSave}>
                  {val === '' ? 'Remove limit' : 'Set limit'}
               </button>
               <button className={styles.modalGhost} onClick={onClose}>Cancel</button>
            </div>
         </div>
      </div>
   );
};

export const CardData = ({ card }) => {
   const { userId } = useParams();
   const navigate   = useNavigate();
   const localUserId = loadFromLocalStorage('userId');
   const toast      = useToast();

   const { number, expiryDate, cvv, type, pin, category, accountId, frozen, spendingLimit } = card;

   const { data: account } = useGetAccountByIdQuery(accountId, { skip: !accountId });
   const [updateCard, { isLoading: updating }] = useUpdateCardMutation();
   const [patchCard]                           = usePatchCardMutation();
   const [deleteCard, { isLoading: deleting }] = useDeleteCardMutation();

   /* ── UI state ── */
   const [isEdit,    setIsEdit]    = useState({ cvv: false, pin: false });
   const [isVisible, setIsVisible] = useState({ cvv: false, pin: false });
   const [editData,  setEditData]  = useState({ cvv, pin });
   const [fieldError, setFieldError] = useState({ cvv: '', pin: '' });
   const [copied,    setCopied]    = useState(false);
   const [confirmAction, setConfirmAction] = useState(null); // 'delete' | 'reissue'
   const [showPinModal,   setShowPinModal]   = useState(false);
   const [showLimitModal, setShowLimitModal] = useState(false);
   const [freezing,       setFreezing]       = useState(false);

   /* ── Card number masking ── */
   const maskingEnabled    = getMaskSetting();
   const [isNumberVisible, setIsNumberVisible] = useState(!maskingEnabled);

   const expired = isExpired(expiryDate);

   /* ── Copy card number ── */
   const handleCopy = useCallback(() => {
      navigator.clipboard.writeText(number).then(() => {
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      });
   }, [number]);

   /* ── Show/hide (auto-hide after 6 s) ── */
   const handleToggleVisible = useCallback((field) => {
      setIsVisible(prev => {
         const next = !prev[field];
         if (next) setTimeout(() => setIsVisible(c => ({ ...c, [field]: false })), 6000);
         return { ...prev, [field]: next };
      });
   }, []);

   /* ── Edit / save ── */
   const handleEdit = useCallback((field) => {
      if (!isEdit[field]) {
         setIsEdit(prev => ({ ...prev, [field]: true }));
         return;
      }
      // Validate
      const val = String(editData[field]);
      if (field === 'cvv' && !/^\d{3}$/.test(val)) {
         setFieldError(prev => ({ ...prev, cvv: 'Must be exactly 3 digits' }));
         return;
      }
      if (field === 'pin' && !/^\d{4}$/.test(val)) {
         setFieldError(prev => ({ ...prev, pin: 'Must be exactly 4 digits' }));
         return;
      }
      setFieldError(prev => ({ ...prev, [field]: '' }));
      if (card[field] !== editData[field]) {
         updateCard({ ...card, [field]: editData[field] });
      }
      setIsEdit(prev => ({ ...prev, [field]: false }));
   }, [isEdit, editData, card, updateCard]);

   const handleCancelEdit = useCallback((field) => {
      setIsEdit(prev => ({ ...prev, [field]: false }));
      setEditData(prev => ({ ...prev, [field]: card[field] }));
      setFieldError(prev => ({ ...prev, [field]: '' }));
   }, [card]);

   /* ── Two-step confirm for destructive actions ── */
   const handleConfirmable = useCallback((action) => {
      if (confirmAction === action) {
         setConfirmAction(null);
         if (action === 'delete') {
            deleteCard(card.id)
               .then(() => { toast.success('Card deleted'); navigate(`/${localUserId}/cards`); })
               .catch(() => toast.error('Delete failed'));
         }
         if (action === 'reissue') {
            updateCard({
               ...card,
               number:     generateCardNumber(),
               cvv:        generateCVV(),
               expiryDate: generateExpiryDate(),
            })
               .then(() => { toast.success('Card re-issued'); navigate(`/${localUserId}/cards`); })
               .catch(() => toast.error('Re-issue failed'));
         }
      } else {
         setConfirmAction(action);
         setTimeout(() => setConfirmAction(null), 5000);
      }
   }, [confirmAction, card, deleteCard, updateCard, navigate, localUserId, toast]);

   /* ── Freeze / unfreeze ── */
   const handleFreeze = async () => {
      setFreezing(true);
      try {
         await patchCard({ id: card.id, frozen: !frozen }).unwrap();
         toast.success(frozen ? '✅ Card unfrozen' : '❄️ Card frozen');
      } catch {
         toast.error('Failed to update card status');
      } finally {
         setFreezing(false);
      }
   };

   /* ── PIN change ── */
   const handlePinSave = async (newPin) => {
      try {
         await patchCard({ id: card.id, pin: newPin }).unwrap();
         toast.success('🔑 PIN changed successfully');
         setShowPinModal(false);
      } catch {
         toast.error('Failed to change PIN');
      }
   };

   /* ── Spending limit ── */
   const handleLimitSave = async (limit) => {
      try {
         await patchCard({ id: card.id, spendingLimit: limit }).unwrap();
         toast.success(limit === null ? '✅ Spending limit removed' : `💳 Limit set to ${limit} ${account?.currency ?? ''}`);
         setShowLimitModal(false);
      } catch {
         toast.error('Failed to update spending limit');
      }
   };

   /* Format expiry */
   const expiryFormatted = expiryDate
      ? expiryDate.split('-').slice(0, 2).reverse().join('/')
      : '—';

   return (
      <>
      <div className={styles.page}>

         {/* Back link */}
         <Link to={`/${userId}/cards`} className={styles.backLink}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
               <path d="M13 17l-7-7 7-7"/>
            </svg>
            Back to cards
         </Link>

         <div className={styles.layout}>

            {/* ── Left: card visual + hint ── */}
            <div className={styles.visual}>
               <Card card={card} currency={account?.currency} balance={account?.balance} />
               <p className={styles.hoverHint}>
                  <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 3a7 7 0 1 0 0 14A7 7 0 0 0 10 3z"/><path d="M10 8v5M10 6.5h.01"/></svg>
                  Hover to flip
               </p>

               {/* Status */}
               <div className={`${styles.statusBadge} ${
                  expired ? styles.statusExpired
                  : frozen ? styles.statusFrozen
                  : styles.statusActive
               }`}>
                  <span className={styles.statusDot} />
                  {expired ? 'Expired' : frozen ? 'Frozen' : 'Active'}
               </div>

               {/* Freeze button */}
               {!expired && (
                  <button
                     className={`${styles.freezeBtn} ${frozen ? styles.freezeBtnActive : ''}`}
                     onClick={handleFreeze}
                     disabled={freezing}
                     title={frozen ? 'Unfreeze card' : 'Freeze card'}
                  >
                     {freezing ? (
                        <><span className={styles.spinner}/> {frozen ? 'Unfreezing…' : 'Freezing…'}</>
                     ) : frozen ? (
                        <>🌡️ Unfreeze card</>
                     ) : (
                        <>❄️ Freeze card</>
                     )}
                  </button>
               )}
            </div>

            {/* ── Right: details ── */}
            <div className={styles.details}>

               <div className={styles.detailsHeader}>
                  <div>
                     <h1 className={styles.title}>Card details</h1>
                     <span className={styles.typeBadge}>{type} · {category}</span>
                  </div>
               </div>

               {/* ── Info rows ── */}
               <div className={styles.rows}>

                  {/* Number + reveal + copy */}
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>Number</span>
                     <div className={styles.rowRight}>
                        <span className={styles.rowText} style={{ fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                           {isNumberVisible ? convertToNumberCartFormat(number) : maskNumber(number)}
                        </span>
                        <div className={styles.rowActions}>
                           <button
                              className={styles.iconBtn}
                              onClick={() => setIsNumberVisible(v => !v)}
                              title={isNumberVisible ? 'Hide number' : 'Reveal number'}
                           >
                              {isNumberVisible
                                 ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 10A9.9 9.9 0 0 1 10 17 9.9 9.9 0 0 1 2.06 10 9.9 9.9 0 0 1 10 3a9.9 9.9 0 0 1 7.94 7z"/><circle cx="10" cy="10" r="3"/></svg>
                                 : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 2l16 16M6.7 6.7A7 7 0 0 0 3.1 10 9.9 9.9 0 0 0 10 17c1.6 0 3-.4 4.3-1.1M8.1 4.2A9 9 0 0 1 10 4a9.9 9.9 0 0 1 7.9 6 9.8 9.8 0 0 1-2.4 3.5"/></svg>
                              }
                           </button>
                        </div>
                        <button className={styles.copyBtn} onClick={handleCopy} title="Copy card number">
                           {copied
                              ? <><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="2 8 6 12 14 4"/></svg> Copied</>
                              : <><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="1" width="9" height="11" rx="2"/><rect x="1" y="4" width="9" height="11" rx="2"/></svg> Copy</>
                           }
                        </button>
                     </div>
                  </div>

                  {/* Expiry */}
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>Expiry</span>
                     <div className={styles.rowRight}>
                        <span className={`${styles.rowText} ${expired ? styles.rowTextExpired : ''}`}>
                           {expiryFormatted}
                           {expired && <span className={styles.expiredTag}>Expired</span>}
                        </span>
                     </div>
                  </div>

                  {/* Account balance */}
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>Balance</span>
                     <div className={styles.rowRight}>
                        <span className={styles.rowText}>
                           {account
                              ? <strong>{fmt(account.balance)} {account.currency}</strong>
                              : '—'
                           }
                        </span>
                     </div>
                  </div>

                  {/* Spending limit */}
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>Monthly limit</span>
                     <div className={styles.rowRight}>
                        <span className={styles.rowText}>
                           {spendingLimit > 0
                              ? <strong>{fmt(spendingLimit)} {account?.currency ?? ''}</strong>
                              : <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No limit</span>
                           }
                        </span>
                        <button
                           className={styles.iconBtn}
                           onClick={() => setShowLimitModal(true)}
                           title="Set spending limit"
                        >
                           <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 3.3a1 1 0 0 1 2 2L7 15l-4 1 1-4 10.7-8.7z"/></svg>
                        </button>
                     </div>
                  </div>

                  {/* CVV */}
                  <SecretRow
                     label="CVV"
                     value={cvv}
                     isEditable
                     editValue={editData.cvv}
                     isEdit={isEdit.cvv}
                     isVisible={isVisible.cvv}
                     error={fieldError.cvv}
                     maxLen={3}
                     hint="123"
                     onEdit={() => handleEdit('cvv')}
                     onCancel={() => handleCancelEdit('cvv')}
                     onToggleVisible={() => handleToggleVisible('cvv')}
                     onEditChange={val => setEditData(p => ({ ...p, cvv: val }))}
                  />

                  {/* PIN — reveal only + modal change */}
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>PIN</span>
                     <div className={styles.rowRight}>
                        <span className={styles.rowText}>
                           {isVisible.pin ? pin : '••••'}
                        </span>
                        <div className={styles.rowActions}>
                           <button className={styles.iconBtn} onClick={() => handleToggleVisible('pin')} title={isVisible.pin ? 'Hide' : 'Show'}>
                              {isVisible.pin
                                 ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 10A9.9 9.9 0 0 1 10 17 9.9 9.9 0 0 1 2.06 10 9.9 9.9 0 0 1 10 3a9.9 9.9 0 0 1 7.94 7z"/><circle cx="10" cy="10" r="3"/></svg>
                                 : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 2l16 16M6.7 6.7A7 7 0 0 0 3.1 10 9.9 9.9 0 0 0 10 17c1.6 0 3-.4 4.3-1.1M8.1 4.2A9 9 0 0 1 10 4a9.9 9.9 0 0 1 7.9 6 9.8 9.8 0 0 1-2.4 3.5"/></svg>
                              }
                           </button>
                           <button className={styles.iconBtn} onClick={() => setShowPinModal(true)} title="Change PIN">
                              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 3.3a1 1 0 0 1 2 2L7 15l-4 1 1-4 10.7-8.7z"/></svg>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

               {/* ── Linked account quick links ── */}
               {account && (
                  <div className={styles.accountLinks}>
                     <span className={styles.accountLinksLabel}>Linked account</span>
                     <div className={styles.accountLinksRow}>
                        <Link to={`/${userId}/transactions/${accountId}`} className={styles.accountLink}>
                           <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                              <rect x="2" y="5" width="16" height="11" rx="2"/><path d="M2 9h16"/>
                           </svg>
                           View account
                        </Link>
                        <Link to={`/${userId}/transactions/${accountId}`} className={`${styles.accountLink} ${styles.accountLinkGhost}`}>
                           <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 7h14M3 7l3-3M3 7l3 3M17 13H3M17 13l-3-3M17 13l-3 3"/>
                           </svg>
                           Transactions
                        </Link>
                     </div>
                  </div>
               )}

               {/* ── Actions ── */}
               <div className={styles.actions}>
                  <button
                     className={`${styles.reissueBtn} ${confirmAction === 'reissue' ? styles.confirmState : ''}`}
                     onClick={() => handleConfirmable('reissue')}
                     disabled={updating || deleting}
                  >
                     {updating ? (
                        <><span className={styles.spinner}/> Re-issuing…</>
                     ) : confirmAction === 'reissue' ? (
                        <><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 10 8 14 16 6"/></svg> Confirm re-issue</>
                     ) : (
                        <><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h5M16 16v-5h-5"/><path d="M4 9A8 8 0 0 1 15.7 6M16 11a8 8 0 0 1-11.7 3"/></svg> Re-issue card</>
                     )}
                  </button>

                  <button
                     className={`${styles.deleteBtn} ${confirmAction === 'delete' ? styles.confirmState : ''}`}
                     onClick={() => handleConfirmable('delete')}
                     disabled={updating || deleting}
                  >
                     {deleting ? (
                        <><span className={styles.spinner}/> Deleting…</>
                     ) : confirmAction === 'delete' ? (
                        <><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="4 10 8 14 16 6"/></svg> Confirm delete</>
                     ) : (
                        <><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 17 6"/><path d="M8 6V4h4v2M6 6l1 11h6l1-11"/></svg> Delete card</>
                     )}
                  </button>
               </div>

               {confirmAction && (
                  <p className={styles.confirmHint}>
                     Click again to confirm · auto-cancels in 5 s
                  </p>
               )}
            </div>

         </div>
      </div>

      {/* ── PIN change modal ── */}
      {showPinModal && (
         <PinModal
            currentPin={pin}
            onSave={handlePinSave}
            onClose={() => setShowPinModal(false)}
         />
      )}

      {/* ── Spending limit modal ── */}
      {showLimitModal && (
         <LimitEditor
            current={Number(spendingLimit ?? 0)}
            currency={account?.currency}
            onSave={handleLimitSave}
            onClose={() => setShowLimitModal(false)}
         />
      )}
   </>
   );
};
