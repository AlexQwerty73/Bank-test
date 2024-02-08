import React, { useState } from 'react';
import styles from './selectedTransaction.module.css';
import { useUpdateCardMutation } from '../../redux';

export const SelectedTransaction = ({ card, selectedTransaction, handleCloseTransaction }) => {
   const [updateCard] = useUpdateCardMutation();
   const [isEditing, setIsEditing] = useState(false);
   const [editedTransaction, setEditedTransaction] = useState(selectedTransaction);

   const handleEdit = () => {
      setIsEditing(true);
   };

   const handleSave = () => {
      const updatedHistory = card[0].history.map(transaction => {
         if (transaction.date === selectedTransaction.date) {
            return editedTransaction;
         }
         return transaction;
      });

      const updatedCard = { ...card[0], history: updatedHistory };
      updateCard(updatedCard).unwrap();
      setIsEditing(false);
      handleCloseTransaction();
   };

   const handleCancel = () => {
      setIsEditing(false);
      setEditedTransaction(selectedTransaction);
   };

   const handleChange = (e) => {
      const { name, value } = e.target;
      setEditedTransaction({ ...editedTransaction, [name]: value });
   };

   return (
      <div className={styles.selectedTransaction}>
         <h3>Selected Transaction</h3>
         <div>
            <div>
               Type: {isEditing ? <input type="text" name="type" value={editedTransaction.type} onChange={handleChange} /> : selectedTransaction.type}
            </div>
            <div>
               Description: {isEditing ? <input type="text" name="description" value={editedTransaction.description} onChange={handleChange} /> : selectedTransaction.description}
            </div>
            <div>
               Location: {isEditing ? <input type="text" name="location" value={editedTransaction.location} onChange={handleChange} /> : selectedTransaction.location}
            </div>
            {isEditing ? (
               <>
                  <button onClick={handleSave}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
               </>
            ) : (
               <button onClick={handleEdit}>Edit</button>
            )}
            <button onClick={handleCloseTransaction}>Close</button>
         </div>
      </div>
   );
};
