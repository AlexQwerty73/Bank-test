import {  Route, Routes,  } from 'react-router-dom';
import { Layout } from './components/';
import { HomePage, NotFoundPage } from './pages';

const App = () => {
  return (
    <div className="App">

      <Routes>

        <Route path='/' element={<Layout />}>

          <Route index element={<HomePage />} />

          <Route path='*' element={<NotFoundPage />} />
        </Route>

      </Routes>

    </div>
  );
}

export default App;
