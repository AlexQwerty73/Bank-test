import React, { useState } from 'react';
import { Logo } from '../../../commons/';
import { NavLink, useLocation } from 'react-router-dom';
import { loadFromLocalStorage } from '../../../../utils'
import styles from './dark.module.css';

export const Header = () => {
   const userId = loadFromLocalStorage('userId');
   const location = useLocation();
   const isHomePage = location.pathname === '/';
   const [menuOpen, setMenuOpen] = useState(false);

   const toggleMenu = () => {
      setMenuOpen(!menuOpen);
   };

   return (
      <header className={`${styles.header} ${isHomePage ? styles.transparentHeader : ''}`}>
         <div className="container">
            <nav className={styles.nav}>
               <div className="leftPart">
                  <Logo />
               </div>
               <div className={styles.rightPart}>
                  <div className={`${styles.burger} ${menuOpen ? styles.open : ''}`} onClick={toggleMenu}>
                     <div className={styles.burgerLine}></div>
                     <div className={styles.burgerLine}></div>
                     <div className={styles.burgerLine}></div>
                  </div>
                  <ul className={`${styles.menu} ${menuOpen ? styles.open : ''}`}>
                     <li className={styles.menu__item}>
                        <NavLink to={`/${userId}/cards`}>Cards</NavLink>
                     </li>
                     <li className={styles.menu__item}>
                        <NavLink to={`/${userId}/transactions`} >Transactions</NavLink>
                     </li>
                     <li className={styles.menu__item}>
                        <NavLink to={`/${userId}/profile`} >Profile</NavLink>
                     </li>
                     <li className={styles.menu__item}>
                        <NavLink to={`/login`} >Log in</NavLink>
                     </li>
                  </ul>
               </div>
            </nav>
         </div>
      </header>
   );
};
