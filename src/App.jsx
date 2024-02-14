import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/';
import { CardPage, CardTransactionsPage, CardsPage, CreateCardPage, CreateUserPage, ExchangeRatePage, HomePage, LoginPage, NotFoundPage, TransactionsCardsPage, UserProfilePage } from './pages';

const App = () => {
  return (
    <div className="App">

      <Routes>

        <Route path='/' element={<Layout />}>

          <Route index element={<HomePage />} />
          <Route path='exchange-rate/' element={<ExchangeRatePage />} />

          <Route path=':userId/'>

            <Route path='create-card/' element={<CreateCardPage />} />
            <Route path='profile/' element={<UserProfilePage />} />

            <Route path='transactions/'>
              <Route index element={<TransactionsCardsPage />} />
              <Route path='remittance/' element={<RemittancePage />}/>
              <Route path=':cardNumber/' element={<CardTransactionsPage />} />
            </Route>

            <Route path='cards/'>
              <Route index element={<CardsPage />} />
              <Route path=':cardNumber/' element={<CardPage />} />
            </Route>

          </Route>

        </Route>

        <Route path='/'>
          <Route path='create-user/' element={<CreateUserPage />} />
          <Route path='login/' element={<LoginPage />} />
          <Route path='null/*' element={<Navigate to='/login' />} />
        </Route>

        <Route path='*' element={<NotFoundPage />} />

      </Routes>

    </div>
  );
}

export default App;
