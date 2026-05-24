import React from 'react';
import { Link } from 'react-router-dom';
import s from './logo.module.css';

export const Logo = () => (
   <div className="logo">
      <Link to="/">
         <img src="/imgs/logo/main.png" alt="Bank logo" className={s.logo} />
      </Link>
   </div>
);
