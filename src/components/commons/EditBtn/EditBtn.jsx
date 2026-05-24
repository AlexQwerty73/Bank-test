import React from 'react';
import { Img } from '../Img';
import styles from './editBtn.module.css';

export const EditBtn = ({ isEdit, onClick }) => (
   <div onClick={onClick} className={styles.btnEdit}>
      <Img
         folder="common"
         img={isEdit ? 'done.png' : 'edit-pencil.png'}
         alt={isEdit ? 'Save' : 'Edit'}
      />
   </div>
);
