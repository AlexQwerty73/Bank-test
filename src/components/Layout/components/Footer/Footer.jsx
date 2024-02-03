import React from 'react';
import styles from './footer.module.css';
import { Img, Logo } from '../../../commons';

export const Footer = () => {
   return (
      <footer className={styles.footer}>
         <div className='container'>
            <div className={styles.footerContent}>
               <div className={styles.contactInfo}>
                  <div className={styles.email}>
                     <span>Email:</span>
                     <a href="mailto:info@yourcompany.com">info@somecompany.com</a>
                     <a href="mailto:info@yourcompany.com">info@somecompany.com</a>
                     <a href="mailto:info@yourcompany.com">info@somecompany.com</a>
                     <a href="mailto:info@yourcompany.com">info@somecompany.com</a>
                  </div>
               </div>
               <div className={styles.contactInfo}>
                  <div className={styles.phoneNumber}>
                     <span>Phone:</span>
                     <a href="tel:+123456789">+1 (234) 567-89</a>
                     <a href="tel:+123456789">+1 (234) 567-89</a>
                     <a href="tel:+123456789">+1 (234) 567-89</a>
                     <a href="tel:+123456789">+1 (234) 567-89</a>
                  </div>
               </div>
               <div className={styles.socialIcons}>
                  <a href='https://www.facebook.com/'><Img folder='icon' img='facebook.png' /></a>
                  <a href='https://www.instagram.com/'><Img folder='icon' img='instagram.png' /></a>
                  <a href='https://www.messenger.com/'><Img folder='icon' img='messenger.png' /></a>
               </div>
            </div>
            <div className={styles.copyRight}>
               &copy; 2024 Some Company. All rights reserved.
            </div>
         </div>
      </footer>
   );
};
