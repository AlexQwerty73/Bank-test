import { configureStore } from '@reduxjs/toolkit';
import { cardsApi }        from './cardsApi';
import { usersApi }        from './usersApi';
import { exchangeRateApi } from './exchangeRateApi';
import { depositApi }      from './depositApi';
import { accountsApi }     from './accountsApi';
import { transactionsApi } from './transactionsApi';

export const store = configureStore({
   reducer: {
      [cardsApi.reducerPath]:        cardsApi.reducer,
      [usersApi.reducerPath]:        usersApi.reducer,
      [exchangeRateApi.reducerPath]: exchangeRateApi.reducer,
      [depositApi.reducerPath]:      depositApi.reducer,
      [accountsApi.reducerPath]:     accountsApi.reducer,
      [transactionsApi.reducerPath]: transactionsApi.reducer,
   },

   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
         cardsApi.middleware,
         usersApi.middleware,
         exchangeRateApi.middleware,
         depositApi.middleware,
         accountsApi.middleware,
         transactionsApi.middleware,
      ),
});
