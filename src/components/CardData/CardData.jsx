import React, { useState } from 'react';
import styles from './cardData.module.css';
import { convertToNumberCartFormat } from '../../utils';
import { useUpdateCardMutation } from '../../redux';
import { Card, EditBtn } from '../commons';

export const CardData = ({ card }) => {
   const { number, expiryDate, cvv, balance, type, currency, pin } = card;
   const [updateCard] = useUpdateCardMutation();
   const [isEdit, setIsEdit] = useState({ cvv: false, pin: false })
   const [editData, setEditData] = useState({ cvv, pin })

   const onClickHandler = () => {
      setIsCvvEdit(!isCvvEdit);
      const isValidCvv = cvvEdit.length === 3 && /^\d{3}$/.test(cvvEdit);
      if (!isValidCvv) {
         setCvvEdit(cvv);
         console.log('CVV should have exactly 3 numeric digits');
         return;
      }
      if (cvv !== cvvEdit) updateCard({ ...card, cvv: cvvEdit }).unwrap();
   };



   const renderDataItem = (label, value, isEditable = false, isShow = true) => (
      <div className={styles.data__item}>
         <div className={styles.item__data}>
            <h3 className={styles.h3}>{label}</h3>
            {isEditable ? (
               !isCvvEdit
                  ? <h3 className={styles.h3}>{value}</h3>
                  : <input className={styles.input} type="number" value={cvvEdit} onChange={e => setCvvEdit(e.target.value)} maxLength={3} />)
               : <span>{value}</span>
            }
         </div>
         {isEditable && <EditBtn isEdit={isCvvEdit} onClick={onClickHandler} />}
      </div>
   );

   return (
      <div className={styles.cardData}>
         <div className={styles.leftPart}>
            <h1 className={styles.h1}>Card Data:</h1>
            <div className={styles.data}>
               {renderDataItem('Number:', convertToNumberCartFormat(number))}
               {renderDataItem('Expiry date:', expiryDate.split('-').reverse().join(' '))}
               {renderDataItem('CVV:', cvv, true)}
               {renderDataItem('Balance:', `${balance} ${currency}`)}
               {renderDataItem('Type:', type)}
               {renderDataItem('Pin:', pin)}
            </div>
         </div>
         <div className={styles.rightPart}>
            <Card card={card} />
         </div>
      </div>
   );
};
