import React, { useState } from 'react';
import styles from './cardData.module.css';
import { convertToNumberCartFormat } from '../../utils';
import { useUpdateCardMutation } from '../../redux';
import { Card, EditBtn, Img } from '../commons';

export const CardData = ({ card }) => {
   const { number, expiryDate, cvv, balance, type, currency } = card;
   const [updateCard] = useUpdateCardMutation();
   const [isCvvEdit, setIsCvvEdit] = useState(false);
   const [cvvEdit, setCvvEdit] = useState(cvv);

   const onClickHandler = () => {
      setIsCvvEdit(!isCvvEdit);
      if (cvvEdit.length !== 3 && !/^\d{3}$/.test(cvvEdit)) {
         setCvvEdit(cvv);
         console.log('CVV should have exactly 3 numeric digits');
         return;
      }
      const newCardData = { ...card, cvv: cvvEdit };
      if (cvv !== cvvEdit) updateCard(newCardData).unwrap();
   };

   const renderData = (label, value) => (
      <div className={styles.data__item}>
         <div className={styles.item__data}>
            <h3 className={styles.h3}>{label}</h3>
            <h3 className={styles.h3}>{value}</h3>
         </div>
      </div>
   );

   const renderCvvData = () => (
      <div className={styles.data__item}>
         <div className={styles.item__data}>
            <h3 className={styles.h3}>CVV:</h3>
            {!isCvvEdit ? (
               <h3 className={styles.h3}>{cvv}</h3>
            ) : (
               <input type="number" value={cvvEdit} onChange={e => setCvvEdit(e.target.value)} maxLength={3} />
            )}
         </div>
         <EditBtn isEdit={isCvvEdit} onClick={onClickHandler} />
      </div>
   );

   return (
      <div className={styles.cardData}>
         <div className={styles.leftPart}>
            <h1 className={styles.h1}>Card Data:</h1>
            <div className={styles.data}>
               {renderData('Number:', convertToNumberCartFormat(number))}
               {renderData('Expiry date:', expiryDate.split('-').reverse().join(' '))}
               {renderCvvData()}
               {renderData('Balance:', balance)}
               {renderData('Currency:', currency)}
               {renderData('Type:', type)}
            </div>
         </div>
         <div className={styles.rightPart}>
            <Card card={card} />
         </div>
      </div>
   );
};
