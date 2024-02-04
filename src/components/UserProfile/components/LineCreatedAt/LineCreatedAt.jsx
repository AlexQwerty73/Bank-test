import React from 'react';
import styles from '../../userProfile.module.css'
import { formatDateTime } from '../../../../utils';

export const LineCreatedAt = ({ createdAt }) => {
   return (
      <div className={styles.line}>
         <div className={styles.leftPart}>
            <strong>Created At:</strong>
            <div className={styles.itemData}>
               {formatDateTime(createdAt)}
            </div>
         </div>
         <div className={styles.rightPart}>
         </div>
      </div>
   );
};