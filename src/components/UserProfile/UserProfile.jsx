import React from 'react';
import styles from './userProfile.module.css';

export const UserProfile = ({ user }) => {

   const { name, surname, email, createdAt, lastLogin, address, phone } = user;

   return (
      <div className={styles.profilePage}>
         <h1 className={styles.h1}>{name} {surname}'s Profile</h1>
         <div className={styles.userData}>
            <p className={styles.p}><strong>Email:</strong> {email}</p>
            <p className={styles.p}><strong>Created At:</strong> {createdAt}</p>
            <p className={styles.p}><strong>Last Login:</strong> {lastLogin}</p>
            <p className={styles.p}><strong>Address:</strong> {address}</p>
            <p className={styles.p}><strong>Phone:</strong> {phone}</p>
         </div>
      </div>
   );
};
