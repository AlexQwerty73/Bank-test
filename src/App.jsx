import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/';

const  App =()=> {
  return (
    <div className="App">

      <Routes>

        <Route path='/' element={<Layout />}>

          

          <Route path='*'/>
        </Route>

      </Routes>

    </div>
  );
}

export default App;
