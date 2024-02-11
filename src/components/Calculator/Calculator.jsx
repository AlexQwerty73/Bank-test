import React, { useState, useEffect } from 'react';
import styles from './calculator.module.css';

export const Calculator = () => {
   const [amount, setAmount] = useState(1000);
   const [months, setMonths] = useState(3);
   const [currency, setCurrency] = useState('UAH');
   const [taxDeducted, setTaxDeducted] = useState(true);
   const [result, setResult] = useState(null);
   const minAmount = currency === 'UAH' ? 1000 : 100;

   useEffect(() => {
      calculateDeposit();
   }, [amount, months, currency, taxDeducted]);

   const calculateDeposit = () => {
      if (amount < minAmount || months < 3 || months > 24) {
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

      const interest = (amount * interestRate * months) / 1200;
      const total = amount + interest;
      const tax = interest * 0.2;

      setResult({
         amount: amount,
         profit: interest.toFixed(2),
         annualInterestRate: interestRate.toFixed(2),
         annualInterestRateAfterTax: (interestRate * 0.8).toFixed(2),
         total: total.toFixed(2),
         tax: tax.toFixed(2),
         totalAfterTax: (total - tax).toFixed(2)
      });
   };

   return (
      <div className={styles.calculator}>
         <div className={styles.input_group}>
            <h2>Deposit Calculator</h2>
            <div>
               <label>
                  Amount: {amount} {currency}
                  <input
                     className={styles.range_input}
                     type="range"
                     min={minAmount}
                     max="10000000"
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
         </div>
         <div className={styles.result_container}>
            {result && (
               <>
                  <div className="total">
                     <h3>Ви отримаєте</h3>
                     <h1>{!taxDeducted ? result.total : result.totalAfterTax} {currency}</h1>
                     <label>
                        розрахувати з урахуванням податків
                        <input type="checkbox" className={styles.checkbox_custom} checked={taxDeducted} onChange={(e) => setTaxDeducted(e.target.checked)} />
                     </label>
                  </div>

                  <hr />

                  <div className="amout">
                     <p>Вклали</p>
                     <h3>{result.amount} {currency}</h3>
                  </div>

                  <div>
                     <p>Процентна ставка</p>
                     <h3>{result.annualInterestRate} % річних</h3>
                  </div>

                  <div>
                     <p>Процентна ставка після сплати податків</p>
                     <h3>{result.annualInterestRateAfterTax} % річних</h3>
                  </div>

                  <div>
                     <p>Утримано податку</p>
                     <h3>{result.tax} {currency}</h3>
                  </div>
               </>
            )}
         </div>
      </div>
   );
};
