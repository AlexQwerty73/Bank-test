import React from 'react';
import styles from './remittanceForm.module.css';
import { FormComponent } from '../../commons';
import { useGetCardsQuery, useGetExchangeRateApiQuery, useUpdateCardMutation } from '../../../redux';
import { useNavigate } from 'react-router-dom';

export const RemittanceForm = () => {
   const navigate = useNavigate();
   const [updateCard] = useUpdateCardMutation();
   const { data: exchangeRate = {} } = useGetExchangeRateApiQuery();
   const { data: cards = [] } = useGetCardsQuery();

   const onSubmit = data => {
      const cardTo = cards.find(card => card.number === data.number);
      const cardFrom = cards.find(card => card.number === data.usercards);
   
      if (!cardTo || !cardFrom) {
         console.error('Card not found');
         return;
      }
   
      const exchangeRateKeyFromTo = `${cardFrom.currency.toLowerCase()}To${cardTo.currency.charAt(0).toUpperCase() + cardTo.currency.slice(1).toLowerCase()}`;
      const exchangeRateKeyToFrom = `${cardTo.currency.toLowerCase()}To${cardFrom.currency.charAt(0).toUpperCase() + cardFrom.currency.slice(1).toLowerCase()}`;
   
      const rateFromToBuy = exchangeRate[exchangeRateKeyFromTo]?.buy || 1; 
      const rateToFromSell = exchangeRate[exchangeRateKeyToFrom]?.sell || 1;
   
      const amountToTransfer = Number(data.amount) * rateFromToBuy; 
      
      const bankCommission = amountToTransfer * 0.01;
      const amountToTransferWithCommission = amountToTransfer - bankCommission;
   
      const updatedCardTo = {
         ...cardTo,
         balance: Number(cardTo.balance) + Number(amountToTransferWithCommission), 
         history: [
            ...cardTo.history,
            {
               date: new Date().toISOString(),
               type: 'remittance',
               amount: Number(amountToTransferWithCommission),
               action: '+',
               description: `from ${cardFrom.number}`,
               location: ''
            }
         ]
      };
   
      const updatedCardFrom = {
         ...cardFrom,
         balance: Number(cardFrom.balance) - Number(data.amount), 
         history: [
            ...cardFrom.history,
            {
               date: new Date().toISOString(),
               type: 'remittance',
               amount: Number(data.amount),
               action: '-',
               description: `To ${cardTo.number}`,
               location: ''
            }
         ]
      };
   
      updateCard(updatedCardTo).unwrap(); 
      updateCard(updatedCardFrom).unwrap(); 
   
      navigate(-1); 
   }
   
   

   if (!cards) {
      return <p>Loading card data...</p>;
   }

   return (
      <div className={styles.remittanceForm}>
         <FormComponent inputs={['usercards', 'number', 'amount']} onSubmit={onSubmit} />
      </div>
   );
};
