import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LoginForm } from '../../components/Forms/LoginForm';
import { CreateUserForm } from '../../components/Forms/CreateUserForm';
import s from './authPage.module.css';

export const AuthPage = () => {
   const location  = useLocation();
   const isLogin   = location.pathname === '/login';

   // Panel position: true = left (register), false = right (login)
   const [panelOnLeft,        setPanelOnLeft]        = useState(!isLogin);
   // Which text to render inside the panel
   const [showRegister,       setShowRegister]       = useState(!isLogin);
   // Fades only the panel text content (not forms)
   const [panelContentVisible, setPanelContentVisible] = useState(true);
   // Which form sits on z-index:1 (on top in the overlap zone)
   const [activeForm,         setActiveForm]         = useState(isLogin ? 'login' : 'register');

   const isFirstRender = useRef(true);

   useEffect(() => {
      if (isFirstRender.current) {
         isFirstRender.current = false;
         return;
      }

      const goingToRegister = !isLogin;

      // ① Bring the destination form to the top IMMEDIATELY so it's ready
      //    behind the panel as it starts moving.
      setActiveForm(goingToRegister ? 'register' : 'login');

      // ② Fade out panel text, then start the slide.
      setPanelContentVisible(false);
      setPanelOnLeft(goingToRegister);

      // ③ Swap panel text at the midpoint of the 0.75 s slide.
      const mid = setTimeout(() => {
         setShowRegister(goingToRegister);
         setPanelContentVisible(true);
      }, 375);

      return () => clearTimeout(mid);
   }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

   const loginCls    = `${s.formArea} ${s.formAreaLeft}  ${activeForm === 'login'    ? s.formTop : s.formBottom}`;
   const registerCls = `${s.formArea} ${s.formAreaRight} ${activeForm === 'register' ? s.formTop : s.formBottom}`;
   const panelCls    = `${s.panel} ${panelOnLeft ? s.panelLeft : s.panelRight}`;
   const innerCls    = `${s.panelInner} ${panelContentVisible ? s.panelVisible : s.panelHidden}`;

   return (
      <div className={s.pageWrapper}>
         <div className={s.authCard}>

            {/* Login form — always left-aligned, z-index toggled */}
            <div className={loginCls}>
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

            {/* Register form — always right-aligned, z-index toggled */}
            <div className={registerCls}>
               <div className={s.formHeader}>
                  <h2 className={s.formTitle}>Create account</h2>
                  <p className={s.formSubtitle}>Fill in your details to get started</p>
               </div>
               <CreateUserForm />
               <p className={s.switchText}>
                  Already have an account?{' '}
                  <Link to="/login" className={s.switchLink}>Sign in</Link>
               </p>
            </div>

            {/* Sliding indigo panel — always on top (z-index:3) */}
            <div className={panelCls}>
               <div className={innerCls}>
                  <div className={s.brandMark}>◈</div>

                  {showRegister ? (
                     <>
                        <h1 className={s.panelTitle}>Banking<br />made simple.</h1>
                        <p className={s.panelSub}>
                           Open an account in minutes.<br />
                           No paperwork. No queues.
                        </p>
                        <ul className={s.panelList}>
                           <li>✦ Instant card issuance</li>
                           <li>✦ Multi-currency support</li>
                           <li>✦ Real-time transfers</li>
                        </ul>
                     </>
                  ) : (
                     <>
                        <h1 className={s.panelTitle}>Your finances,<br />one place.</h1>
                        <p className={s.panelSub}>
                           Track spending, move money<br />and grow your savings.
                        </p>
                        <ul className={s.panelList}>
                           <li>✦ Secure &amp; encrypted</li>
                           <li>✦ 24/7 access</li>
                           <li>✦ Instant notifications</li>
                        </ul>
                     </>
                  )}
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
