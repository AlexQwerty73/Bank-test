import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/';
import { CardPage, CardsPage, CreateCardPage, HomePage, LoginPage, NotFoundPage, UserProfilePage } from './pages';

const App = () => {
  return (
    <div className="App">

      <Routes>

        <Route path='/' element={<Layout />}>
          <Route path="/null/*" element={<Navigate to="/login" />} />

          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='create-user/' /> {/*  */}

          <Route path=':userId/'>

            <Route path='create-card/' element={<CreateCardPage />} />  {/*  */}
            <Route path='profile/' element={<UserProfilePage />} />

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
