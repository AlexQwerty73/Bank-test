import { Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from './components/';
import { CardsPage, HomePage, LoginPage, NotFoundPage } from './pages';

const App = () => {
  return (
    <div className="App">

      <Routes>

        <Route path='/' element={<Layout />}>
          <Route path="null/*" element={<Navigate to="/login" />} />

          <Route index element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />

          <Route path=':userId/'>
            <Route path='cards/' element={<CardsPage />} />
            <Route path='create-card/' />  {/*  */}
          </Route>

          <Route path='create-user/' /> {/*  */}

          <Route path='*' element={<NotFoundPage />} />
        </Route>

      </Routes>

    </div>
  );
}

export default App;
