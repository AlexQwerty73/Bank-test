import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGetCardsByUserIdQuery } from '../../redux';
import { CardsTransactionList } from '../../components'
import styles from './TransactionsCardsPage.module.css';
import { RemittanceBtn } from '../../components/';

export const TransactionsCardsPage = () => {
   const { userId } = useParams();
   const { data: cards = [], isLoading } = useGetCardsByUserIdQuery(userId);

   return (
      <div className={styles.transactionsPage}>
         <div className='container'>

            <RemittanceBtn/>

            <CardsTransactionList cards={cards} />

         </div>
      </div >
   );
};
