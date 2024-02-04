import React from 'react';
import styles from '../../userProfile.module.css'
import { EditBtn } from '../../../commons';

export const LinePhone = ({ saveNewData, isEditObj, phone, onUserEditChange, userEdit }) => {
   return (
      <div className={styles.line}>
         <div className={styles.leftPart}>
            <strong>Phone:</strong>
            <div className={styles.itemData}>
               {
                  isEditObj.phone
                     ? <input className={styles.input} value={userEdit.phone} onChange={e => onUserEditChange('phone', e.target.value)} />
                     : phone
               }
            </div>
         </div>
         <div className={styles.rightPart}>
            <EditBtn
               isEdit={isEditObj.phone}
               onClick={() => saveNewData('phone')}
            />
         </div>
      </div>
   );
};