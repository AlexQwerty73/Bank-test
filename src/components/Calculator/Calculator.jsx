import React, { useState, useEffect } from 'react';
import styles from './calculator.module.css';
import { useGetDepositApiQuery } from '../../redux/depositApi';

export const Calculator = () => {
   const { data: depositData = {}, error: depositError } = useGetDepositApiQuery();

   const [currency, setCurrency] = useState('UAH');
   const [months, setMonths] = useState(3);
   const [taxDeducted, setTaxDeducted] = useState(true);
   const [result, setResult] = useState(null);
   const [amount, setAmount] = useState(1000);
   const minAmount = depositData[currency]?.minAmount;
   const maxAmount = depositData[currency]?.maxAmount;
   const [inputError, setInputError] = useState('');

   useEffect(() => {
      calculateDeposit();
   }, [amount, months, currency, taxDeducted, depositData]);

   const calculateDeposit = () => {
      if (depositError) {
         console.error('Error fetching deposit:', depositError);
         return;
      }

      if (isNaN(amount) || amount < minAmount || amount > maxAmount) {
         if (amount < minAmount) {
            setInputError('Please enter an amount greater than or equal to ' + minAmount + '.');
         } else if (amount > maxAmount) {
            setInputError('Please enter an amount less than or equal to ' + maxAmount + '.');
         } else {
            setInputError('Please enter a valid amount.');
         }
         return;
      } else {
         setInputError('');
      }


      let interestRate = 0;
      if (currency === 'UAH') {
         interestRate = depositData?.UAH?.monthlyInterestRates[months];
      } else {
         interestRate = depositData?.USD?.monthlyInterestRates[months];
      }

      if (!interestRate) {
         setResult('Please enter valid data.');
         return;
      }

      const interest = ((amount * (interestRate / 100)) / 12) * Number(months);
      const total = amount + interest;
      const tax = interest * depositData.tax;

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
         <div className={styles.calc_conainer}>
            <h1 className={styles.header}>I want multiply 💸</h1>
            <div className={styles.content}>
               <div className={styles.input_group}>
                  <label className={styles.input_label}>
                     <span className={styles.input_amount_span}>Amount</span>
                     <input
                        className={styles.number_input}
                        type="number"
                        min={minAmount}
                        max={maxAmount}
                        step="100"
                        value={amount}
                        onChange={(e) => setAmount(parseInt(e.target.value))}
                     />
                     <span className={styles.input_currency_span}>{currency}</span>
                     {inputError && <p className={styles.error}>{inputError}</p>}
                  </label>

                  <label className={styles.input_label}>
                     <select className={styles.select_input} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="UAH">UAH</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                     </select>
                     <span className={styles.select_input_currency_span}>Currency</span>
                  </label>
                  <div className={styles.range_input_container}>
                     <div
                        className={styles.input_range_box}
                        data-min={depositData.minMonths}
                        data-max={depositData.maxMonths}
                     >
                        <div className={styles.due_date}>Due Date</div>
                        <span className={styles.range_value}>{months} months</span>
                        <input
                           className={styles.range_input}
                           type="range"
                           min={depositData.minMonths}
                           max={depositData.maxMonths}
                           value={months}
                           onChange={(e) => setMonths(parseInt(e.target.value))}
                        />
                     </div>
                  </div>
               </div>
               <hr className={styles.hr}/>
               <div className={styles.result_container}>
                  {result && (
                     <>
                        <div className={styles.total}>
                           <h3>You will get</h3>
                           <h1>{!taxDeducted ? result.total : result.totalAfterTax} {currency}</h1>
                           <label>
                              Calculate with taxes
                              <input type="checkbox" className={styles.checkbox_custom} checked={taxDeducted} onChange={(e) => setTaxDeducted(e.target.checked)} />
                           </label>
                        </div>

                        <hr className={styles.hr} />

                        <div className={styles.data_item}>
                           <p>Invested</p>
                           <h3>{result.amount} {currency}</h3>
                        </div>

                        <div className={styles.data_item}>
                           <p>Interest Rate</p>
                           <h3>{result.annualInterestRate} % annually</h3>
                        </div>

                        <div className={styles.data_item}>
                           <p>Interest Rate after taxes</p>
                           <h3>{result.annualInterestRateAfterTax} %</h3>
                        </div>

                        <div className={styles.data_item}>
                           <p>Tax withheld</p>
                           <h3>{result.tax} {currency}</h3>
                        </div>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};
