import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './loginForm.module.css';
import { saveToLocalStorage } from '../../../utils';
import { useUserByEmail } from '../../../hooks';
import { getFormError } from './getFormError';
import { useUpdateUserMutation } from '../../../redux';

export const LoginForm = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [updateUser] = useUpdateUserMutation();

   const navigate = useNavigate();
   const userData = useUserByEmail(email);

   const handleLogin = () => {
      const isPasswordOk = userData?.password === password || false;

      if (userData && isPasswordOk) {
         saveToLocalStorage('userId', userData.id);
         navigate('/');

         const newUserData = {
            ...userData,
            lastLogin: new Date().toISOString(),
         }
         updateUser(newUserData);

      } else {
         setError(getFormError(email, password, userData, isPasswordOk));
      }
   };

   return (
      <form className={styles.loginForm}>
         <div className={styles.cross} onClick={() => navigate(-1)}>&#10540;</div>
         <label className={styles.label}>
            <input className={styles.input} type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <h2>Email:</h2>
         </label>
         <label className={styles.label}>
            <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <h2>Password:</h2>
         </label>
         <button className={styles.btn} type="button" onClick={handleLogin}>
            Log in
         </button>
         {error && <div className={styles.errorWindow}>{error}</div>}
         <Link to="/create-user" className={styles.link}>Create a new account</Link>
      </form>
   );
};
