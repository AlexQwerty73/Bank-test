import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './userProfile.module.css';
import {
   useUpdateUserMutation,
   useGetAccountsByUserIdQuery,
   useGetCardsByUserIdQuery,
   useGetUserDepositsByUserIdQuery,
   useGetTransactionsByUserIdQuery,
} from '../../store';
import { formatDateTime } from '../../utils';

const AVATAR_COLORS = ['#4F46E5', '#0891B2', '#059669', '#D97706', '#DC2626', '#7C3AED'];
function avatarColor(name = '') {
   const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
   return AVATAR_COLORS[idx] ?? AVATAR_COLORS[0];
}

const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };
const CURRENCY_COLOR = { USD: '#059669', EUR: '#2563EB', UAH: '#D97706' };

/* ── Editable field row ──────────────────────────────── */
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

         <label className={styles.demoToggle}>
            <input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} />
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

/* ── Account summary ─────────────────────────────────── */
const AccountSummary = ({ userId }) => {
   const { data: accounts = [], isLoading: accLoad } = useGetAccountsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });
   const { data: cards    = [], isLoading: cardsLoad } = useGetCardsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });
   const { data: deposits = [] } = useGetUserDepositsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });
   const { data: txns     = [] } = useGetTransactionsByUserIdQuery(userId, { refetchOnMountOrArgChange: true });

   const isLoading = accLoad || cardsLoad;

   /* aggregate balance per currency */
   const balanceByCurrency = accounts.reduce((map, acc) => {
      map[acc.currency] = (map[acc.currency] || 0) + Number(acc.balance);
      return map;
   }, {});

   const activeDeposits = deposits.filter(d => d.status === 'active');
   const totalDeposited = activeDeposits.reduce((s, d) => s + Number(d.amount), 0);

   /* last 30-day stats */
   const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - 30);
   const recentTxns = txns.filter(t => new Date(t.date) >= cutoff);
   const monthlyOut = recentTxns.filter(t => t.direction === 'out').reduce((s, t) => s + Number(t.amount), 0);

   const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

   return (
      <div className={styles.card}>
         <h2 className={styles.cardTitle}>Financial overview</h2>

         {/* Quick stat chips */}
         <div className={styles.statGrid}>
            <div className={styles.statChip}>
               <span className={styles.statIcon}>🏦</span>
               <span className={styles.statNum}>{accounts.length}</span>
               <span className={styles.statLbl}>Accounts</span>
            </div>
            <div className={styles.statChip}>
               <span className={styles.statIcon}>💳</span>
               <span className={styles.statNum}>{cards.length}</span>
               <span className={styles.statLbl}>Cards</span>
            </div>
            <div className={styles.statChip}>
               <span className={styles.statIcon}>💰</span>
               <span className={styles.statNum}>{activeDeposits.length}</span>
               <span className={styles.statLbl}>Deposits</span>
            </div>
            <div className={styles.statChip}>
               <span className={styles.statIcon}>📊</span>
               <span className={styles.statNum}>{recentTxns.length}</span>
               <span className={styles.statLbl}>Txns (30d)</span>
            </div>
         </div>

         {/* Balance per currency */}
         {!isLoading && accounts.length > 0 && (
            <div className={styles.balanceList}>
               {Object.entries(balanceByCurrency).map(([cur, bal]) => (
                  <div key={cur} className={styles.balanceRow}>
                     <div className={styles.balanceCur}>
                        <span>{CURRENCY_FLAGS[cur] ?? '💱'}</span>
                        <span className={styles.balanceCurName}>{cur}</span>
                     </div>
                     <span
                        className={styles.balanceAmt}
                        style={{ color: CURRENCY_COLOR[cur] ?? '#4F46E5' }}
                     >
                        {fmt(bal)}
                     </span>
                  </div>
               ))}
               {activeDeposits.length > 0 && (
                  <div className={`${styles.balanceRow} ${styles.balanceDeposit}`}>
                     <div className={styles.balanceCur}>
                        <span>🔒</span>
                        <span className={styles.balanceCurName}>In deposits</span>
                     </div>
                     <span className={styles.balanceAmt} style={{ color: '#6B7280' }}>
                        ~{fmt(totalDeposited)}
                     </span>
                  </div>
               )}
            </div>
         )}

         {/* Monthly spend */}
         {monthlyOut > 0 && (
            <div className={styles.spendRow}>
               <span className={styles.spendLabel}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="13" height="13">
                     <path d="M14 8H2M8 2l6 6-6 6"/>
                  </svg>
                  Spent this month
               </span>
               <span className={styles.spendAmt}>−{fmt(monthlyOut)}</span>
            </div>
         )}

         {/* Quick nav links */}
         <div className={styles.quickLinks}>
            <Link to={`/${userId}/accounts`} className={styles.quickLink}>
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" width="16" height="16">
                  <rect x="2" y="4" width="16" height="13" rx="2"/><path d="M2 8h16"/>
               </svg>
               View accounts
            </Link>
            <Link to={`/${userId}/cards`} className={styles.quickLink}>
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" width="16" height="16">
                  <rect x="1" y="4" width="18" height="13" rx="2.5"/><path d="M1 9h18"/>
               </svg>
               My cards
            </Link>
            <Link to={`/${userId}/history`} className={styles.quickLink}>
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" width="16" height="16">
                  <circle cx="10" cy="10" r="8"/><path d="M10 6v4l3 2"/>
               </svg>
               History
            </Link>
            <Link to={`/${userId}/deposits`} className={styles.quickLink}>
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" width="16" height="16">
                  <path d="M10 3v14M5 14l5 3 5-3"/>
               </svg>
               Deposits
            </Link>
         </div>
      </div>
   );
};

/* ── Security card ───────────────────────────────────── */
const SecurityCard = ({ user, onSave }) => {
   const [mode,       setMode]       = useState('idle'); // idle | change
   const [oldPwd,     setOldPwd]     = useState('');
   const [newPwd,     setNewPwd]     = useState('');
   const [confirmPwd, setConfirmPwd] = useState('');
   const [showOld,    setShowOld]    = useState(false);
   const [showNew,    setShowNew]    = useState(false);
   const [err,        setErr]        = useState('');
   const [success,    setSuccess]    = useState(false);
   const [saving,     setSaving]     = useState(false);

   const [twoFAEnabled, setTwoFAEnabled] = useState(false); // demo only

   const handleChangePwd = async () => {
      setErr('');
      if (!oldPwd) { setErr('Please enter your current password.'); return; }
      if (newPwd.length < 6) { setErr('New password must be at least 6 characters.'); return; }
      if (newPwd !== confirmPwd) { setErr('Passwords do not match.'); return; }
      if (oldPwd !== user.password) { setErr('Current password is incorrect.'); return; }
      setSaving(true);
      await onSave({ password: newPwd });
      setSaving(false);
      setSuccess(true);
      setOldPwd(''); setNewPwd(''); setConfirmPwd('');
      setTimeout(() => { setSuccess(false); setMode('idle'); }, 2500);
   };

   const EyeBtn = ({ show, onToggle }) => (
      <button type="button" className={styles.eyeBtn} onClick={onToggle} tabIndex={-1}>
         {show
            ? <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="16" height="16"><path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z"/><circle cx="10" cy="10" r="3"/></svg>
            : <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="16" height="16"><path d="M2 2l16 16M7.5 7.5a3 3 0 0 0 4.2 4.2M4.2 4.2C2.5 5.6 1 8 1 10s3.5 7 9 7c1.8 0 3.4-.5 4.8-1.3M8 3.4C8.6 3.1 9.3 3 10 3c5.5 0 9 7 9 7a15.8 15.8 0 0 1-2.1 3"/></svg>
         }
      </button>
   );

   return (
      <div className={styles.card}>
         <h2 className={styles.cardTitle}>Security</h2>

         {/* Password row */}
         <div className={styles.secRow}>
            <div className={styles.secInfo}>
               <span className={styles.secIcon}>🔑</span>
               <div>
                  <p className={styles.secLabel}>Password</p>
                  <p className={styles.secSub}>Last changed: never</p>
               </div>
            </div>
            {mode === 'idle' && (
               <button className={styles.secBtn} onClick={() => setMode('change')}>
                  Change
               </button>
            )}
         </div>

         {/* Change password form */}
         {mode === 'change' && (
            <div className={styles.changePwdForm}>
               <div className={styles.pwdField}>
                  <label className={styles.pwdLabel}>Current password</label>
                  <div className={styles.pwdWrap}>
                     <input
                        className={styles.pwdInput}
                        type={showOld ? 'text' : 'password'}
                        value={oldPwd}
                        onChange={e => setOldPwd(e.target.value)}
                        placeholder="Enter current password"
                     />
                     <EyeBtn show={showOld} onToggle={() => setShowOld(v => !v)} />
                  </div>
               </div>
               <div className={styles.pwdField}>
                  <label className={styles.pwdLabel}>New password</label>
                  <div className={styles.pwdWrap}>
                     <input
                        className={styles.pwdInput}
                        type={showNew ? 'text' : 'password'}
                        value={newPwd}
                        onChange={e => setNewPwd(e.target.value)}
                        placeholder="Minimum 6 characters"
                     />
                     <EyeBtn show={showNew} onToggle={() => setShowNew(v => !v)} />
                  </div>
                  {newPwd && (
                     <div className={styles.pwdStrength}>
                        <div className={`${styles.pwdStrengthBar} ${
                           newPwd.length >= 10 ? styles.pwdStrong
                           : newPwd.length >= 6 ? styles.pwdMedium
                           : styles.pwdWeak
                        }`} />
                        <span className={styles.pwdStrengthLabel}>
                           {newPwd.length >= 10 ? 'Strong' : newPwd.length >= 6 ? 'Medium' : 'Weak'}
                        </span>
                     </div>
                  )}
               </div>
               <div className={styles.pwdField}>
                  <label className={styles.pwdLabel}>Confirm new password</label>
                  <div className={styles.pwdWrap}>
                     <input
                        className={`${styles.pwdInput} ${confirmPwd && confirmPwd !== newPwd ? styles.pwdMismatch : ''}`}
                        type="password"
                        value={confirmPwd}
                        onChange={e => setConfirmPwd(e.target.value)}
                        placeholder="Repeat new password"
                     />
                  </div>
               </div>
               {err && <p className={styles.pwdErr}>{err}</p>}
               {success && <p className={styles.pwdSuccess}>✓ Password changed successfully!</p>}
               <div className={styles.pwdActions}>
                  <button className={styles.pwdSaveBtn} onClick={handleChangePwd} disabled={saving}>
                     {saving ? 'Saving…' : 'Update password'}
                  </button>
                  <button className={styles.pwdCancelBtn} onClick={() => {
                     setMode('idle'); setOldPwd(''); setNewPwd(''); setConfirmPwd(''); setErr('');
                  }}>
                     Cancel
                  </button>
               </div>
            </div>
         )}

         {/* 2FA demo row */}
         <div className={styles.secRow}>
            <div className={styles.secInfo}>
               <span className={styles.secIcon}>📲</span>
               <div>
                  <p className={styles.secLabel}>Two-factor authentication</p>
                  <p className={styles.secSub}>{twoFAEnabled ? 'Enabled via authenticator app' : 'Not configured'}</p>
               </div>
            </div>
            <label className={styles.toggle}>
               <input type="checkbox" checked={twoFAEnabled} onChange={e => setTwoFAEnabled(e.target.checked)} />
               <span className={styles.toggleTrack}><span className={styles.toggleThumb}/></span>
            </label>
         </div>

         {/* Session row (demo) */}
         <div className={styles.secRow} style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className={styles.secInfo}>
               <span className={styles.secIcon}>📍</span>
               <div>
                  <p className={styles.secLabel}>Active sessions</p>
                  <p className={styles.secSub}>1 active session — this device</p>
               </div>
            </div>
            <button className={styles.secBtnDanger} onClick={() => {}}>
               Sign out all
            </button>
         </div>
      </div>
   );
};

/* ── Main component ──────────────────────────────────── */
export const UserProfile = ({ user }) => {
   const [updateUser] = useUpdateUserMutation();
   const [userData, setUserData] = useState(user ?? {});

   useEffect(() => { if (user) setUserData(user); }, [user]);

   if (!user) return <p className={styles.loading}>User data not found.</p>;

   const { name, surname, email, phone, address, createdAt, lastLogin, verified, id: userId } = userData;
   const initials = `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase();
   const color    = avatarColor(name);

   const save = (field) => (value) => {
      const updated = { ...userData, [field]: value };
      setUserData(updated);
      updateUser(updated).unwrap().catch(() => setUserData(userData));
   };

   const saveObj = async (fields) => {
      const updated = { ...userData, ...fields };
      setUserData(updated);
      await updateUser(updated).unwrap().catch(() => setUserData(userData));
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
            <div className={styles.headerText}>
               <h1 className={styles.fullName}>{name} {surname}</h1>
               <p className={styles.memberSince}>
                  Member since {new Date(createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
               </p>
               {verified && (
                  <span className={styles.verifiedBadge}>✓ Verified</span>
               )}
            </div>
            <Link to={`/${userId}/settings`} className={styles.settingsBtn} title="Settings">
               <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" width="18" height="18">
                  <circle cx="10" cy="10" r="3"/>
                  <path d="M10 1v2M10 17v2M1 10h2M17 10h2M3.2 3.2l1.4 1.4M15.4 15.4l1.4 1.4M3.2 16.8l1.4-1.4M15.4 4.6l1.4-1.4"/>
               </svg>
            </Link>
         </div>

         {/* ── Verification ── */}
         <VerificationCard verified={!!verified} onVerify={handleVerify} />

         {/* ── Financial overview ── */}
         {userId && <AccountSummary userId={userId} />}

         {/* ── Editable fields ── */}
         <div className={styles.card}>
            <h2 className={styles.cardTitle}>Contact information</h2>
            <Field icon="✉️" label="Email"   value={email}   onSave={save('email')}   />
            <Field icon="📞" label="Phone"   value={phone}   onSave={save('phone')}   />
            <Field icon="📍" label="Address" value={address} onSave={save('address')} />
         </div>

         {/* ── Security ── */}
         <SecurityCard user={userData} onSave={saveObj} />

         {/* ── Account activity ── */}
         <div className={styles.card}>
            <h2 className={styles.cardTitle}>Account activity</h2>
            <ReadField icon="🕐" label="Last login"       value={lastLogin  ? formatDateTime(lastLogin)  : '—'} />
            <ReadField icon="📅" label="Account created"  value={createdAt  ? formatDateTime(createdAt)  : '—'} />
            <ReadField icon="🆔" label="User ID"          value={userId} />
         </div>

      </div>
   );
};
