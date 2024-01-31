import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/';
import { HomePage } from './pages';

const App = () => {
  return (
    <div className="App">

      <Routes>

        <Route path='/' element={<Layout />}>

          <Route index element={<HomePage />} />

          <Route path='*' />
        </Route>

      </Routes>

    </div>
  );
}

export default App;
