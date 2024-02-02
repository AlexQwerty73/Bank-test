import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import s from './loginForm.module.css';
import { saveToLocalStorage } from '../../utils';
import { useUserByEmail } from '../../hooks/';
import { getFormError } from './getFormError';

export const LoginForm = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const navigate = useNavigate();
   const userData = useUserByEmail(email);

   const handleLogin = () => {
      const isPasswordOk = userData?.password === password || false;

      if (userData && isPasswordOk) {
         saveToLocalStorage('userId', userData.id);
         navigate('/');
      } else {
         setError(getFormError(email, password, userData, isPasswordOk));
      }
   };

   return (
      <form className={s.loginForm}>
         <div className={s.cross} onClick={() => navigate(-1)}>&#10540;</div>
         <label className={s.label}>
            <h2>Email:</h2>
            <input className={s.input} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
         </label>
         <label className={s.label}>
            <h2>Password:</h2>
            <input className={s.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
         </label>
         <button className={s.btn} type="button" onClick={handleLogin}>
            Увійти
         </button>
         {error && <div className={s.errorWindow}>{error}</div>}
      </form>
   );
};