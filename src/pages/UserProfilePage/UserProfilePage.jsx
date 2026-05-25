import React from 'react';
import { UserProfile } from '../../components';
import { useParams } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';
import { useGetUsersQuery } from '../../store';
import styles from './userProfilePage.module.css';

/* ── Skeleton ── */
const ProfileSkeleton = () => (
   <div className={styles.userProfile}>
      <div className="container">
         <div className={styles.skCard}>

            {/* Avatar + name */}
            <div className={styles.skTop}>
               <div className={`${styles.sk} ${styles.skAvatar}`} />
               <div className={styles.skTopText}>
                  <div className={`${styles.sk} ${styles.skName}`} />
                  <div className={`${styles.sk} ${styles.skBadge}`} />
               </div>
            </div>

            {/* Field rows */}
            <div className={styles.skFields}>
               {[...Array(5)].map((_, i) => (
                  <div key={i} className={styles.skRow}>
                     <div className={`${styles.sk} ${styles.skRowIcon}`} />
                     <div className={styles.skRowBody}>
                        <div className={`${styles.sk} ${styles.skRowLabel}`} />
                        <div className={`${styles.sk} ${styles.skRowValue}`}
                             style={{ width: [160, 200, 140, 180, 120][i] }} />
                     </div>
                  </div>
               ))}
            </div>

            {/* Stats */}
            <div className={styles.skStats}>
               {[...Array(4)].map((_, i) => (
                  <div key={i} className={`${styles.sk} ${styles.skStat}`} />
               ))}
            </div>

         </div>
      </div>
   </div>
);

/* ── Error state ── */
const ProfileError = ({ onRetry }) => (
   <div className={styles.userProfile}>
      <div className="container">
         <div className={styles.errorWrap}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Failed to load profile</h2>
            <p className={styles.errorDesc}>
               Could not fetch your profile data.<br />
               Check your connection and try again.
            </p>
            <button className={styles.errorBtn} onClick={onRetry}>Retry</button>
         </div>
      </div>
   </div>
);

/* ── Page ── */
export const UserProfilePage = () => {
   const { userId }  = useParams();
   const localUserId = loadFromLocalStorage('userId');
   const id = userId === localUserId ? localUserId : '';

   const { data: userData, isLoading, error, refetch } = useGetUsersQuery(id);

   if (isLoading) return <ProfileSkeleton />;
   if (error)     return <ProfileError onRetry={refetch} />;

   return (
      <div className={styles.userProfile}>
         <div className="container">
            <UserProfile user={userData} />
         </div>
      </div>
   );
};
