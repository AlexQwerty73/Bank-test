import React from 'react';
import styles from '../../userProfile.module.css'
import { formatDateTime } from '../../../../utils';

export const LineLastLogin = ({lastLogin}) => {
   return (
      <div className={styles.line}>
         <div className={styles.leftPart}>
            <strong>Last Login:</strong>
            <div className={styles.itemData}>
               {formatDateTime(lastLogin)}
            </div>
         </div>
         <div className={styles.rightPart}>
         </div>
      </div>
   );
};