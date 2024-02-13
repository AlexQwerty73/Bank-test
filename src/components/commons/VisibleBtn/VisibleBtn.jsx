import React from 'react';
import { Img } from '../Img';
import styles from './visibleBtn.module.css';

export const VisibleBtn = ({ isVisible, onClick }) => {
   const handleClick = () => {
      onClick();
   };

   return (
      <div onClick={handleClick} className={styles.btnEdit}>
         {
            !isVisible
               ? <Img folder='common' img='hide.png' alt='hide' />
               : <Img folder='common' img='show.png' alt='show' />
         }
      </div>
   );
};
