import React from 'react';
import styles from '../../calculator.module.css';

export const ResultContainer = ({ result, resultLabels, currency }) => {
   return (
      <div className={styles.result_container}>
         {result && (
            <div>
               {Object.entries(result).map(([key, value]) => (
                  <div key={key}>
                     <p className={styles.result_item}>
                        {resultLabels[key]}: {key === 'annualInterestRate' ? `${value}%` : `${value} ${currency}`}
                     </p>
                     <hr />
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
