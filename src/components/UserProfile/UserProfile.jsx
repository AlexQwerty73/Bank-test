import React, { useState } from 'react';
import styles from './userProfile.module.css';
import { formatDateTime } from '../../utils';

export const UserProfile = ({ user }) => {
   const { name, surname, email, createdAt, lastLogin, address, phone } = user;

   const [userEdit, setUserEdit] = useState({ ...user });

   const onUserEditChange = (item, data) => {
      setUserEdit({ ...userEdit, [item]: data })
   }

   return (
      <div className={styles.profilePage}>
         <div>
            <h1 className={styles.h1}>{name} {surname}'s Profile</h1>

            <div className={styles.userData}>
               <p className={styles.p}>
                  <strong>Email:</strong>
                  {email}
               </p>
               <p className={styles.p}>
                  <strong>Created At:</strong>
                  {formatDateTime(createdAt)}
               </p>
               <p className={styles.p}>
                  <strong>Last Login:</strong>
                  {formatDateTime(lastLogin)}
               </p>
               <p className={styles.p}>
                  <strong>Address:</strong>
                  {address}
               </p>
               <p className={styles.p}>
                  <strong>Phone:</strong>
                  {phone}
               </p>
            </div>
         </div>
      </div>
   );
};
