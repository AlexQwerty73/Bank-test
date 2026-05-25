import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { loadFromLocalStorage, formatDateTime } from '../../utils';
import { useGetTransactionsByUserIdQuery, useGetUsersQuery, useUpdateUserMutation } from '../../store';
import { useToast } from '../../context';
import styles from './settingsPage.module.css';

/* ── Storage helpers ─────────────────────────────────── */
const getSetting = (key, fallback) => {
   try { return JSON.parse(localStorage.getItem(`app_${key}`) ?? 'null') ?? fallback; }
   catch { return fallback; }
};
const setSetting = (key, val) => localStorage.setItem(`app_${key}`, JSON.stringify(val));

/* ── Nav sections ────────────────────────────────────── */
const NAV = [
   { id: 'appearance',    icon: '🎨', label: 'Appearance'     },
   { id: 'privacy',       icon: '🔒', label: 'Privacy'         },
   { id: 'security',      icon: '🛡️', label: 'Security'        },
   { id: 'notifications', icon: '🔔', label: 'Notifications'   },
   { id: 'regional',      icon: '🌐', label: 'Regional'        },
   { id: 'data',          icon: '💾', label: 'Data & Storage'  },
   { id: 'about',         icon: 'ℹ️', label: 'About'           },
   { id: 'roadmap',       icon: '🗺️', label: 'Roadmap'         },
];

/* ── Roadmap data — only pending/partial items ────────── */
const ROADMAP = [
   {
      section: 'Appearance',
      items: [
         {
            label: 'Dark mode',
            status: 'planned',
            complexity: 'hard',
            effort: '2–3 days',
            note: 'Requires adding CSS custom properties (--color-bg, --color-text, etc.) across all ~30 module files and a ThemeContext provider.',
         },
      ],
   },
   {
      section: 'Notifications',
      items: [
         {
            label: 'Transfer & payment alerts',
            status: 'planned',
            complexity: 'hard',
            effort: '2–4 days',
            note: 'Requires a backend WebSocket or SSE channel, a notification service, and browser Push API integration.',
         },
         {
            label: 'Deposit maturity alerts',
            status: 'planned',
            complexity: 'hard',
            effort: '2–3 days',
            note: 'Same backend infra as transfers. Additionally needs a cron job to check deposit maturity dates.',
         },
         {
            label: 'Security / login alerts',
            status: 'planned',
            complexity: 'hard',
            effort: '3–5 days',
            note: 'Needs device fingerprinting, session tracking on the server, and email/push delivery.',
         },
         {
            label: 'Promotions & offers',
            status: 'planned',
            complexity: 'medium',
            effort: '1–2 days',
            note: 'Simpler than others — static promo data can be served from JSON Server. Still needs a notification delivery channel.',
         },
      ],
   },
   {
      section: 'Regional',
      items: [
         {
            label: 'Language (i18n)',
            status: 'planned',
            complexity: 'hard',
            effort: '3–5 days',
            note: 'Need to integrate react-i18next, extract ~200+ hardcoded strings, create translation files (en, uk, de, fr, pl).',
         },
         {
            label: 'Currency converter',
            status: 'planned',
            complexity: 'medium',
            effort: '2–4h',
            note: 'Inline converter widget using live exchange rates from the existing ExchangeRate data. Needs a rate-fetch hook and a conversion formula UI.',
         },
      ],
   },
];

/* ── Sub-components ──────────────────────────────────── */
const Badge = ({ type = 'soon' }) => {
   const map = {
      soon:    { label: 'Coming soon',    cls: styles.badgeSoon    },
      partial: { label: 'Partial',        cls: styles.badgePartial },
      works:   { label: 'Active',         cls: styles.badgeWorks   },
   };
   const { label, cls } = map[type] ?? map.soon;
   return <span className={`${styles.badge} ${cls}`}>{label}</span>;
};

const WIPNote = ({ text }) => (
   <div className={styles.wipNote}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
         <circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5M8 10.5h.01"/>
      </svg>
      {text}
   </div>
);

const SectionBanner = ({ icon, text }) => (
   <div className={styles.sectionBanner}>
      <span className={styles.sectionBannerIcon}>{icon}</span>
      <p>{text}</p>
   </div>
);

const Divider = () => <div className={styles.divider} />;

/* Toggle row */
const ToggleRow = ({ icon, label, sub, value, onChange, disabled, badge, note }) => (
   <div className={`${styles.row} ${disabled ? styles.rowDisabled : ''}`}>
      <span className={styles.rowIcon}>{icon}</span>
      <div className={styles.rowBody}>
         <div className={styles.rowLabelLine}>
            <span className={styles.rowLabel}>{label}</span>
            {badge && <Badge type={badge} />}
         </div>
         {sub  && <p className={styles.rowSub}>{sub}</p>}
         {note && <WIPNote text={note} />}
      </div>
      <label className={`${styles.toggle} ${disabled ? styles.toggleDisabled : ''}`}>
         <input
            type="checkbox"
            checked={value}
            onChange={e => !disabled && onChange(e.target.checked)}
            disabled={disabled}
         />
         <span className={styles.toggleTrack}><span className={styles.toggleThumb} /></span>
      </label>
   </div>
);

/* Select row */
const SelectRow = ({ icon, label, sub, value, options, onChange, disabled, badge, note }) => (
   <div className={`${styles.row} ${disabled ? styles.rowDisabled : ''}`}>
      <span className={styles.rowIcon}>{icon}</span>
      <div className={styles.rowBody}>
         <div className={styles.rowLabelLine}>
            <span className={styles.rowLabel}>{label}</span>
            {badge && <Badge type={badge} />}
         </div>
         {sub  && <p className={styles.rowSub}>{sub}</p>}
         {note && <WIPNote text={note} />}
      </div>
      <div className={styles.selectWrap}>
         <select
            className={styles.select}
            value={value}
            onChange={e => !disabled && onChange(e.target.value)}
            disabled={disabled}
         >
            {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
         </select>
      </div>
   </div>
);

/* Action row */
const ActionRow = ({ icon, label, sub, btnLabel, onClick, danger, disabled, badge, note, last }) => (
   <div className={`${styles.row} ${last ? styles.rowLast : ''} ${disabled ? styles.rowDisabled : ''}`}>
      <span className={styles.rowIcon}>{icon}</span>
      <div className={styles.rowBody}>
         <div className={styles.rowLabelLine}>
            <span className={`${styles.rowLabel} ${danger ? styles.rowLabelDanger : ''}`}>{label}</span>
            {badge && <Badge type={badge} />}
         </div>
         {sub  && <p className={styles.rowSub}>{sub}</p>}
         {note && <WIPNote text={note} />}
      </div>
      <button
         className={danger ? styles.btnDanger : styles.btn}
         onClick={onClick}
         disabled={disabled}
      >
         {btnLabel}
      </button>
   </div>
);

/* ════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════ */
export const SettingsPage = () => {
   const { userId }      = useParams();
   const localStorUserId = loadFromLocalStorage('userId');
   const toast           = useToast();

   /* ── Transactions data (for CSV export) ── */
   const { data: txData = [] } = useGetTransactionsByUserIdQuery(userId, { skip: !userId });

   /* ── User data (for password change) ── */
   const { data: userData }    = useGetUsersQuery(userId, { skip: !userId });
   const [updateUser]          = useUpdateUserMutation();

   /* ── Settings state ── */
   const [darkMode,       setDarkMode]       = useState(() => getSetting('darkMode', false));
   const [compactLayout,  setCompactLayout]  = useState(() => getSetting('compactLayout', false));
   const [reducedMotion,  setReducedMotion]  = useState(() => getSetting('reducedMotion', false));
   const [hideBalances,   setHideBalances]   = useState(() => getSetting('hideBalances', false));
   const [hideCardNums,   setHideCardNums]   = useState(() => getSetting('hideCardNums', true));
   const [notifyTransfer, setNotifyTransfer] = useState(() => getSetting('notifyTransfer', true));
   const [notifyDeposit,  setNotifyDeposit]  = useState(() => getSetting('notifyDeposit', true));
   const [notifyLogin,    setNotifyLogin]    = useState(() => getSetting('notifyLogin', true));
   const [notifyPromo,    setNotifyPromo]    = useState(() => getSetting('notifyPromo', false));
   const [language,       setLanguage]       = useState(() => getSetting('language', 'en'));
   const [currency,       setCurrency]       = useState(() => getSetting('currency', 'UAH'));
   const [dateFormat,     setDateFormat]     = useState(() => getSetting('dateFormat', 'DMY'));

   /* ── UI state ── */
   const [activeSection, setActiveSection] = useState('appearance');
   const [savedKey,      setSavedKey]      = useState(null);
   const [exportDone,    setExportDone]    = useState(false);

   /* ── Security — change password ── */
   const [curPwd,     setCurPwd]     = useState('');
   const [newPwd,     setNewPwd]     = useState('');
   const [confPwd,    setConfPwd]    = useState('');
   const [pwdErr,     setPwdErr]     = useState('');
   const [pwdLoading, setPwdLoading] = useState(false);
   const [showCurPwd, setShowCurPwd] = useState(false);
   const [showNewPwd, setShowNewPwd] = useState(false);

   /* Reduced motion: CSS var + body class (live preview) */
   useEffect(() => {
      document.documentElement.style.setProperty('--motion-duration', reducedMotion ? '0.01s' : '');
      document.body.classList.toggle('reduce-motion', reducedMotion);
   }, [reducedMotion]);

   /* Compact layout: body class (live preview) */
   useEffect(() => {
      document.body.classList.toggle('compact-mode', compactLayout);
   }, [compactLayout]);

   /* ── All hooks above — redirect below ── */
   if (userId !== localStorUserId) {
      return <Navigate to={`/${localStorUserId}/settings`} replace />;
   }

   const persist = (key, setter) => (val) => {
      setter(val);
      setSetting(key, val);
      setSavedKey(key);
      setTimeout(() => setSavedKey(k => k === key ? null : k), 2000);
   };

   const handleClearCache = () => {
      Object.keys(localStorage)
         .filter(k => k.startsWith('app_'))
         .forEach(k => localStorage.removeItem(k));
      window.location.reload();
   };

   const handleExport = () => {
      if (!txData.length) return;

      const escape = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
      const header = ['Date', 'Type', 'Direction', 'Amount', 'Currency', 'Description', 'Counterparty'].join(',');
      const rows   = txData.map(tx => [
         escape(formatDateTime(tx.date)),
         tx.type      ?? '',
         tx.direction ?? '',
         Number(tx.amount).toFixed(2),
         tx.currency  ?? '',
         escape(tx.description),
         escape(tx.counterName),
      ].join(','));

      /* BOM (﻿) makes Excel open UTF-8 correctly */
      const csv  = '﻿' + [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `bankify-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
   };

   /* ── Section content ── */
   const renderSection = () => {
      switch (activeSection) {

         /* ──────────────────── APPEARANCE ──────────────────── */
         case 'appearance': return (
            <div className={styles.sectionContent}>
               <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Appearance</h2>
                  <p className={styles.sectionDesc}>
                     Control how the app looks and feels.
                  </p>
               </div>

               <ToggleRow
                  icon="🌙" label="Dark mode"
                  sub="Switch the entire interface to a dark theme"
                  value={darkMode}
                  onChange={persist('darkMode', setDarkMode)}
                  disabled
                  badge="soon"
                  note="Dark theme CSS is not implemented yet. Your preference is saved."
               />
               <ToggleRow
                  icon="📐" label="Compact layout"
                  sub="Reduce spacing in lists and cards for a denser view"
                  value={compactLayout}
                  onChange={persist('compactLayout', setCompactLayout)}
               />
               <ToggleRow
                  icon="✨" label="Reduce motion"
                  sub="Disable animations and shorten transitions across the app"
                  value={reducedMotion}
                  onChange={persist('reducedMotion', setReducedMotion)}
               />
            </div>
         );

         /* ──────────────────── PRIVACY ──────────────────── */
         case 'privacy': return (
            <div className={styles.sectionContent}>
               <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Privacy</h2>
                  <p className={styles.sectionDesc}>
                     Control what information is visible on screen.
                  </p>
               </div>

               <ToggleRow
                  icon="👁" label="Hide account balances"
                  sub="Replace balance amounts with •••• on account, card and transaction pages"
                  value={hideBalances}
                  onChange={persist('hideBalances', setHideBalances)}
               />
               <ToggleRow
                  icon="💳" label="Mask card numbers"
                  sub="Show only last 4 digits on cards and in the card detail page"
                  value={hideCardNums}
                  onChange={persist('hideCardNums', setHideCardNums)}
               />
            </div>
         );

         /* ──────────────────── SECURITY ──────────────────── */
         case 'security': {
            /* Password strength */
            const strength = (() => {
               if (!newPwd) return 0;
               let s = 0;
               if (newPwd.length >= 8)              s++;
               if (/[A-Z]/.test(newPwd))            s++;
               if (/[0-9]/.test(newPwd))            s++;
               if (/[^A-Za-z0-9]/.test(newPwd))     s++;
               return s;
            })();
            const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
            const strengthCls   = [
               '', styles.strengthWeak, styles.strengthFair,
               styles.strengthGood, styles.strengthStrong,
            ][strength];

            const handleChangePwd = async (e) => {
               e.preventDefault();
               setPwdErr('');
               const user = userData;
               if (!user) { setPwdErr('Could not load your account. Try again.'); return; }
               if (curPwd !== user.password) { setPwdErr('Current password is incorrect.'); return; }
               if (newPwd.length < 6)        { setPwdErr('New password must be at least 6 characters.'); return; }
               if (newPwd !== confPwd)        { setPwdErr('Passwords do not match.'); return; }
               if (newPwd === curPwd)         { setPwdErr('New password must differ from current password.'); return; }
               setPwdLoading(true);
               try {
                  await updateUser({ ...user, password: newPwd }).unwrap();
                  toast.success('🔐 Password changed successfully');
                  setCurPwd(''); setNewPwd(''); setConfPwd('');
               } catch {
                  setPwdErr('Failed to update password. Please try again.');
                  toast.error('Password change failed');
               } finally {
                  setPwdLoading(false);
               }
            };

            return (
               <div className={styles.sectionContent}>
                  <div className={styles.sectionHead}>
                     <h2 className={styles.sectionTitle}>Security</h2>
                     <p className={styles.sectionDesc}>
                        Manage your login credentials and account security.
                     </p>
                  </div>

                  <form className={styles.pwdForm} onSubmit={handleChangePwd} autoComplete="off">
                     <h3 className={styles.pwdFormTitle}>Change password</h3>

                     {/* Current password */}
                     <div className={styles.pwdField}>
                        <label className={styles.pwdLabel}>Current password</label>
                        <div className={styles.pwdInputWrap}>
                           <input
                              className={styles.pwdInput}
                              type={showCurPwd ? 'text' : 'password'}
                              value={curPwd}
                              onChange={e => { setCurPwd(e.target.value); setPwdErr(''); }}
                              placeholder="Enter current password"
                              autoComplete="current-password"
                           />
                           <button type="button" className={styles.pwdEye}
                              onClick={() => setShowCurPwd(v => !v)}>
                              {showCurPwd ? '🙈' : '👁'}
                           </button>
                        </div>
                     </div>

                     {/* New password */}
                     <div className={styles.pwdField}>
                        <label className={styles.pwdLabel}>New password</label>
                        <div className={styles.pwdInputWrap}>
                           <input
                              className={styles.pwdInput}
                              type={showNewPwd ? 'text' : 'password'}
                              value={newPwd}
                              onChange={e => { setNewPwd(e.target.value); setPwdErr(''); }}
                              placeholder="Minimum 6 characters"
                              autoComplete="new-password"
                           />
                           <button type="button" className={styles.pwdEye}
                              onClick={() => setShowNewPwd(v => !v)}>
                              {showNewPwd ? '🙈' : '👁'}
                           </button>
                        </div>
                        {/* Strength meter */}
                        {newPwd.length > 0 && (
                           <div className={styles.strength}>
                              <div className={styles.strengthBars}>
                                 {[1,2,3,4].map(n => (
                                    <div
                                       key={n}
                                       className={`${styles.strengthBar} ${n <= strength ? strengthCls : ''}`}
                                    />
                                 ))}
                              </div>
                              <span className={`${styles.strengthLabel} ${strengthCls}`}>{strengthLabel}</span>
                           </div>
                        )}
                     </div>

                     {/* Confirm password */}
                     <div className={styles.pwdField}>
                        <label className={styles.pwdLabel}>Confirm new password</label>
                        <div className={styles.pwdInputWrap}>
                           <input
                              className={styles.pwdInput}
                              type="password"
                              value={confPwd}
                              onChange={e => { setConfPwd(e.target.value); setPwdErr(''); }}
                              placeholder="Repeat new password"
                              autoComplete="new-password"
                           />
                           {confPwd && newPwd && (
                              <span className={styles.pwdMatch}>
                                 {confPwd === newPwd ? '✓' : '✕'}
                              </span>
                           )}
                        </div>
                     </div>

                     {pwdErr && <p className={styles.pwdErr}>{pwdErr}</p>}

                     <button
                        type="submit"
                        className={styles.pwdSubmit}
                        disabled={pwdLoading || !curPwd || !newPwd || !confPwd}
                     >
                        {pwdLoading ? 'Saving…' : 'Change password'}
                     </button>
                  </form>

                  <div className={styles.pwdHint}>
                     <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                        <circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5M8 10.5h.01"/>
                     </svg>
                     <p>
                        This is a demo app — passwords are stored in plain text in the JSON Server.
                        Do not use a real password here.
                     </p>
                  </div>
               </div>
            );
         }

         /* ──────────────────── NOTIFICATIONS ──────────────────── */
         case 'notifications': return (
            <div className={styles.sectionContent}>
               <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Notifications</h2>
                  <p className={styles.sectionDesc}>
                     Choose what events you want to be notified about.
                  </p>
               </div>

               <SectionBanner
                  icon="🚧"
                  text="Push notifications require a backend notification service. All toggles below save your preferences but are not active yet."
               />

               <ToggleRow
                  icon="💸" label="Transfers & payments"
                  sub="Alert on every sent or received transfer"
                  value={notifyTransfer}
                  onChange={persist('notifyTransfer', setNotifyTransfer)}
                  disabled badge="soon"
               />
               <ToggleRow
                  icon="🏦" label="Deposits"
                  sub="Maturity reminders and interest accrual alerts"
                  value={notifyDeposit}
                  onChange={persist('notifyDeposit', setNotifyDeposit)}
                  disabled badge="soon"
               />
               <ToggleRow
                  icon="🔐" label="Security alerts"
                  sub="Notify when a new device logs in to your account"
                  value={notifyLogin}
                  onChange={persist('notifyLogin', setNotifyLogin)}
                  disabled badge="soon"
               />
               <ToggleRow
                  icon="🎁" label="Promotions & offers"
                  sub="Special deals, cashback and partner discounts"
                  value={notifyPromo}
                  onChange={persist('notifyPromo', setNotifyPromo)}
                  disabled badge="soon"
               />
            </div>
         );

         /* ──────────────────── REGIONAL ──────────────────── */
         case 'regional': return (
            <div className={styles.sectionContent}>
               <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Regional</h2>
                  <p className={styles.sectionDesc}>
                     Language, currency and date display preferences.
                  </p>
               </div>

               <SelectRow
                  icon="🌐" label="Language"
                  sub="Interface language"
                  value={language}
                  options={[['en','English'],['uk','Українська'],['de','Deutsch'],['fr','Français'],['pl','Polski']]}
                  onChange={persist('language', setLanguage)}
                  disabled badge="soon"
                  note="Multi-language support is not implemented. The app is English-only for now."
               />
               <SelectRow
                  icon="💱" label="Default currency"
                  sub="Pre-selects currency in the deposit calculator"
                  value={currency}
                  options={[['UAH','🇺🇦 UAH — Ukrainian hryvnia'],['USD','🇺🇸 USD — US dollar'],['EUR','🇪🇺 EUR — Euro']]}
                  onChange={persist('currency', setCurrency)}
               />
               <SelectRow
                  icon="📅" label="Date format"
                  sub="How dates appear across the app"
                  value={dateFormat}
                  options={[['DMY','DD/MM/YYYY — 24/05/2026'],['MDY','MM/DD/YYYY — 05/24/2026'],['YMD','YYYY-MM-DD — 2026-05-24']]}
                  onChange={persist('dateFormat', setDateFormat)}
               />
            </div>
         );

         /* ──────────────────── DATA ──────────────────── */
         case 'data': return (
            <div className={styles.sectionContent}>
               <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>Data & Storage</h2>
                  <p className={styles.sectionDesc}>
                     Export your data or clear locally stored preferences.
                  </p>
               </div>

               <ActionRow
                  icon="📦" label="Export my data"
                  sub={txData.length ? `Download ${txData.length} transactions as CSV` : 'No transactions to export'}
                  btnLabel={exportDone ? '✓ Downloaded' : 'Export CSV'}
                  onClick={handleExport}
                  disabled={!txData.length}
               />

               <Divider />

               <ActionRow
                  icon="🗑" label="Clear local cache"
                  sub="Removes saved filters, UI state and app preferences from this browser"
                  btnLabel="Clear"
                  onClick={handleClearCache}
                  danger
                  last
               />

               <div className={styles.dataInfo}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                     <circle cx="8" cy="8" r="6.5"/><path d="M8 5v3.5M8 10.5h.01"/>
                  </svg>
                  <p>
                     "Clear local cache" only removes app preferences stored in your browser.
                     Your accounts, cards and transactions are stored on the server and will not be affected.
                  </p>
               </div>
            </div>
         );

         /* ──────────────────── ABOUT ──────────────────── */
         case 'about': return (
            <div className={styles.sectionContent}>
               <div className={styles.sectionHead}>
                  <h2 className={styles.sectionTitle}>About</h2>
               </div>

               <div className={styles.aboutApp}>
                  <div className={styles.aboutLogo}>🏦</div>
                  <div className={styles.aboutAppInfo}>
                     <p className={styles.aboutAppName}>Bank App</p>
                     <p className={styles.aboutAppVersion}>Version 1.0.0 · Demo build</p>
                     <p className={styles.aboutAppStack}>React 18 · RTK Query · JSON Server</p>
                  </div>
               </div>

               <Divider />

               <div className={styles.aboutLinks}>
                  {[
                     { icon: '🆘', label: 'Help & Support',   sub: 'Guides, FAQs and contact support', to: '/help',    badge: null  },
                     { icon: '📄', label: 'Privacy Policy',   sub: 'How we handle your data',          to: '/privacy', badge: null  },
                     { icon: '📋', label: 'Terms of Service', sub: 'Rules and conditions of use',      to: '/terms',   badge: null  },
                     { icon: '🐛', label: 'Report a bug',     sub: 'Something broken? Let us know',    to: null,       badge: 'soon'},
                  ].map(({ icon, label, sub, to, badge: b }) => (
                     <Link
                        key={label}
                        to={to ?? '#'}
                        className={styles.aboutLinkRow}
                        style={!to ? { pointerEvents: 'none', opacity: 0.6 } : {}}
                     >
                        <span className={styles.rowIcon}>{icon}</span>
                        <div className={styles.rowBody}>
                           <div className={styles.rowLabelLine}>
                              <span className={styles.rowLabel}>{label}</span>
                              {b && <Badge type={b} />}
                           </div>
                           <p className={styles.rowSub}>{sub}</p>
                        </div>
                        <svg className={styles.chevron} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                           <path d="M8 5l5 5-5 5"/>
                        </svg>
                     </Link>
                  ))}
               </div>

               <Divider />

               <div className={styles.aboutFooter}>
                  <p>Made with ❤️ as a demo banking project.</p>
                  <p>All data is local — no real transactions occur.</p>
               </div>
            </div>
         );

         /* ──────────────────── ROADMAP ──────────────────── */
         case 'roadmap': {
            const STATUS_CFG = {
               partial: { label: 'Partial', cls: styles.rdStatusPartial },
               planned: { label: 'Planned', cls: styles.rdStatusPlanned },
            };
            const COMPLEXITY_CFG = {
               easy:   { label: 'Easy',   cls: styles.rdEasy,   bar: 1 },
               medium: { label: 'Medium', cls: styles.rdMedium, bar: 2 },
               hard:   { label: 'Hard',   cls: styles.rdHard,   bar: 3 },
            };

            const totalItems   = ROADMAP.reduce((s, g) => s + g.items.length, 0);
            const mediumCount  = ROADMAP.reduce((s, g) => s + g.items.filter(i => i.complexity === 'medium').length, 0);
            const hardCount    = ROADMAP.reduce((s, g) => s + g.items.filter(i => i.complexity === 'hard').length, 0);

            return (
               <div className={styles.sectionContent}>
                  <div className={styles.sectionHead}>
                     <h2 className={styles.sectionTitle}>Implementation Roadmap</h2>
                     <p className={styles.sectionDesc}>
                        Pending features ranked by complexity and effort.
                     </p>
                  </div>

                  {/* Summary strip */}
                  <div className={styles.rdSummary}>
                     <div className={styles.rdSummaryItem}>
                        <span className={styles.rdSummaryNum}>{totalItems}</span>
                        <span className={styles.rdSummaryLabel}>Pending</span>
                     </div>
                     <div className={styles.rdSummarySep} />
                     <div className={`${styles.rdSummaryItem} ${styles.rdSummaryMedium}`}>
                        <span className={styles.rdSummaryNum}>{mediumCount}</span>
                        <span className={styles.rdSummaryLabel}>Medium</span>
                     </div>
                     <div className={styles.rdSummarySep} />
                     <div className={`${styles.rdSummaryItem} ${styles.rdSummaryHard}`}>
                        <span className={styles.rdSummaryNum}>{hardCount}</span>
                        <span className={styles.rdSummaryLabel}>Hard</span>
                     </div>
                  </div>

                  {/* Groups */}
                  {ROADMAP.map(group => (
                     <div key={group.section} className={styles.rdGroup}>
                        <div className={styles.rdGroupLabel}>{group.section}</div>
                        {group.items.map(item => {
                           const sc = STATUS_CFG[item.status]     ?? STATUS_CFG.planned;
                           const cc = COMPLEXITY_CFG[item.complexity] ?? COMPLEXITY_CFG.medium;
                           return (
                              <div key={item.label} className={styles.rdItem}>
                                 <div className={styles.rdItemTop}>
                                    <span className={styles.rdItemLabel}>{item.label}</span>
                                    <div className={styles.rdItemBadges}>
                                       <span className={`${styles.rdStatus} ${sc.cls}`}>{sc.label}</span>
                                       <span className={`${styles.rdComplexity} ${cc.cls}`}>
                                          {/* Difficulty bars */}
                                          <span className={styles.rdBars}>
                                             {[1,2,3].map(n => (
                                                <span
                                                   key={n}
                                                   className={`${styles.rdBar} ${n <= cc.bar ? styles.rdBarFilled : ''}`}
                                                />
                                             ))}
                                          </span>
                                          {cc.label}
                                       </span>
                                       <span className={styles.rdEffort}>⏱ {item.effort}</span>
                                    </div>
                                 </div>
                                 <p className={styles.rdItemNote}>{item.note}</p>
                              </div>
                           );
                        })}
                     </div>
                  ))}

               </div>
            );
         }

         default: return null;
      }
   };

   return (
      <div className={styles.page}>
         <div className="container">

            {/* ── Page header ── */}
            <div className={styles.pageHead}>
               <div className={styles.headLeft}>
                  <Link to={`/${userId}/profile`} className={styles.backBtn}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="16" height="16">
                        <path d="M13 17L7 10l6-7"/>
                     </svg>
                  </Link>
                  <div>
                     <h1 className={styles.pageTitle}>Settings</h1>
                     <p className={styles.pageSub}>Manage your preferences</p>
                  </div>
               </div>
               <div className={`${styles.savedToast} ${savedKey ? styles.savedToastVisible : ''}`}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                     <polyline points="2 8 6 12 14 4"/>
                  </svg>
                  Saved
               </div>
            </div>

            {/* ── Body: sidebar + content ── */}
            <div className={styles.body}>

               {/* Sidebar nav */}
               <nav className={styles.sidebar}>
                  {NAV.map(({ id, icon, label }) => (
                     <button
                        key={id}
                        className={`${styles.navItem} ${activeSection === id ? styles.navActive : ''}`}
                        onClick={() => setActiveSection(id)}
                     >
                        <span className={styles.navIcon}>{icon}</span>
                        <span className={styles.navLabel}>{label}</span>
                        <svg className={styles.navChevron} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                           <path d="M8 5l5 5-5 5"/>
                        </svg>
                     </button>
                  ))}
               </nav>

               {/* Content pane */}
               <div className={styles.contentPane}>
                  {renderSection()}
               </div>

            </div>
         </div>
      </div>
   );
};
