import React, { useState } from 'react';
import styles from './cardData.module.css';
import { Card, Img } from '../commons';
import { convertToNumberCartFormat } from '../../utils';
import { useUpdateCardMutation } from '../../redux';

export const CardData = ({ card }) => {
   const { number, expiryDate, cvv, balance, type, currency } = card;
   const [updateCard] = useUpdateCardMutation();

   const [isCvvEdit, setIsCvvEdit] = useState(false);
   const [cvvEdit, setCvvEdit] = useState(cvv);

   const onClickHandler = (item, newData) => {
      setIsCvvEdit(!isCvvEdit);

      const newCardData = {
         ...card,
         [item]: newData
      }

      if (cvv !== cvvEdit) {
         updateCard(newCardData).unwrap();
         console.log(newCardData);
      }
   }

   return (
      <div className={styles.cardData}>
         <div className={styles.leftPart}>
            <h1 className={styles.h1}>Card Data:</h1>
            <div className={styles.data}>

               <div className={styles.data__item}>
                  <div className={styles.item__data}>
                     <h3 className={styles.h3}>Number:</h3>
                     <h3 className={styles.h3}>{convertToNumberCartFormat(number)}</h3>
                  </div>
               </div>

               <div className={styles.data__item}>
                  <div className={styles.item__data}>
                     <h3 className={styles.h3}>Expiry date:</h3>
                     <h3 className={styles.h3}>{expiryDate.split('-').reverse().join(' ')}</h3>
                  </div>
               </div>

               <div className={styles.data__item}>
                  <div className={styles.item__data}>
                     <h3 className={styles.h3}>CVV:</h3>
                     {
                        !isCvvEdit
                           ? <h3 className={styles.h3}>{cvv}</h3>
                           : <input type='number' value={cvvEdit} onChange={e => setCvvEdit(e.target.value)} maxLength={3} />
                     }

                  </div>
                  <div className={styles.btnEdit} onClick={() => onClickHandler('cvv', cvvEdit)}>
                     {
                        isCvvEdit
                           ? <Img folder='common' img='done.png' alt='done' />
                           : <Img folder='common' img='edit-pencil.png' alt='Edit button' />
                     }
                  </div>
               </div>

               <div className={styles.data__item}>
                  <div className={styles.item__data}>
                     <h3 className={styles.h3}>Balance:</h3>
                     <h3 className={styles.h3}>{balance}</h3>
                  </div>
               </div>

               <div className={styles.data__item}>
                  <div className={styles.item__data}>
                     <h3 className={styles.h3}>Currency:</h3>
                     <h3 className={styles.h3}>{currency}</h3>
                  </div>
               </div>

               <div className={styles.data__item}>
                  <div className={styles.item__data}>
                     <h3 className={styles.h3}>Type:</h3>
                     <h3 className={styles.h3}>{type}</h3>
                  </div>
               </div>

            </div>
         </div>
         <div className={styles.rightPart}>
            <Card card={card} />
         </div>
      </div>
   );
};
