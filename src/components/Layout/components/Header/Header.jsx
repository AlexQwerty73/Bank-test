import React, { useState } from 'react';
import { Logo } from '../../../commons/';
import { NavLink } from 'react-router-dom';
import stylesDark from './styles/dark.module.css';
import stylesLight from './styles/light.module.css';
import { loadFromLocalStorage } from '../../../../utils';

export const Header = () => {
   const userId = loadFromLocalStorage('userId');
   const [isDarkTheme, setIsDarkTheme] = useState(false);
   const styles = isDarkTheme ? stylesDark : stylesLight;

   const onChangeHandler = () => {
      setIsDarkTheme(!isDarkTheme);
   }

   return (
      <header className={styles.header}>
         <div className="container">
            <nav className={styles.nav}>

               <div className="leftPart">
                  <Logo />
               </div>

               <div className={styles.rightPart}>

                  <input onChange={onChangeHandler} type="checkbox" className={styles.chechBox} />

                  <ul className={styles.menu}>
                     <li className={styles.menu__item}><NavLink to={userId ? `/${userId}/cards` : '/login'}>Cards</NavLink></li>
                     <li className={styles.menu__item}><NavLink to={userId ? `/${userId}/transactions` : '/login'}>Transactions</NavLink></li>
                     <li className={styles.menu__item}><NavLink to={userId ? `/${userId}/profile` : '/login'}>Profile</NavLink></li>
                  </ul>
               </div>

            </nav>
         </div >
      </header >
   );
};