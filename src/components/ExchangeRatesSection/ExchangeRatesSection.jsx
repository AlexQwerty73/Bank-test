import React, { useState } from 'react';
import styles from './ExchangeRatesSection.module.css';
import { formatDateTime } from '../../utils';

export const ExchangeRatesSection = ({ data }) => {
   const [selectedExchangeCurrency, setSelectedExchangeCurrency] = useState('usdToUah');
   const [selectedDays, setSelectedDays] = useState(7);

   const handleDaysChange = (event) => {
      setSelectedDays(parseInt(event.target.value));
   }

   const findRecentData = (history) => {
      if (selectedDays === 'all') return history;

      const today = new Date().toISOString().split('T')[0];
      let newHistory = [];
      let currentDate = new Date(today);

      const maxDays = history.length;

      do {
         const foundDay = history.find(day => day.date === currentDate.toISOString().split('T')[0]);
         if (foundDay) {
            newHistory.push(foundDay);
         }
         currentDate.setDate(currentDate.getDate() - 1);
      } while (newHistory.length < parseInt(selectedDays) && newHistory.length < maxDays);

      return newHistory;
   }





   const exchangeRateItem = ([key, exchangeCurrency]) => {
      const currencyPair = exchangeCurrency.name.split('TO');

      return (
         <li onClick={() => setSelectedExchangeCurrency(key)} className={styles.exchangeRateItem} key={key}>
            <h3 className={styles.currencyPair}>{currencyPair[0]} &#8646; {currencyPair[1]}</h3>
            <p className={styles.exchangeRateValue}>Buy: {exchangeCurrency.buy}</p>
            <p className={styles.exchangeRateValue}>Sell: {exchangeCurrency.sell}</p>
         </li>);
   };

   const renderTable = ([key, exchangeCurrency]) => {
      const history = exchangeCurrency.history;
      const recentData = findRecentData(history);

      return (
         <table>
            <tbody>
               <tr>
                  <td>DATE</td>
                  <td>Buy</td>
                  <td>Sell</td>
               </tr>
               {
                  recentData.map((day, i) => (
                     <tr key={i}>
                        <td>{formatDateTime(day.date)}</td>
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
                  <select className={styles.daysSelect} onChange={handleDaysChange}>
                     <option value={7}>Last 7 days</option>
                     <option value={10}>Last 10 days</option>
                     <option value={30}>Last 30 days</option>
                     <option value={90}>Last 90 days</option>
                     <option value={180}>Last 180 days</option>
                     <option value={365}>Last year</option>
                     <option value={'all'}>All</option>
                  </select>
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
                        renderTable(Object.entries(data).find(([key]) => key === selectedExchangeCurrency))
                     }
                  </div>
               </div>

            </div>

         </div>
      </div>
   );
};
