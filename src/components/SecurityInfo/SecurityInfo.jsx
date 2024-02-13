import React from 'react';
import styles from './securityInfo.module.css';
import { Img } from '../commons';

export const SecurityInfo = () => {
   return (
      <div className={styles.securityInfo}>
         <h2 className={styles.title}>Protection of your financial well-being</h2>
         <p className={styles.paragraph}>
            In our bank, we pay special attention to the security of your financial well-being.
            Thanks to modern technologies and careful control, we ensure reliable protection of your
            bank account and personal information.
         </p>
         <h3 className={styles.subtitle}>How we ensure your security:</h3>
         <ul className={styles.list}>
            <li>
               <div className={styles.img}>
                  <Img folder='home/secInfo' img='encryption.png' alt='Encryption' />
               </div>
               Modern encryption technologies to protect confidential information.
            </li>
            <li>
               <div className={styles.img}>
                  <Img folder='home/secInfo' img='monitoring.png' alt='Monitoring' />
               </div>
               System for monitoring and detecting suspicious activities on the account.
            </li>
            <li>
               <div className={styles.img}>
                  <Img folder='home/secInfo' img='support.png' alt='Support' />
               </div>
               Two-factor authentication process to verify financial transactions.
            </li>
            <li>
               <div className={styles.img}>
                  <Img folder='home/secInfo' img='update.png' alt='Updates' />
               </div>
               Regular audits and updates of security protocols.
            </li>
         </ul>
         <p className={styles.paragraph}>
            We are always ready to cooperate with you to ensure the maximum security of your banking experience.
            Please feel free to contact our support service with any security-related questions.
         </p>
      </div>
   );
};
