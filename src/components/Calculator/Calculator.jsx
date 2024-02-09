import React, { useState, useEffect } from 'react';

export const Calculator = () => {
   const [amount, setAmount] = useState(1000);
   const [months, setMonths] = useState(3);
   const [currency, setCurrency] = useState('UAH');
   const [result, setResult] = useState(null);

   useEffect(() => {
      calculateDeposit();
   }, [amount, months, currency]);

   const calculateDeposit = () => {
      if (amount <= 1000 || months < 3 || months > 24) {
         setResult('Будь ласка, введіть валідні дані.');
         return;
      }

      let interestRate = 0;
      if (currency === 'UAH') {
         interestRate = 10; 
      } else {
         interestRate = 3; 
      }

      const interest = (amount * interestRate * months) / 100;

      setResult(`Прибуток від депозиту складатиме ${interest.toFixed(2)} ${currency}.`);
   };

   return (
      <div>
         <h2>Калькулятор депозитів</h2>
         <div>
            <label>
               Сума:
               <input type="range" min="1000" max="100000" step="1000" value={amount} onChange={(e) => setAmount(parseInt(e.target.value))} />
               {amount} {currency}
            </label>
         </div>
         <div>
            <label>
               Термін (місяці):
               <input type="range" min="3" max="24" value={months} onChange={(e) => setMonths(parseInt(e.target.value))} />
               {months} місяці
            </label>
         </div>
         <div>
            <label>
               Валюта:
               <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="UAH">UAH</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
               </select>
            </label>
         </div>
         {result && <p>{result}</p>}
      </div>
   );
};
