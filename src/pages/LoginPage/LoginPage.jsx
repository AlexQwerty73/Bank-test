import React from 'react';
import { Link } from 'react-router-dom';
import { LoginForm } from '../../components/Forms/LoginForm';
import s from './loginPage.module.css';

export const LoginPage = () => {
   return (
      <div className={s.pageWrapper}>
      <div className={s.authCard}>

         {/* Левая — форма */}
         <div className={s.formSide}>
            <div className={s.formHeader}>
               <h2 className={s.formTitle}>Welcome back</h2>
               <p className={s.formSubtitle}>Sign in to your account</p>
            </div>
            <LoginForm />
            <p className={s.switchText}>
               Don't have an account?{' '}
               <Link to="/create-user" className={s.switchLink}>Create one</Link>
            </p>
         </div>

         {/* Правая — брендинг */}
         <div className={s.panel}>
            <div className={s.panelInner}>
               <div className={s.brandMark}>◈</div>
               <h1 className={s.panelTitle}>Your finances,<br />one place.</h1>
               <p className={s.panelSub}>
                  Track spending, move money<br />and grow your savings.
               </p>
               <ul className={s.panelList}>
                  <li>✦ Secure &amp; encrypted</li>
                  <li>✦ 24/7 access</li>
                  <li>✦ Instant notifications</li>
               </ul>
            </div>
            <div className={s.panelDeco} aria-hidden="true">
               <span>◈</span>
               <span>◈</span>
            </div>
         </div>

      </div>
      </div>
   );
};
