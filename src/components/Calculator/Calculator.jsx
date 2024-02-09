import React, { useState, useEffect } from 'react';
import styles from './calculator.module.css';

export const Calculator = () => {
   const [amount, setAmount] = useState(1000);
   const [months, setMonths] = useState(3);
   const [currency, setCurrency] = useState('UAH');
   const [taxDeducted, setTaxDeducted] = useState(false);
   const [result, setResult] = useState(null);

   useEffect(() => {
      calculateDeposit();
   }, [amount, months, currency, taxDeducted]);

   const calculateDeposit = () => {
      if (amount < 1000 || months < 3 || months > 24) {
         setResult('Please enter valid data.');
         return;
      }

      let interestRate = 0;
      if (currency === 'UAH') {
         if (months <= 6) {
            interestRate = 10;
         } else if (months <= 12) {
            interestRate = 10.5;
         } else if (months <= 18) {
            interestRate = 11;
         } else {
            interestRate = 11.5;
         }
      } else {
         if (months <= 6) {
            interestRate = 2;
         } else if (months <= 12) {
            interestRate = 2.3;
         } else if (months <= 18) {
            interestRate = 2.5;
         } else {
            interestRate = 2.7;
         }
      }

      const interest = (amount * interestRate * months) / 1200 * (taxDeducted ? 1 - 0.2 : 1);
      const total = amount + interest;

      setResult({
         amount: amount,
         profit: interest.toFixed(2),
         annualInterestRate: interestRate,
         total: total.toFixed(2)
      });
   };

   return (
      <div className={styles.calculator}>
         <div className={styles.input_group}>
            <h2>Input Data</h2>
            <div>
               <label>
                  Amount:
                  <input className={styles.range_input} type="range" min="1000" max="100000" step="100" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
                  {amount} {currency}
               </label>
            </div>
            <div>
               <label>
                  Term (months):
                  <input className={styles.range_input} type="range" min="3" max="24" value={months} onChange={(e) => setMonths(parseInt(e.target.value))} />
                  {months} months
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
            <div>
               <label className={styles.checkbox_label}>
                  <input type="checkbox" checked={taxDeducted} onChange={(e) => setTaxDeducted(e.target.checked)} />
                  Deduct Tax (20%)
               </label>
            </div>
         </div>
         <div className={styles.result_container}>
            <h2>Output Data</h2>
            {result && (
               <div>
                  <p className={styles.result_item}>Amount: {result.amount} {currency}</p>
                  <p className={styles.result_item}>Profit: {result.profit} {currency}</p>
                  <p className={styles.result_item}>Annual Interest Rate: {result.annualInterestRate}%</p>
                  <p className={styles.result_item}>Total: {result.total} {currency}</p>
               </div>
            )}
         </div>
      </div>
   );
};
