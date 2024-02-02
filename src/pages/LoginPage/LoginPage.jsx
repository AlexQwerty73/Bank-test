import React from 'react';
import { LoginForm } from '../../components';
import s from './loginPage.module.css';

export const LoginPage = () => {
   return (
      <div className={s.loginPage}>
         <LoginForm />
      </div>
   );
};
