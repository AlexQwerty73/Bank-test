import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './cardData.module.css';
import { convertToNumberCartFormat, generateCVV, generateCardNumber, generateExpiryDate, loadFromLocalStorage } from '../../utils';
import { useUpdateCardMutation, useDeleteCardMutation, useGetAccountByIdQuery } from '../../store';
import { Card } from '../commons';

/* ── Compact editable data row ── */
const DataRow = ({ label, value, masked, isEditable, editValue, isEdit, isVisible, onEdit, onToggleVisible, onEditChange, maxLen }) => (
   <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <div className={styles.rowValue}>
         {isEditable && isEdit ? (
            <input
               className={styles.rowInput}
               type="text"
               value={editValue}
               onChange={e => onEditChange(e.target.value)}
               maxLength={maxLen}
               autoFocus
            />
         ) : (
            <span className={styles.rowText}>
               {masked && !isVisible ? value.replace(/./g, '•') : value}
            </span>
         )}
         <div className={styles.rowActions}>
            {masked && (
               <button className={styles.iconBtn} onClick={onToggleVisible} title={isVisible ? 'Hide' : 'Show'}>
                  {isVisible
                     ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 10A9.9 9.9 0 0 1 10 17 9.9 9.9 0 0 1 2.06 10 9.9 9.9 0 0 1 10 3a9.9 9.9 0 0 1 7.94 7z"/><circle cx="10" cy="10" r="3"/></svg>
                     : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 2l16 16M6.7 6.7A7 7 0 0 0 3.1 10 9.9 9.9 0 0 0 10 17c1.6 0 3-.4 4.3-1.1M8.1 4.2A9 9 0 0 1 10 4a9.9 9.9 0 0 1 7.9 6 9.8 9.8 0 0 1-2.4 3.5"/></svg>
                  }
               </button>
            )}
            {isEditable && (
               <button className={`${styles.iconBtn} ${isEdit ? styles.iconBtnSave : ''}`} onClick={onEdit} title={isEdit ? 'Save' : 'Edit'}>
                  {isEdit
                     ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 10 8 14 16 6"/></svg>
                     : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.7 3.3a1 1 0 0 1 2 2L7 15l-4 1 1-4 10.7-8.7z"/></svg>
                  }
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

   const [updateCard, { isLoading: updating  }] = useUpdateCardMutation();
   const [deleteCard, { isLoading: deleting  }] = useDeleteCardMutation();

   const [isEdit,    setIsEdit]    = useState({ cvv: false, pin: false });
   const [isVisible, setIsVisible] = useState({ cvv: false, pin: false });
   const [editData,  setEditData]  = useState({ cvv, pin });

   /* ── Edit / save ── */
   const handleEdit = (field) => {
      if (isEdit[field]) {
         if (field === 'cvv' && !/^\d{3}$/.test(String(editData.cvv))) {
            alert('CVV must be exactly 3 digits'); setEditData({ ...editData, cvv }); return;
         }
         if (field === 'pin' && !/^\d{4}$/.test(String(editData.pin))) {
            alert('PIN must be exactly 4 digits'); setEditData({ ...editData, pin }); return;
         }
         if (card[field] !== editData[field]) {
            updateCard({ ...card, [field]: editData[field] });
         }
      }
      setIsEdit(prev => ({ ...prev, [field]: !prev[field] }));
   };

   /* ── Show / hide (auto-hide after 5 s) ── */
   const handleToggleVisible = (field) => {
      setIsVisible(prev => {
         if (!prev[field]) setTimeout(() => setIsVisible(c => ({ ...c, [field]: false })), 5000);
         return { ...prev, [field]: !prev[field] };
      });
   };

   /* ── Re-issue ── */
   const handleReissue = () => {
      if (!window.confirm('Re-issue this card? A new number, CVV and expiry date will be generated.')) return;
      updateCard({
         ...card,
         number:     generateCardNumber(),
         cvv:        generateCVV(),
         expiryDate: generateExpiryDate(),
      }).then(() => navigate(`/${localUserId}/cards`));
   };

   /* ── Delete ── */
   const handleDelete = () => {
      if (!window.confirm('Delete this card? This action cannot be undone.')) return;
      deleteCard(card.id).then(() => navigate(`/${localUserId}/cards`));
   };

   /* Format expiry nicely */
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

         <div className={styles.card}>
            {/* ── Left: details ── */}
            <div className={styles.details}>
               <div className={styles.detailsHeader}>
                  <h1 className={styles.title}>Card details</h1>
                  <span className={styles.typeBadge}>{type} · {category}</span>
               </div>

               <div className={styles.rows}>
                  <DataRow label="Number"      value={convertToNumberCartFormat(number)} />
                  <DataRow label="Expiry"       value={expiryFormatted} />
                  <DataRow
                     label="Account balance"
                     value={account
                        ? `${Number(account.balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${account.currency}`
                        : '—'
                     }
                  />
                  <DataRow
                     label="CVV"
                     value={cvv}
                     masked
                     isEditable
                     editValue={editData.cvv}
                     isEdit={isEdit.cvv}
                     isVisible={isVisible.cvv}
                     maxLen={3}
                     onEdit={() => handleEdit('cvv')}
                     onToggleVisible={() => handleToggleVisible('cvv')}
                     onEditChange={val => setEditData(p => ({ ...p, cvv: val }))}
                  />
                  <DataRow
                     label="PIN"
                     value={pin}
                     masked
                     isEditable
                     editValue={editData.pin}
                     isEdit={isEdit.pin}
                     isVisible={isVisible.pin}
                     maxLen={4}
                     onEdit={() => handleEdit('pin')}
                     onToggleVisible={() => handleToggleVisible('pin')}
                     onEditChange={val => setEditData(p => ({ ...p, pin: val }))}
                  />
               </div>

               {/* ── Actions ── */}
               <div className={styles.actions}>
                  <button
                     className={styles.reissueBtn}
                     onClick={handleReissue}
                     disabled={updating}
                  >
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4v5h5M16 16v-5h-5"/><path d="M4 9A8 8 0 0 1 15.7 6M16 11a8 8 0 0 1-11.7 3"/>
                     </svg>
                     {updating ? 'Re-issuing…' : 'Re-issue card'}
                  </button>
                  <button
                     className={styles.deleteBtn}
                     onClick={handleDelete}
                     disabled={deleting}
                  >
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 17 6"/><path d="M8 6V4h4v2M6 6l1 11h6l1-11"/>
                     </svg>
                     {deleting ? 'Deleting…' : 'Delete card'}
                  </button>
               </div>
            </div>

            {/* ── Right: card visual ── */}
            <div className={styles.visual}>
               <Card card={card} />
               <p className={styles.hoverHint}>Hover to see CVV</p>
            </div>
         </div>
      </div>
   );
};
