import React from 'react';
import styles from './ExchangeRatesSection.module.css';

export const ExchangeRatesSection = ({ data }) => {


   const exchangeRateItem = (exchangeCurrency) => {
      const currencyPair = exchangeCurrency.name.split('TO');

      return (
         <li className={styles.exchangeRateItem}>
            <h3 className={styles.currencyPair}>{currencyPair[0]} &#8646; {currencyPair[1]}</h3>
            <p className={styles.exchangeRateValue}>Buy: {exchangeCurrency.buy}</p>
            <p className={styles.exchangeRateValue}>Sell: {exchangeCurrency.sell}</p>
         </li>);
   };

   return (
      <div className="exchangeRatesSection">
         <div className='container'>
            <div className="exchangeRates">
               <div className="sideBar">
                  <ul className="view">
                     <li className="view__item"><button>Table</button></li>
                     <li className="view__item"><button>Graph</button></li>
                  </ul>
                  <ul className="exchange">
                     {exchangeRateItem(data.usdToUah)}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};
