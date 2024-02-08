import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCardByNumberQuery } from '../../redux';
import styles from './CardTransactionsPage.module.css'; // Імпортуйте стилі

export const CardTransactionsPage = () => {
   const { cardNumber } = useParams();
   const { data: card = [], isLoading } = useGetCardByNumberQuery(cardNumber);
   const [selectedTransaction, setSelectedTransaction] = useState(null);

   if (isLoading) {
      return <p>Loading...</p>;
   }

   const handleTransactionClick = (transaction) => {
      setSelectedTransaction(transaction);
   };

   const handleCloseTransaction = () => {
      setSelectedTransaction(null);
   };

   return (
      <div className={styles.cardTransactionsPage}>
         <h2>Card Transactions</h2>
         <p>Card Number: {card?.number}</p>
         <ul>
            {card[0]?.history?.map(transaction => (
               <li key={transaction.date} onClick={() => handleTransactionClick(transaction)} className={styles.transaction}>
                  <div>Date: {transaction.date}</div>
                  <div>Amount: {transaction.amount}</div>
               </li>
            ))}
         </ul>
         {selectedTransaction && (
            <div className={styles.selectedTransaction}>
               <h3>Selected Transaction</h3>
               <div>Date: {selectedTransaction.date}</div>
               <div>Amount: {selectedTransaction.amount}</div>
               <div>Type: {selectedTransaction.type}</div>
               <div>Description: {selectedTransaction.description}</div>
               <div>Location: {selectedTransaction.location}</div>
               <button onClick={handleCloseTransaction}>Close</button>
            </div>
         )}
      </div>
   );
};
