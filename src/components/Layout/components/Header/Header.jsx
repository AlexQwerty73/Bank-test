import React from 'react';
import { Logo } from '../../../commons/';
import { NavLink, } from 'react-router-dom';
import styles from './dark.module.css';

export const Header = () => {
   return (
      <header className={styles.header}>
         <div className="container">
            <nav className={styles.nav}>
               <div className="leftPart">
                  <Logo />
               </div>
               <div className={styles.rightPart}>
                  <ul className={styles.menu}>
                     <li className={styles.menu__item}><NavLink to="/cards">Cards</NavLink></li>
                     <li className={styles.menu__item}><NavLink to="/transactions">Transactions</NavLink></li>
                     <li className={styles.menu__item}><NavLink to="/profile">Profile</NavLink></li>
                  </ul>
               </div>
            </nav>
         </div>
      </header>
   );
};
