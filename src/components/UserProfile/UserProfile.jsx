import React, { useState } from 'react';
import styles from './userProfile.module.css';
import { useUpdateUserMutation } from '../../redux';
import { LineEmail, LineCreatedAt, LineLastLogin, LineAddress, LinePhone } from './components';

export const UserProfile = ({ user }) => {
   const [updateUserData] = useUpdateUserMutation();
   const { name, surname, email, createdAt, lastLogin, address, phone } = user;

   const [userEdit, setUserEdit] = useState({ ...user });
   const [isEditObj, setIsEditObj] = useState({ email: false, phone: false, address: false });

   const saveNewData = (item) => {
      if (isEditObj.email || isEditObj.phone || isEditObj.address) {
         if (userEdit.email !== email || userEdit.phone !== phone || userEdit.address !== address) {
            updateUserData(userEdit).unwrap();
         }
      }

      setIsEditObj({ ...isEditObj, [item]: !isEditObj[item] });
   }

   const onUserEditChange = (item, data) => {
      setUserEdit({ ...userEdit, [item]: data });
   }

   return (
      <div className={styles.profilePage}>
         <div>
            <h1 className={styles.h1}>{name} {surname}'s Profile</h1>

            <div className={styles.userData}>

               <LineEmail
                  onUserEditChange={onUserEditChange}
                  saveNewData={saveNewData}
                  isEditObj={isEditObj}
                  userEdit={userEdit}
                  email={email}
               />

               <hr className={styles.hr} />

               <LineAddress
                  onUserEditChange={onUserEditChange}
                  saveNewData={saveNewData}
                  isEditObj={isEditObj}
                  userEdit={userEdit}
                  address={address}
               />

               <hr className={styles.hr} />

               <LinePhone
                  onUserEditChange={onUserEditChange}
                  saveNewData={saveNewData}
                  isEditObj={isEditObj}
                  userEdit={userEdit}
                  phone={phone}
               />
               <hr className={styles.hr} />

               <LineCreatedAt createdAt={createdAt} />

               <hr className={styles.hr} />

               <LineLastLogin lastLogin={lastLogin} />


               <hr className={styles.hr} />

            </div>

         </div>
      </div>
   );
};
