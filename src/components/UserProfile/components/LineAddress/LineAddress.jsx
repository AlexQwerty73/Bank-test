import React from 'react';
import styles from '../../userProfile.module.css'
import { EditBtn } from '../../../commons';

export const LineAddress = ({ saveNewData, isEditObj, address, onUserEditChange, userEdit }) => {
   return (
      <div className={styles.line}>
         <div className={styles.leftPart}>
            <strong>Address:</strong>
            <div className={styles.itemData}>
               {
                  isEditObj.address
                     ? <input className={styles.input} value={userEdit.address} onChange={e => onUserEditChange('address', e.target.value)} />
                     : address
               }
            </div>
         </div>
         <div className={styles.rightPart}>
            <EditBtn
               isEdit={isEditObj.address}
               onClick={() => saveNewData('address')}
            />
         </div>
      </div>
   );
};
