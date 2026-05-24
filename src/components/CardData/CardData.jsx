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
import { useUpdateCardMutation, useDeleteCardMutation, useGetAccountByIdQuery } from '../../store';
import { Card } from '../commons';

const fmt = (n) =>
   Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const isExpired = (date) => date && new Date(date) < new Date();

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

export const CardData = ({ card }) => {
   const { userId } = useParams();
   const navigate   = useNavigate();
   const localUserId = loadFromLocalStorage('userId');

   const { number, expiryDate, cvv, type, pin, category, accountId } = card;

   const { data: account } = useGetAccountByIdQuery(accountId, { skip: !accountId });
   const [updateCard, { isLoading: updating }] = useUpdateCardMutation();
   const [deleteCard, { isLoading: deleting }] = useDeleteCardMutation();

   /* ── UI state ── */
   const [isEdit,    setIsEdit]    = useState({ cvv: false, pin: false });
   const [isVisible, setIsVisible] = useState({ cvv: false, pin: false });
   const [editData,  setEditData]  = useState({ cvv, pin });
   const [fieldError, setFieldError] = useState({ cvv: '', pin: '' });
   const [copied,    setCopied]    = useState(false);
   const [confirmAction, setConfirmAction] = useState(null); // 'delete' | 'reissue'

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
            deleteCard(card.id).then(() => navigate(`/${localUserId}/cards`));
         }
         if (action === 'reissue') {
            updateCard({
               ...card,
               number:     generateCardNumber(),
               cvv:        generateCVV(),
               expiryDate: generateExpiryDate(),
            }).then(() => navigate(`/${localUserId}/cards`));
         }
      } else {
         setConfirmAction(action);
         setTimeout(() => setConfirmAction(null), 5000);
      }
   }, [confirmAction, card, deleteCard, updateCard, navigate, localUserId]);

   /* Format expiry */
   const expiryFormatted = expiryDate
      ? expiryDate.split('-').slice(0, 2).reverse().join('/')
      : '—';

   return (
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
               <div className={`${styles.statusBadge} ${expired ? styles.statusExpired : styles.statusActive}`}>
                  <span className={styles.statusDot} />
                  {expired ? 'Expired' : 'Active'}
               </div>
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

                  {/* Number + copy */}
                  <div className={styles.row}>
                     <span className={styles.rowLabel}>Number</span>
                     <div className={styles.rowRight}>
                        <span className={styles.rowText} style={{ fontFamily: 'monospace', letterSpacing: '0.06em' }}>
                           {convertToNumberCartFormat(number)}
                        </span>
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

                  {/* PIN */}
                  <SecretRow
                     label="PIN"
                     value={pin}
                     isEditable
                     editValue={editData.pin}
                     isEdit={isEdit.pin}
                     isVisible={isVisible.pin}
                     error={fieldError.pin}
                     maxLen={4}
                     hint="1234"
                     onEdit={() => handleEdit('pin')}
                     onCancel={() => handleCancelEdit('pin')}
                     onToggleVisible={() => handleToggleVisible('pin')}
                     onEditChange={val => setEditData(p => ({ ...p, pin: val }))}
                  />
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
   );
};
