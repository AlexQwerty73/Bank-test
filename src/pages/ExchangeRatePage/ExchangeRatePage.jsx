import React from 'react';
import { exchangeRateApi, useGetExchangeRateApiQuery } from '../../redux';
import { ExchangeRatesSection } from '../../components';

export const ExchangeRatePage = () => {
   const { data: exchangeRates = [], isLoading } = useGetExchangeRateApiQuery();

   if (isLoading) {
      return <div className="container"><h3>Loading ...</h3></div>
   }

   return (
      <section className='exchangeRatePage'>

         <ExchangeRatesSection data={exchangeRates} />

      </section>
   );
};
