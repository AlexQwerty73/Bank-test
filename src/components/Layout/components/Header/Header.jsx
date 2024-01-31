import React, { useState } from 'react';
import { Logo } from '../../../commons/';
import { NavLink } from 'react-router-dom';
import stylesLight from './light.module.css';
import stylesDark from './dark.module.css';

export const Header = () => {
   const [isDarkTheme, setIsDarkTheme] = useState(false);
   const styles = isDarkTheme ? stylesDark : stylesLight;

   return (
      <header className={styles.header}>
         <div className="container">
            <nav className={styles.nav}>
               <Logo />
               <ul>
                  <li><NavLink to='/cards'>Cards</NavLink></li>
               </ul>
               <button onClick={() => setIsDarkTheme(!isDarkTheme)}>
                  Toggle Theme
               </button>
            </nav>
         </div>
      </header>
   );
};
