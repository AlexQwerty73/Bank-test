import React, { useState } from 'react';
import styles from './remittanceForm.module.css';
import { FormComponent } from '../../commons';
import { useGetCardsQuery, useGetExchangeRateApiQuery, useUpdateCardMutation } from '../../../redux';
import { useNavigate, useParams } from 'react-router-dom';

export const RemittanceForm = () => {
   const { userId } = useParams()
   const navigate = useNavigate();
   const [updateCard] = useUpdateCardMutation();
   const { data: exchangeRate = {} } = useGetExchangeRateApiQuery();
   const { data: cards = [] } = useGetCardsQuery();
   const [confirmationMessage, setConfirmationMessage] = useState(null);
   const [transferData, setTransferData] = useState(null);

   const onSubmit = data => {
      const cardTo = cards.find(card => card.number === data.number);
      const cardFrom = cards.find(card => card.number === data.usercards);

      if (!cardTo || !cardFrom) {
         console.error('Card not found');
         return;
      }

      const currencyFrom = cardFrom.currency.toUpperCase();
      const currencyTo = cardTo.currency.toUpperCase();
      const amountFrom = data.amount;
      const rate = exchangeRate[`${currencyFrom.toLowerCase()}To${currencyTo.charAt(0).toUpperCase() + currencyTo.slice(1).toLowerCase()}`]?.buy || 1;
      const amountTo = (Number(data.amount) * rate).toFixed(2); 

      setTransferData({
         cardTo,
         cardFrom,
         amountFrom,
         amountTo
      });

      setConfirmationMessage(`Ви впевнені, що хочете переказати кошти з ${currencyFrom} до ${currencyTo}?\nСума для переказу: ${amountFrom} ${currencyFrom} -> ${amountTo} ${currencyTo}`);
   };

   const confirmTransfer = () => {
      const { cardTo, cardFrom, amountFrom, amountTo } = transferData;
   
      const rate = exchangeRate[`${cardFrom.currency.toLowerCase()}To${cardTo.currency.charAt(0).toUpperCase() + cardTo.currency.slice(1).toLowerCase()}`]?.buy || 1;
      const amountToTransfer = Number(amountFrom) * rate;
      const bankCommission = amountToTransfer * 0.01;
      const amountToTransferWithCommission = (amountToTransfer - bankCommission).toFixed(2);
   
      if (Number(cardFrom.balance) < Number(amountFrom)) {
         alert('На вашій картці недостатньо коштів для здійснення переказу.');
         return;
      }
   
      const updatedCardTo = {
         ...cardTo,
         balance: (Number(cardTo.balance) + Number(amountToTransferWithCommission)).toFixed(2),
         history: [
            ...cardTo.history,
            {
               date: new Date().toISOString(),
               type: 'remittance',
               amount: Number(amountToTransferWithCommission).toFixed(2),
               action: '+',
               description: `from ${cardFrom.number}.\n${cardFrom.currency} => ${cardTo.currency}`,
               location: ''
            }
         ]
      };
   
      const updatedCardFrom = {
         ...cardFrom,
         balance: (Number(cardFrom.balance) - Number(amountFrom)).toFixed(2),
         history: [
            ...cardFrom.history,
            {
               date: new Date().toISOString(),
               type: 'remittance',
               amount: Number(amountFrom).toFixed(2),
               action: '-',
               description: `To ${cardTo.number}`,
               location: ''
            }
         ]
      };
   
      updateCard(updatedCardTo).unwrap();
      updateCard(updatedCardFrom).unwrap();
   
      navigate(`/${userId}/transactions`);
   };
   


   if (!cards) {
      return <p>Loading card data...</p>;
   }

   return (
      <div className={styles.remittanceForm}>

         {confirmationMessage && (
            <div className={styles.confirmationMessage}>
               <p>{confirmationMessage}</p>
               <button onClick={confirmTransfer}>Підтвердити переказ</button>
               <button onClick={() => setConfirmationMessage(null)}>Скасувати</button>
            </div>
         )}

         <FormComponent inputs={['usercards', 'number', 'amount']} onSubmit={onSubmit} />
      </div>
   );
};
