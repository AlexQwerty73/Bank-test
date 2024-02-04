import React from 'react';
import styles from '../../userProfile.module.css'
import { EditBtn } from '../../../commons';

export const LineEmail = ({ saveNewData, isEditObj, email, onUserEditChange, userEdit }) => {
   return (
      <div className={styles.line}>
         <div className={styles.leftPart}>
            <strong>Email:</strong>
            <div className={styles.itemData}>
               {
                  isEditObj.email
                     ? <input className={styles.input} value={userEdit.email} onChange={e => onUserEditChange('email', e.target.value)} />
                     : email
               }
            </div>
         </div>
         <div className={styles.rightPart}>
            <EditBtn
               isEdit={isEditObj.email}
               onClick={() => saveNewData('email')}
            />
         </div>
      </div>
   );
};
