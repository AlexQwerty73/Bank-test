import { configureStore } from "@reduxjs/toolkit";
import { cardsApi } from "./cardsApi";
import { usersApi } from "./usersApi";
import { exchangeRateApi } from "./exchangeRateApi";

// Створення центрального зберігання (store) з використанням конфігурації Redux Toolkit
export const store = configureStore({
   // визначення редукторів для обробки стану, пов'язаного з API
   reducer: {
      [cardsApi.reducerPath]: cardsApi.reducer,
      [usersApi.reducerPath]: usersApi.reducer,
      [exchangeRateApi.reducerPath]: exchangeRateApi.reducer,
   },

   // Додаємо middleware для обробки асинхронних операцій, пов'язаних з API
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(cardsApi.middleware, usersApi.middleware, exchangeRateApi.middleware),
});
