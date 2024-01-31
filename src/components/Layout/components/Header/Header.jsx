import React, { useState } from 'react';
import { Logo } from '../../../commons/';
import { NavLink } from 'react-router-dom';
import stylesDark from './styles/dark.module.css';
import stylesLight from './styles/light.module.css';

export const Header = () => {
   const userId = useParams();
   const [isDarkTheme, setIsDarkTheme] = useState(false);
   const styles = isDarkTheme ? stylesDark : stylesLight;

   return (
      <header className={styles.header}>
         <div className="container">
            <nav className={styles.nav}>
               <Logo />

               <ul>
                  <li><NavLink to='/cards'>Cards</NavLink></li>
                  <li><NavLink to='/transactions'>Transactions</NavLink></li>
                  <li><NavLink to='/profile'>Profile</NavLink></li>
               </ul>
               
               <button onClick={() => setIsDarkTheme(!isDarkTheme)}>
                  Toggle Theme
               </button>
            </nav>
         </div>
      </header>
   );
};
