import React from 'react';
import { Img } from '../Img';
import styles from './editBtn.module.css'

export const EditBtn = ({ isEdit, onClick }) => {
   const handleClick = () => {
      onClick();
   };
   
   return (
      <div onClick={handleClick} className={styles.btnEdit}>
         {
            isEdit
               ? <Img folder='common' img='done.png' alt='done' />
               : <Img folder='common' img='edit-pencil.png' alt='Edit button' />
         }
      </div>
   );
};