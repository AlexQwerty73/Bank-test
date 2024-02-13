import React from 'react';
import { Link } from 'react-router-dom';
import { Img } from '../../components';
import styles from './notFoundPage.module.css';

export const NotFoundPage = () => {
   return (
      <div className='container'>
         <div className={styles.notFound}>
            <h1>Page not found</h1>
            <Link to='/'>Home</Link>
            <div className={styles.img}>
               <Img folder='common' img='notFound.png' />
            </div>
         </div>
      </div>
   );
};