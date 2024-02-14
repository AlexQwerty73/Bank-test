import React, { useState } from 'react';
import styles from './cardData.module.css';
import { convertToNumberCartFormat } from '../../utils';
import { useUpdateCardMutation } from '../../redux';
import { Card, EditBtn, VisibleBtn } from '../commons';

export const CardData = ({ card }) => {
   const { number, expiryDate, cvv, balance, type, currency, pin } = card;
   const [updateCard] = useUpdateCardMutation();
   const [isEdit, setIsEdit] = useState({ cvv: false, pin: false });
   const [isVisible, setIsVisible] = useState({ pin: false, cvv: false });
   const [editData, setEditData] = useState({ cvv, pin });

   const onClickHandler = (label) => {
      setIsEdit({ ...isEdit, [label]: !isEdit[label] });
      if (label === 'cvv') {
         const isValidCvv = editData.cvv.length === 3 && /^\d{3}$/.test(editData.cvv);
         if (!isValidCvv) {
            setEditData({ ...editData, cvv });
            console.log('CVV should have exactly 3 numeric digits');
            return;
         }
         if (cvv !== editData.cvv || pin !== editData.pin) updateCard({ ...card, [label]: editData[label] }).unwrap();
      }
      if (cvv !== editData.cvv || pin !== editData.pin) updateCard({ ...card, [label]: editData[label] }).unwrap();
   };

   const onVisibleChange = (label) => {
      if (isVisible[label] === false) {
         setTimeout(() => {
            setIsVisible({ ...isVisible, [label]: false });
         }, 5000);
      }
      setIsVisible({ ...isVisible, [label]: !isVisible[label] });
   };


   const renderDataItem = (label, value, isEditable = false, isShow = false) => {
      const labLow = label.toLowerCase();

      return (
         <div className={styles.data__item}>
            <div className={styles.item__data}>
               <h3 className={styles.h3}>{label}:</h3>
               {isEditable && isEdit[labLow] ? (
                  <input className={styles.input} type="number" value={editData[labLow]} onChange={e => setEditData({ ...editData, [labLow]: e.target.value })} maxLength={3} />
               ) : (
                  <h3 className={styles.h3}>{value}</h3>
               )}
            </div>
            <div className={styles.btns}>
               <div className={styles.btn}>
                  {isShow && <VisibleBtn isVisible={isVisible[labLow]} onClick={() => onVisibleChange(labLow)} />}
               </div>
               <div className={styles.btn}>
                  {isEditable && <EditBtn isEdit={isEdit[labLow]} onClick={() => onClickHandler(labLow)} />}
               </div>
            </div>


         </div>
      );
   };

   return (
      <div className={styles.cardData}>
         <div className={styles.leftPart}>
            <h1 className={styles.h1}>Card Data:</h1>
            <div className={styles.data}>
               {renderDataItem('Number', convertToNumberCartFormat(number))}
               {renderDataItem('Expiry date', expiryDate.split('-').reverse().join(' '))}
               {renderDataItem('CVV', isVisible.cvv ? cvv : "***", true, true)}
               {renderDataItem('Balance', `${balance} ${currency}`)}
               {renderDataItem('Pin', isVisible.pin ? pin : "****", true, true)}
               {renderDataItem('Type', type)}
            </div>
         </div>
         <div className={styles.rightPart}>
            <Card card={card} />
         </div>
      </div>
   );
};
