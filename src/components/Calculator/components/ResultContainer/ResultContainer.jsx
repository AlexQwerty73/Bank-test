import React from 'react';
import styles from '../../calculator.module.css';

export const ResultContainer = ({ result, currency }) => {
   return (
      <div className={styles.result_container}>
         <h2>Output Data</h2>
         {result && (
            <div>
               {Object.entries(result).map(([key, value]) => (
                  <div key={key}>
                     <p className={styles.result_item}>{key}: {value} {currency}</p>
                     <hr />
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
