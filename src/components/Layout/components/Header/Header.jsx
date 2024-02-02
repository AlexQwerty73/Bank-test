import React from 'react';
import { Logo } from '../../../commons/';
import { NavLink } from 'react-router-dom';
import { loadFromLocalStorage } from '../../../../utils'
import styles from './dark.module.css';

export const Header = () => {
   const userId = loadFromLocalStorage('userId');

   return (
      <header className={styles.header}>
         <div className="container">
            <nav className={styles.nav}>
               <div className="leftPart">
                  <Logo />
               </div>
               <div className={styles.rightPart}>
                  <ul className={styles.menu}>
                     <li className={styles.menu__item}><NavLink to={`/${userId}/cards`}>Cards</NavLink></li>
                     <li className={styles.menu__item}><NavLink to={`/${userId}/transactions`}>Transactions</NavLink></li>
                     <li className={styles.menu__item}><NavLink to={`/${userId}/profile`}>Profile</NavLink></li>
                     <li className={styles.menu__item}><NavLink to={`/login`}>Log in</NavLink></li>
                  </ul>
               </div>
            </nav>
         </div>
      </header>
   );
};
