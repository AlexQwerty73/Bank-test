import { Navigate, Route, Routes } from 'react-router-dom';

const  App =()=> {
  return (
    <div className="App">

      <Routes>

        <Route path='/'>

          

          <Route path='*'/>
        </Route>

      </Routes>

    </div>
  );
}

export default App;
