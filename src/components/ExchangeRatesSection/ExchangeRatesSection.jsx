import React, { useState } from 'react';
import styles from './ExchangeRatesSection.module.css';

export const ExchangeRatesSection = ({ data }) => {
   const [selectedExchangeCurrency, setSelectedExchangeCurrency] = useState('uahToUsd');

   const exchangeRateItem = ([key, exchangeCurrency]) => {
      const currencyPair = exchangeCurrency.name.split('TO');

      return (
         <li onClick={() => setSelectedExchangeCurrency(key)} className={styles.exchangeRateItem} key={key}>
            <h3 className={styles.currencyPair}>{currencyPair[0]} &#8646; {currencyPair[1]}</h3>
            <p className={styles.exchangeRateValue}>Buy: {exchangeCurrency.buy}</p>
            <p className={styles.exchangeRateValue}>Sell: {exchangeCurrency.sell}</p>
         </li>);
   };

   const renderTabel = ([key, exchangeCurrency]) => {
      const history = exchangeCurrency.history;

      return (
         <table>
            <tbody>
               <tr>
                  <td>DATE</td>
                  <td>Buy</td>
                  <td>Sell</td>
               </tr>
               {
                  history.map((day, i) => (
                     <tr key={i}>
                        <td>{day.date}</td>
                        <td>{day.buy}</td>
                        <td>{day.sell}</td>
                     </tr>
                  ))
               }
            </tbody>
         </table>
      )
   }

   return (
      <div className={styles.exchangeRatesSection}>
         <div className='container'>

            <div className={styles.exchangeRates}>
               <div className={styles.sideBar}>
                  <ul className={styles.view}>
                     <li className={styles.view__item}><button>Table</button></li>
                     <li className={styles.view__item}><button>Graph</button></li>
                  </ul>
                  <ul className={styles.exchange}>
                     {
                        Object.entries(data).map(exchangeRate => exchangeRateItem(exchangeRate))
                     }
                  </ul>
               </div>
               <div className={styles.content}>
                  <div className={styles.table}>
                     {
                        renderTabel(Object.entries(data).find(([key]) => key === selectedExchangeCurrency))
                     }
                  </div>
               </div>

            </div>

         </div>
      </div>
   );
};
