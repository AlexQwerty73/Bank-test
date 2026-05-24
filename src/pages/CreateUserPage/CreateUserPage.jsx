import React from 'react';
import { Link } from 'react-router-dom';
import { CreateUserForm } from '../../components/Forms/CreateUserForm';
import styles from './createUserPage.module.css';

export const CreateUserPage = () => {
   return (
      <div className={styles.pageWrapper}>
      <div className={styles.authCard}>

         {/* Левая брендинг-панель */}
         <div className={styles.panel}>
            <div className={styles.panelInner}>
               <div className={styles.brandMark}>◈</div>
               <h1 className={styles.panelTitle}>Banking<br />made simple.</h1>
               <p className={styles.panelSub}>
                  Open an account in minutes.<br />
                  No paperwork. No queues.
               </p>
               <ul className={styles.panelList}>
                  <li>✦ Instant card issuance</li>
                  <li>✦ Multi-currency support</li>
                  <li>✦ Real-time transfers</li>
               </ul>
            </div>
            <div className={styles.panelDeco} aria-hidden="true">
               <span>◈</span>
               <span>◈</span>
            </div>
         </div>

         {/* Правая — форма */}
         <div className={styles.formSide}>
            <div className={styles.formHeader}>
               <h2 className={styles.formTitle}>Create account</h2>
               <p className={styles.formSubtitle}>Fill in your details to get started</p>
            </div>
            <CreateUserForm />
            <p className={styles.switchText}>
               Already have an account?{' '}
               <Link to="/login" className={styles.switchLink}>Sign in</Link>
            </p>
         </div>

      </div>
      </div>
   );
};
