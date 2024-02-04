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

               <div className={styles.line}>
                  <div className={styles.leftPart}>
                     <strong>Email:</strong>
                     <div className={styles.itemData}>
                        {
                           isEditObj.email
                              ? <input className={styles.input} value={userEdit.email} onChange={e => onUserEditChange('email', e.target.value)} />
                              : email
                        }
                     </div>
                  </div>
                  <div className={styles.rightPart}>
                     <EditBtn
                        isEdit={isEditObj.email}
                        onClick={() => saveNewData('email')}
                     />
                  </div>
               </div>
               <hr className={styles.hr} />

               <div className={styles.line}>
                  <div className={styles.leftPart}>
                     <strong>Created At:</strong>
                     <div className={styles.itemData}>
                        {formatDateTime(createdAt)}
                     </div>
                  </div>
                  <div className={styles.rightPart}>
                  </div>
               </div>
               <hr className={styles.hr} />

               <div className={styles.line}>
                  <div className={styles.leftPart}>
                     <strong>Last Login:</strong>
                     <div className={styles.itemData}>
                        {formatDateTime(lastLogin)}
                     </div>
                  </div>
                  <div className={styles.rightPart}>
                  </div>
               </div>
               <hr className={styles.hr} />

               <div className={styles.line}>
                  <div className={styles.leftPart}>
                     <strong>Address:</strong>
                     <div className={styles.itemData}>
                        {
                           isEditObj.address
                              ? <input className={styles.input} value={userEdit.address} onChange={e => onUserEditChange('address', e.target.value)} />
                              : address
                        }
                     </div>
                  </div>
                  <div className={styles.rightPart}>
                     <EditBtn
                        isEdit={isEditObj.address}
                        onClick={() => saveNewData('address')}
                     />
                  </div>
               </div>

               <hr className={styles.hr} />
               <div className={styles.line}>
                  <div className={styles.leftPart}>
                     <strong>Phone:</strong>
                     <div className={styles.itemData}>
                        {
                           isEditObj.phone
                              ? <input className={styles.input} value={userEdit.phone} onChange={e => onUserEditChange('phone', e.target.value)} />
                              : phone
                        }
                     </div>
                  </div>
                  <div className={styles.rightPart}>
                     <EditBtn
                        isEdit={isEditObj.phone}
                        onClick={() => saveNewData('phone')}
                     />
                  </div>
               </div>
               <hr className={styles.hr} />

            </div>

         </div>
      </div>
   );
};
