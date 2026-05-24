import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout, ProtectedRoute } from './components/';
import {
   AllTransactionsPage,
   AuthPage,
   CardPage,
   CardTransactionsPage,
   CardsPage,
   CreateAccountPage,
   CreateCardPage,
   DepositPage,
   ExchangeRatePage,
   HomePage,
   NotFoundPage,
   RemittancePage,
   SettingsPage,
   TransactionsCardsPage,
   UserProfilePage,
} from './pages';

const App = () => {
   return (
      <div className="App">
         <Routes>

            {/* Публічні маршрути (без Header/Footer) */}
            <Route path="/create-user" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />

            {/* Редирект із /null/* на /login (якщо userId не заданий) */}
            <Route path="/null/*" element={<Navigate to="/login" replace />} />

            {/* Захищені маршрути з Layout */}
            <Route element={<ProtectedRoute />}>
               <Route path="/" element={<Layout />}>

                  <Route index element={<HomePage />} />
                  <Route path="exchange-rate/" element={<ExchangeRatePage />} />

                  <Route path=":userId/">
                     <Route path="create-card/"    element={<CreateCardPage />} />
                     <Route path="create-account/" element={<CreateAccountPage />} />
                     <Route path="profile/"        element={<UserProfilePage />} />

                     <Route path="transactions/">
                        <Route index element={<TransactionsCardsPage />} />
                        <Route path="remittance/" element={<RemittancePage />} />
                        <Route path=":accountId/" element={<CardTransactionsPage />} />
                     </Route>

                     <Route path="history/"   element={<AllTransactionsPage />} />
                     <Route path="deposits/" element={<DepositPage />} />
                     <Route path="settings/" element={<SettingsPage />} />

                     <Route path="cards/">
                        <Route index element={<CardsPage />} />
                        <Route path=":cardNumber/" element={<CardPage />} />
                     </Route>

                     {/* 404 для невідомих маршрутів під /:userId/ */}
                     <Route path="*" element={<NotFoundPage />} />
                  </Route>

               </Route>
            </Route>

            {/* Глобальний 404 */}
            <Route path="*" element={<NotFoundPage />} />

         </Routes>
      </div>
   );
};

export default App;
