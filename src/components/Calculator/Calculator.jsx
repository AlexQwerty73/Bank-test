import React, { useState, useEffect } from 'react';
import { InputGroup, ResultContainer } from './components';
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

      let annualInterestRate = interestRate * (taxDeducted ? 0.8 : 1);
      const interest = (amount * annualInterestRate * months) / 1200;
      const total = amount + interest;

      setResult({
         amount: amount,
         profit: interest.toFixed(2),
         annualInterestRate: annualInterestRate.toFixed(2),
         total: total.toFixed(2)
      });
   };

   return (
      <div className={styles.calculator}>
         <InputGroup
            months={months}
            amount={amount}
            currency={currency}
            minAmount={minAmount}
            taxDeducted={taxDeducted}
            setAmount={setAmount}
            setMonths={setMonths}
            setCurrency={setCurrency}
            setTaxDeducted={setTaxDeducted}
         />
         <ResultContainer result={result} currency={currency} />
      </div>
   );
};
