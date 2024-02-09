import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));

// alert('1 - переробити стилі, 2 -калькулятор кредитів/депозитів(у валюті різні %), 3 - більше перевірок, 4 - переказ грошей + на різні валюти, 5 - декомпозицію, 6 - адаптація, 7 - світла/темна тема, 8 - сторінка з курсами валют');

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
