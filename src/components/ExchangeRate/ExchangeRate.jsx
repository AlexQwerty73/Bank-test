import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetExchangeRateApiQuery } from '../../redux';
import styles from './ExchangeRate.module.css';
import ExchangeRateChart from './ExchangeRateChart';
import { findRecentData } from '../../utils';

export const ExchangeRate = () => {
   const [selectedCurrency, setSelectedCurrency] = useState('usdToUah');
   const { data: exchangeRate, error, isLoading } = useGetExchangeRateApiQuery();
   let filteredHistory = [];

   if (isLoading) {
      return <p className={styles.loadingMessage}>Loading...</p>;
   }

   if (error) {
      console.error('Error fetching exchange rates:', error);
      return <p className={styles.errorMessage}>Error: {error.message}</p>;
   }

   if (exchangeRate && exchangeRate[selectedCurrency] && exchangeRate[selectedCurrency].history) {
      filteredHistory = findRecentData(exchangeRate[selectedCurrency].history, '90');
   }

   return (
      <div className={styles.exchangeRateContainer}>
         <div>
            <h2 className={styles.exchangeRateTitle}>Exchange Rates</h2>
            <ul className={styles.exchangeRateList}>
               <li
                  className={styles.exchangeRateItem}
                  onClick={() => setSelectedCurrency('usdToUah')}
               >
                  <h3 className={styles.currencyPair}>USD &#8646; UAH</h3>
                  {exchangeRate && exchangeRate.usdToUah && (
                     <>
                        <p className={styles.exchangeRateValue}>Buy: {exchangeRate.usdToUah.buy}</p>
                        <p className={styles.exchangeRateValue}>Sell: {exchangeRate.usdToUah.sell}</p>
                     </>
                  )}
               </li>
               <li
                  className={styles.exchangeRateItem}
                  onClick={() => setSelectedCurrency('eurToUah')}
               >
                  <h3 className={styles.currencyPair}>EUR &#8646; UAH</h3>
                  {exchangeRate && exchangeRate.eurToUah && (
                     <>
                        <p className={styles.exchangeRateValue}>Buy: {exchangeRate.eurToUah.buy}</p>
                        <p className={styles.exchangeRateValue}>Sell: {exchangeRate.eurToUah.sell}</p>
                     </>
                  )}
               </li>
            </ul>
            <Link to="/exchange-rate" className={styles.detailsLink}>View all exchange rates</Link>
         </div>
         <div className={styles.rightPanel}>
            <ExchangeRateChart
               history={filteredHistory}
               currency={selectedCurrency}
            />
         </div>
      </div>
   );
};
