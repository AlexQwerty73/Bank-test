import { Route, Routes, Navigate } from 'react-router-dom';
import { CreateUserForm, Layout } from './components/';
import { CardPage, CardTransactionsPage, CardsPage, CreateCardPage, ExchangeRatePage, HomePage, LoginPage, NotFoundPage, TransactionsPage, UserProfilePage } from './pages';

const App = () => {
  return (
    <div className="App">

      <Routes>

        <Route path='/' element={<Layout />}>
          <Route path="/null/*" element={<Navigate to="/login" />} />

          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='create-user/' element={<CreateUserForm />} />
          <Route path='exchange-rate/' element={<ExchangeRatePage />} />

          <Route path=':userId/'>

            <Route path='create-card/' element={<CreateCardPage />} />
            <Route path='profile/' element={<UserProfilePage />} />
            <Route path='transactions/'>
              <Route index element={<TransactionsPage />} />
              <Route path=':cardNumber/' element={<CardTransactionsPage />} />{/*  */}
            </Route>

            <Route path='cards/'>
              <Route index element={<CardsPage />} />
              <Route path=':cardNumber/' element={<CardPage />} />

              <Route path='*' element={<NotFoundPage />} />
            </Route>

            <Route path='*' element={<NotFoundPage />} />
          </Route>


          <Route path='*' element={<NotFoundPage />} />
        </Route>

      </Routes>

    </div>
  );
}

export default App;
