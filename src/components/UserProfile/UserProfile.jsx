import React, { useState, useEffect } from 'react';
import styles from './userProfile.module.css';
import { useUpdateUserMutation } from '../../store';
import { formatDateTime } from '../../utils';

const AVATAR_COLORS = ['#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626', '#7C3AED'];
function avatarColor(name = '') {
   const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
   return AVATAR_COLORS[idx] ?? AVATAR_COLORS[0];
}

/* ── Editable field row ─────────────────���───────────── */
const Field = ({ icon, label, value, onSave }) => {
   const [editing,   setEditing]   = useState(false);
   const [draft,     setDraft]     = useState(value ?? '');

   useEffect(() => { setDraft(value ?? ''); }, [value]);

   const commit = () => {
      if (draft.trim() !== value) onSave(draft.trim());
      setEditing(false);
   };
   const cancel = () => { setDraft(value ?? ''); setEditing(false); };

   return (
      <div className={styles.field}>
         <span className={styles.fieldIcon}>{icon}</span>
         <div className={styles.fieldBody}>
            <span className={styles.fieldLabel}>{label}</span>
            {editing ? (
               <input
                  className={styles.fieldInput}
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') cancel(); }}
                  autoFocus
               />
            ) : (
               <span className={styles.fieldValue}>{value || <span className={styles.fieldEmpty}>—</span>}</span>
            )}
         </div>
         {editing ? (
            <div className={styles.fieldActions}>
               <button className={styles.saveBtn} onClick={commit} title="Save">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="2 8 6 12 14 4"/></svg>
               </button>
               <button className={styles.cancelBtn} onClick={cancel} title="Cancel">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l12 12M14 2L2 14"/></svg>
               </button>
            </div>
         ) : (
            <button className={styles.editBtn} onClick={() => setEditing(true)} title="Edit">
               <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11.5 2.5a1.5 1.5 0 0 1 2 2L5 13l-3 1 1-3 8.5-8.5z"/></svg>
            </button>
         )}
      </div>
   );
};

/* ── Read-only row ───────────────────────────────────── */
const ReadField = ({ icon, label, value }) => (
   <div className={styles.field}>
      <span className={styles.fieldIcon}>{icon}</span>
      <div className={styles.fieldBody}>
         <span className={styles.fieldLabel}>{label}</span>
         <span className={styles.fieldValue}>{value || '—'}</span>
      </div>
   </div>
);

/* ── Verification card ───────────────────────────────── */
const VerificationCard = ({ verified, onVerify }) => {
   const [loading, setLoading] = useState(false);
   const [checked, setChecked] = useState(false);

   const handleVerify = async () => {
      if (!checked) return;
      setLoading(true);
      await onVerify();
      setLoading(false);
   };

   if (verified) {
      return (
         <div className={`${styles.card} ${styles.verifiedCard}`}>
            <div className={styles.verifiedHeader}>
               <span className={styles.verifiedBadge}>✓ Verified</span>
               <h2 className={styles.cardTitle}>Identity verification</h2>
            </div>
            <p className={styles.verifiedNote}>
               Your identity has been verified. You have full access to all banking features.
            </p>
         </div>
      );
   }

   return (
      <div className={`${styles.card} ${styles.unverifCard}`}>
         <div className={styles.unverifHeader}>
            <span className={styles.unverifBadge}>⚠ Unverified</span>
            <h2 className={styles.cardTitle}>Identity verification</h2>
         </div>
         <p className={styles.unverifNote}>
            To unlock transfers and currency exchange, you need to verify your identity.
            Please submit your documents.
         </p>

         <div className={styles.docList}>
            <div className={styles.docItem}><span>🪪</span> Government-issued ID</div>
            <div className={styles.docItem}><span>📋</span> Proof of address (utility bill)</div>
            <div className={styles.docItem}><span>🤳</span> Selfie with document</div>
         </div>

         {/* Demo toggle */}
         <label className={styles.demoToggle}>
            <input
               type="checkbox"
               checked={checked}
               onChange={e => setChecked(e.target.checked)}
            />
            <span className={styles.demoTrack}><span className={styles.demoThumb}/></span>
            <span className={styles.demoLabel}>
               I confirm I have submitted all required documents
               <span className={styles.demoBadge}>Demo</span>
            </span>
         </label>

         <button
            className={styles.verifyBtn}
            onClick={handleVerify}
            disabled={!checked || loading}
         >
            {loading ? 'Verifying…' : 'Complete verification'}
         </button>
      </div>
   );
};

/* ── Main component ──────────────────────────────────── */
export const UserProfile = ({ user }) => {
   const [updateUser] = useUpdateUserMutation();
   const [userData, setUserData] = useState(user ?? {});

   useEffect(() => { if (user) setUserData(user); }, [user]);

   if (!user) return <p className={styles.loading}>User data not found.</p>;

   const { name, surname, email, phone, address, createdAt, lastLogin, verified } = userData;
   const initials = `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase();
   const color    = avatarColor(name);

   const save = (field) => (value) => {
      const updated = { ...userData, [field]: value };
      setUserData(updated);
      updateUser(updated).unwrap().catch(() => setUserData(userData));
   };

   const handleVerify = async () => {
      const updated = { ...userData, verified: true };
      setUserData(updated);
      await updateUser(updated).unwrap().catch(() => setUserData(userData));
   };

   return (
      <div className={styles.wrap}>

         {/* ── Avatar + name header ── */}
         <div className={styles.header}>
            <div className={styles.avatar} style={{ background: color }}>
               {initials || '?'}
            </div>
            <div>
               <h1 className={styles.fullName}>{name} {surname}</h1>
               <p className={styles.memberSince}>
                  Member since {new Date(createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
               </p>
            </div>
         </div>

         {/* ── Verification ── */}
         <VerificationCard verified={!!verified} onVerify={handleVerify} />

         {/* ── Editable fields ── */}
         <div className={styles.card}>
            <h2 className={styles.cardTitle}>Contact information</h2>
            <Field
               icon="✉️"
               label="Email"
               value={email}
               onSave={save('email')}
            />
            <Field
               icon="📞"
               label="Phone"
               value={phone}
               onSave={save('phone')}
            />
            <Field
               icon="📍"
               label="Address"
               value={address}
               onSave={save('address')}
            />
         </div>

         {/* ── Account activity ── */}
         <div className={styles.card}>
            <h2 className={styles.cardTitle}>Account activity</h2>
            <ReadField
               icon="🕐"
               label="Last login"
               value={lastLogin ? formatDateTime(lastLogin) : '—'}
            />
            <ReadField
               icon="📅"
               label="Account created"
               value={createdAt ? formatDateTime(createdAt) : '—'}
            />
         </div>

      </div>
   );
};
