import React from 'react';
import { Logo } from '../../../commons/';
import { NavLink, useLocation } from 'react-router-dom';
import { loadFromLocalStorage } from '../../../../utils'
import styles from './dark.module.css';

export const Header = () => {
   const userId = loadFromLocalStorage('userId');
   const location = useLocation();
   const isHomePage = location.pathname === '/';

   return (
      <header className={`${styles.header} ${isHomePage ? styles.transparentHeader : ''}`}>
         <div className="container">
            <nav className={styles.nav}>
               <div className="leftPart">
                  <Logo />
               </div>
               <div className={styles.rightPart}>
                  <ul className={styles.menu}>
                     <li className={styles.menu__item}>
                        <NavLink exact to={`/${userId}/cards`} activeClassName={styles.active}>Cards</NavLink>
                     </li>
                     <li className={styles.menu__item}>
                        <NavLink to={`/${userId}/transactions`} activeClassName={styles.active}>Transactions</NavLink>
                     </li>
                     <li className={styles.menu__item}>
                        <NavLink to={`/${userId}/profile`} activeClassName={styles.active}>Profile</NavLink>
                     </li>
                     <li className={styles.menu__item}>
                        <NavLink to={`/login`} activeClassName={styles.active}>Log in</NavLink>
                     </li>
                  </ul>
               </div>
            </nav>
         </div>
      </header>
   );
};
