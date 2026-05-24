import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCardByNumberQuery } from '../../store';
import { CardData } from '../../components';
import { loadFromLocalStorage } from '../../utils';

export const CardPage = () => {
   const { cardNumber } = useParams();
   const userId = loadFromLocalStorage('userId');

   const { data: cardData = [], isLoading, error } = useGetCardByNumberQuery(cardNumber);
   const card = cardData[0];

   if (isLoading) return <p style={{ padding: '48px 0', textAlign: 'center', color: '#6B7280' }}>Loading…</p>;
   if (error)     return <p style={{ padding: '48px 0', textAlign: 'center', color: '#DC2626' }}>Failed to load card.</p>;
   if (!card)     return <p style={{ padding: '48px 0', textAlign: 'center', color: '#6B7280' }}>Card not found.</p>;
   if (card.userId !== userId) return <h2 style={{ padding: '48px 24px', textAlign: 'center' }}>This is not your card.</h2>;

   return (
      <div className="container">
         <CardData card={card} />
      </div>
   );
};
