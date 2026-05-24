import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../commons';
import styles from './cards.module.css';

export const Cards = ({ cards, accountsById = {} }) => (
   <div className={styles.grid}>
      {cards.map(card => {
         const acc = accountsById[card.accountId];
         return (
            <Link key={card.id} to={`${card.number}`} className={styles.cardLink}>
               <Card card={card} currency={acc?.currency} />
            </Link>
         );
      })}
   </div>
);
