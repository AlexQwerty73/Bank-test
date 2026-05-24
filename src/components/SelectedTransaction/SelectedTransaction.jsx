import React, { useState } from 'react';
import styles from './selectedTransaction.module.css';
import { useUpdateCardMutation } from '../../store';
import { formatDate } from '../../utils';

export const SelectedTransaction = ({ card, selectedTransaction, handleCloseTransaction }) => {
   const [updateCard] = useUpdateCardMutation();
   const [isEditing, setIsEditing] = useState(false);
   const [editedTransaction, setEditedTransaction] = useState({
      description: selectedTransaction.description,
      location: selectedTransaction.location,
   });

   const handleSave = () => {
      const updatedHistory = card[0].history.map((transaction) =>
         transaction.date === selectedTransaction.date
            ? { ...transaction, ...editedTransaction }
            : transaction
      );
      updateCard({ ...card[0], history: updatedHistory }).unwrap();
      setIsEditing(false);
      handleCloseTransaction();
   };

   const handleCancel = () => {
      setIsEditing(false);
      setEditedTransaction({
         description: selectedTransaction.description,
         location: selectedTransaction.location,
      });
   };

   return (
      <div className={styles.selectedTransaction}>
         <h3>Transaction Details</h3>

         {/* Фінансові дані — тільки читання */}
         <div className={styles.readOnlyFields}>
            <div><strong>Date:</strong> {formatDate(selectedTransaction.date)}</div>
            <div><strong>Amount:</strong> {selectedTransaction.action}{selectedTransaction.amount}</div>
            <div><strong>Type:</strong> {selectedTransaction.type}</div>
         </div>

         {/* Редаговані поля — опис і місце */}
         <div className={styles.editableFields}>
            <div>
               <strong>Description:</strong>{' '}
               {isEditing
                  ? <input
                       type="text"
                       value={editedTransaction.description}
                       onChange={(e) => setEditedTransaction(prev => ({ ...prev, description: e.target.value }))}
                    />
                  : selectedTransaction.description || '—'
               }
            </div>
            <div>
               <strong>Location:</strong>{' '}
               {isEditing
                  ? <input
                       type="text"
                       value={editedTransaction.location}
                       onChange={(e) => setEditedTransaction(prev => ({ ...prev, location: e.target.value }))}
                    />
                  : selectedTransaction.location || '—'
               }
            </div>
         </div>

         <div className={styles.actions}>
            {isEditing ? (
               <>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
               </>
            ) : (
               <button onClick={() => setIsEditing(true)}>Edit note</button>
            )}
            <button onClick={handleCloseTransaction}>Close</button>
         </div>
      </div>
   );
};
