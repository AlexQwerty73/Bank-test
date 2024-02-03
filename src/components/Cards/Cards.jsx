import React from 'react';
import { Card } from '../commons';
import styles from './cards.module.css';
import { Link } from 'react-router-dom';

export const Cards = ({ cards }) => {
   return (
      <div className={styles.cards}>
         {
            cards.map(card =>
               <Link key={card.id} to={`${card.number}`}>
                  <Card  card={card} />
               </Link>
            )
         }
      </div>
   );
};