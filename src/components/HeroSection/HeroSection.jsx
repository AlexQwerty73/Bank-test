import React from 'react';
import styles from './heroSection.module.css';
import { Img } from '../commons';
import { Link } from 'react-router-dom';

export const HeroSection = () => {
   return (
      <section className={styles.heroSection}>
         <div className={styles.heroContent}>
            <h2>Welcome to Our Bank</h2>
            <p>Get access to a wide range of financial services and opportunities.</p>

            <Link to='/create-user'>
               <button className={styles.btn}>
                  Create new account!
               </button>
            </Link>
         </div>
      </section>
   );
};
