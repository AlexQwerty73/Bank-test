import React, { useState } from 'react';
import styles from './userProfile.module.css';
import { useUpdateUserMutation } from '../../redux';
import { formatDateTime } from '../../utils';
import { EditableField } from './components';

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
      <div className={styles.profile}>
         <div>
            <h1 className={styles.h1}>{name} {surname}'s Profile</h1>
            <div className={styles.userData}>

               <div className={styles.line}>
                  <strong>Email:</strong>
                  <EditableField
                     isEdit={isEditObj.email}
                     value={userEdit.email}
                     onChange={(value) => onUserEditChange('email', value)}
                     onSave={() => saveNewData('email')}
                  />
               </div>

               <hr className={styles.hr} />

               <div className={styles.line}>
                  <strong>Address:</strong>
                  <EditableField
                     isEdit={isEditObj.address}
                     value={userEdit.address}
                     onChange={(value) => onUserEditChange('address', value)}
                     onSave={() => saveNewData('address')}
                  />
               </div>

               <hr className={styles.hr} />

               <div className={styles.line}>
                  <strong>Phone:</strong>
                  <EditableField
                     isEdit={isEditObj.phone}
                     value={userEdit.phone}
                     onChange={(value) => onUserEditChange('phone', value)}
                     onSave={() => saveNewData('phone')}
                  />
               </div>

               <hr className={styles.hr} />

               <div className={styles.line}>
                  <strong>Last Login:</strong>

                  <div className={styles.itemData}>
                     <div className={styles.leftPart}>
                        {formatDateTime(lastLogin)}
                     </div>
                  </div>
               </div>

               <hr className={styles.hr} />

               <div className={styles.line}>
                  <strong>Created At:</strong>
                  <div className={styles.itemData}>
                     <div className={styles.leftPart}>
                        {formatDateTime(createdAt)}
                     </div>
                  </div>
               </div>

               <hr className={styles.hr} />

            </div>
         </div>
      </div>
   );
};
