import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCardByNumberQuery } from '../../redux';
import styles from './CardTransactionsPage.module.css';
import { SelectedTransaction } from '../../components';

const formatDate = (dateString) => {
   const date = new Date(dateString);
   const hours = ('0' + date.getHours()).slice(-2);
   const minutes = ('0' + date.getMinutes()).slice(-2);
   const day = ('0' + date.getDate()).slice(-2);
   const month = ('0' + (date.getMonth() + 1)).slice(-2);
   const year = date.getFullYear();

   return `${hours}:${minutes} ${day}.${month}.${year}`;
};

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
                  <div>Date: {formatDate(transaction.date)}</div>
                  <div>Amount: {transaction.amount}</div>
               </li>
            ))}
         </ul>

         {selectedTransaction && <SelectedTransaction card={card} selectedTransaction={selectedTransaction} handleCloseTransaction={handleCloseTransaction} />}
      </div>
   );
};
