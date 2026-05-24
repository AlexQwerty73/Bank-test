import React from 'react';
import { Img } from '../Img';
import styles from './visibleBtn.module.css';

export const VisibleBtn = ({ isVisible, onClick }) => {
   return (
      <div onClick={onClick} className={styles.btnEdit}>
         {
            !isVisible
               ? <Img folder='common' img='hide.png' alt='hide' />
               : <Img folder='common' img='show.png' alt='show' />
         }
      </div>
   );
};
