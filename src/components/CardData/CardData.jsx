import React from 'react';

export const CardData = ({ card }) => {
   const { number, userId, expiryDate, cvv, balance, type, currency, history } = card;

   return (
      <div className='cardData'>
         <h1>Card Data:</h1>
         <div className="data">

            <div className="data__item">
               <h3>Number:</h3>
               <h3>{number}</h3>
            </div>

            <div className="data__item">
               <h3>Expiry date:</h3>
               <h3>{expiryDate.split('-').reverse().join(' ')}</h3>
            </div>

            <div className="data__item">
               <h3>CVV:</h3>
               <h3>{cvv}</h3>
            </div>

            <div className="data__item">
               <h3>Balance:</h3>
               <h3>{balance}</h3>
            </div>

            <div className="data__item">
               <h3>Currency:</h3>
               <h3>{currency}</h3>
            </div>

         </div>
      </div>
   );
};
