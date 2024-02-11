import { configureStore } from "@reduxjs/toolkit";
import { cardsApi } from "./cardsApi";
import { usersApi } from "./usersApi";
import { exchangeRateApi } from "./exchangeRateApi";
import { depositApi } from "./depositApi";

export const store = configureStore({
   reducer: {
      [cardsApi.reducerPath]: cardsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [exchangeRateApi.reducerPath]: exchangeRateApi.reducer,
      [depositApi.reducerPath]: depositApi.reducer,
   },

   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cardsApi.middleware, usersApi.middleware, exchangeRateApi.middleware, depositApi.middleware),
});
