import React from 'react';
import { Card } from '../commons';
import styles from './cards.module.css';

export const Cards = ({ cards }) => {
   return (
      <div className={styles.cards}>
         {
            cards.map(card => <Card key={card.id} card={card} />)
         }
      </div>
   );
};