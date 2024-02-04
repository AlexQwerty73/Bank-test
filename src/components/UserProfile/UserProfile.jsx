import React, { useState } from 'react';
import styles from './userProfile.module.css';
import { formatDateTime } from '../../utils';
import { EditBtn } from '../commons';
import { useUpdateUserMutation } from '../../redux';

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

               <div className={styles.p}>
                  <div className={styles.leftPart}>
                     <strong>Email:</strong>

                     {
                        isEditObj.email
                           ? <input value={userEdit.email} onChange={e => onUserEditChange('email', e.target.value)} />
                           : email
                     }
                  </div>
                  <div className={styles.rightPart}>
                     <EditBtn
                        isEdit={isEditObj.email}
                        onClick={() => saveNewData('email')}
                     />
                  </div>
               </div>
               <hr />

               <div className={styles.p}>
                  <div className={styles.leftPart}>
                     <strong>Created At:</strong>
                     {formatDateTime(createdAt)}
                  </div>
                  <div className={styles.rightPart}>
                  </div>
               </div>
               <hr />

               <div className={styles.p}>
                  <div className={styles.leftPart}>
                     <strong>Last Login:</strong>
                     {formatDateTime(lastLogin)}
                  </div>
                  <div className={styles.rightPart}>
                  </div>
               </div>
               <hr />

               <div className={styles.p}>
                  <div className={styles.leftPart}>
                     <strong>Address:</strong>
                     {
                        isEditObj.address
                           ? <input value={userEdit.address} onChange={e => onUserEditChange('address', e.target.value)} />
                           : address
                     }
                  </div>
                  <div className={styles.rightPart}>
                     <EditBtn
                        isEdit={isEditObj.address}
                        onClick={() => saveNewData('address')}
                     />
                  </div>
               </div>

               <hr />
               <div className={styles.p}>
                  <div className={styles.leftPart}>
                     <strong>Phone:</strong>
                     {
                        isEditObj.phone
                           ? <input value={userEdit.phone} onChange={e => onUserEditChange('phone', e.target.value)} />
                           : phone
                     }
                  </div>
                  <div className={styles.rightPart}>
                     <EditBtn
                        isEdit={isEditObj.phone}
                        onClick={() => saveNewData('phone')}
                     />
                  </div>
               </div>
               <hr />

            </div>

         </div>
      </div>
   );
};
