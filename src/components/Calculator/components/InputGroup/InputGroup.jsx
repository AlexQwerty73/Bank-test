import React from 'react';
import styles from '../../calculator.module.css';

export const InputGroup = ({ amount, minAmount, currency, setAmount, months, setMonths, setCurrency, setTaxDeducted, taxDeducted }) => {
   return (
      <div className={styles.input_group}>
         <h2>Deposit Calculator</h2>
         <div>
            <label>
               Amount: {amount} {currency}
               <input
                  className={styles.range_input}
                  type="range"
                  min={minAmount}
                  max="100000"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
               />
            </label>
         </div>
         <div>
            <label>
               Term (months): {months} months
               <input
                  className={styles.range_input}
                  type="range"
                  min="3"
                  max="24"
                  value={months}
                  onChange={(e) => setMonths(parseInt(e.target.value))}
               />
            </label>
         </div>
         <div>
            <label>
               Currency:
               <select className={styles.select_input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="UAH">UAH</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
               </select>
            </label>
         </div>
         <div className={styles.checkbox_label}>
            Deduct Tax (20%)
            <input type="checkbox" className={styles.checkbox_custom} checked={taxDeducted} onChange={(e) => setTaxDeducted(e.target.checked)} />
         </div>
      </div>
   );
};
