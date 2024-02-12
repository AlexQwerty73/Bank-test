import React, { useEffect, useState } from 'react';
import styles from './ExchangeRatesSection.module.css';
import { findRecentData, formatDateTime } from '../../utils';
import ExchangeRateChart from '.././ExchangeRate/ExchangeRateChart';

export const ExchangeRatesSection = ({ data }) => {
   const [selectedExchangeCurrency, setSelectedExchangeCurrency] = useState('usdToUah');
   const [selectedDays, setSelectedDays] = useState('7');
   const [viewType, setViewType] = useState('table');

   useEffect(() => {
      console.log(selectedDays);
   }, [selectedDays]);

   const handleDaysChange = (event) => {
      const days = event.target.value;
      setSelectedDays(days);
   };

   const exchangeRateItem = ([key, exchangeCurrency]) => {
      const currencyPair = exchangeCurrency.name.split('TO');

      return (
         <li onClick={() => setSelectedExchangeCurrency(key)} className={styles.exchangeRateItem} key={key}>
            <h3 className={styles.currencyPair}>{currencyPair[0]} &#8646; {currencyPair[1]}</h3>
            <p className={styles.exchangeRateValue}>Buy: {exchangeCurrency.buy}</p>
            <p className={styles.exchangeRateValue}>Sell: {exchangeCurrency.sell}</p>
         </li>
      );
   };

   const renderTable = (exchangeCurrency) => {
      const history = exchangeCurrency.history;
      const recentData = findRecentData(history, selectedDays).reverse();

      return (
         <table>
            <tbody>
               <tr>
                  <td>DATE</td>
                  <td>Buy</td>
                  <td>Sell</td>
               </tr>
               {recentData.map((day, i) => (
                  <tr key={i}>
                     <td>{formatDateTime(day.date)}</td>
                     <td>{day.buy}</td>
                     <td>{day.sell}</td>
                  </tr>
               ))}
            </tbody>
         </table>
      );
   };


   return (
      <div className={styles.exchangeRatesSection}>
         <div className='container'>
            <div className={styles.exchangeRates}>
               <div className={styles.sideBar}>
                  <select className={styles.daysSelect} value={selectedDays} onChange={handleDaysChange}>
                     <option value={'7'}>Last 7 days</option>
                     <option value={'10'}>Last 10 days</option>
                     <option value={'30'}>Last 30 days</option>
                     <option value={'90'}>Last 90 days</option>
                     <option value={'180'}>Last 180 days</option>
                     <option value={'365'}>Last year</option>
                     <option value={'all'}>All</option>
                  </select>
                  <ul className={styles.view}>
                     <li className={styles.view__item}>
                        <button onClick={() => setViewType('table')}>Table</button>
                     </li>
                     <li className={styles.view__item}>
                        <button onClick={() => setViewType('graph')}>Graph</button>
                     </li>
                  </ul>
                  <ul className={styles.exchange}>
                     {Object.entries(data).map(exchangeRateItem)}
                  </ul>
               </div>
               <div className={styles.content}>
                  <div className={styles.table}>
                     {viewType === 'graph' ? (
                        <ExchangeRateChart width='1000px' height='500px' history={findRecentData(data[selectedExchangeCurrency]?.history || [], selectedDays)} currency={selectedExchangeCurrency} />
                     ) : (
                        renderTable(data[selectedExchangeCurrency])
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
