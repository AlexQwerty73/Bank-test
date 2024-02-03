import React from 'react';
import { Card } from '../commons';
import styles from './cards.module.css';
import { Link } from 'react-router-dom';

export const Cards = ({ cards }) => {
   return (
      <div className={styles.cards}>
         {
            cards.map(card =>
               <Link to={`${card.number}`}>
                  <Card key={card.id} card={card} />
               </Link>
            )
         }
      </div>
   );
};