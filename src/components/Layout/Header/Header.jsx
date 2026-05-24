import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { loadFromLocalStorage, removeKeyFromLocalStorage } from '../../../utils';
import styles from './header.module.css';

/* ── Nav icons ── */
const IconCards = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="16" height="11" rx="2"/><path d="M2 9h16"/>
   </svg>
);
const IconAccounts = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="5" rx="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5"/>
   </svg>
);
const IconHistory = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h10M5 6h6M5 14h8"/><path d="M13 8l2 2-2 2"/>
   </svg>
);
const IconExchange = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7h14M3 7l3-3M3 7l3 3M17 13H3M17 13l-3-3M17 13l-3 3"/>
   </svg>
);
const IconProfile = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="3"/><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
   </svg>
);
const IconLogout = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3h4v14h-4M8 14l4-4-4-4M12 10H4"/>
   </svg>
);

export const Header = () => {
   const userId     = loadFromLocalStorage('userId');
   const location   = useLocation();
   const navigate   = useNavigate();
   const isHome     = location.pathname === '/';

   const [menuOpen,    setMenuOpen]    = useState(false);
   const [profileOpen, setProfileOpen] = useState(false);
   const profileRef = useRef(null);

   /* close profile dropdown on outside click */
   useEffect(() => {
      const handler = (e) => {
         if (profileRef.current && !profileRef.current.contains(e.target)) {
            setProfileOpen(false);
         }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
   }, []);

   /* close mobile menu on route change */
   useEffect(() => { setMenuOpen(false); }, [location.pathname]);

   const handleLogout = () => {
      removeKeyFromLocalStorage('userId');
      setMenuOpen(false);
      setProfileOpen(false);
      navigate('/login');
   };

   const navCls = ({ isActive }) =>
      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`;

   return (
      <header className={`${styles.header} ${isHome ? styles.transparent : ''}`}>
         <div className="container">
            <div className={styles.bar}>

               {/* ── Logo ── */}
               <Link to="/" className={styles.logo}>
                  <span className={styles.logoMark}>◈</span>
                  <span className={styles.logoName}>Bankify</span>
               </Link>

               {/* ── Centre nav (desktop) ── */}
               {userId && (
                  <nav className={styles.centreNav}>
                     <NavLink to={`/${userId}/cards`}        className={navCls}>
                        <IconCards /><span>Cards</span>
                     </NavLink>
                     <NavLink to={`/${userId}/transactions`} className={navCls}>
                        <IconAccounts /><span>Accounts</span>
                     </NavLink>
                     <NavLink to={`/${userId}/history`}      className={navCls}>
                        <IconHistory /><span>History</span>
                     </NavLink>
                     <NavLink to="/exchange-rate"            className={navCls}>
                        <IconExchange /><span>Exchange</span>
                     </NavLink>
                  </nav>
               )}

               {/* ── Right side ── */}
               <div className={styles.rightSide}>
                  {userId ? (
                     /* Profile dropdown */
                     <div className={styles.profileWrap} ref={profileRef}>
                        <button
                           className={`${styles.avatarBtn} ${profileOpen ? styles.avatarBtnOpen : ''}`}
                           onClick={() => setProfileOpen(o => !o)}
                           aria-label="Profile menu"
                        >
                           <span className={styles.avatarCircle}>
                              {userId[0]?.toUpperCase()}
                           </span>
                           <svg className={`${styles.chevron} ${profileOpen ? styles.chevronUp : ''}`}
                              viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M4 6l4 4 4-4"/>
                           </svg>
                        </button>

                        {profileOpen && (
                           <div className={styles.dropdown}>
                              <div className={styles.dropdownHeader}>
                                 <span className={styles.dropdownUserId}>{userId}</span>
                              </div>
                              <NavLink
                                 to={`/${userId}/profile`}
                                 className={styles.dropdownItem}
                                 onClick={() => setProfileOpen(false)}
                              >
                                 <IconProfile /> Profile
                              </NavLink>
                              <div className={styles.dropdownDivider} />
                              <button className={`${styles.dropdownItem} ${styles.dropdownLogout}`} onClick={handleLogout}>
                                 <IconLogout /> Log out
                              </button>
                           </div>
                        )}
                     </div>
                  ) : (
                     <Link to="/login" className={styles.loginBtn}>Log in</Link>
                  )}

                  {/* Mobile burger */}
                  <button
                     className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
                     onClick={() => setMenuOpen(o => !o)}
                     aria-label="Toggle menu"
                  >
                     <span /><span /><span />
                  </button>
               </div>

            </div>
         </div>

         {/* ── Mobile drawer ── */}
         {menuOpen && (
            <div className={styles.drawer}>
               {userId ? (
                  <>
                     <NavLink to={`/${userId}/cards`}        className={styles.drawerLink}><IconCards />Cards</NavLink>
                     <NavLink to={`/${userId}/transactions`} className={styles.drawerLink}><IconAccounts />Accounts</NavLink>
                     <NavLink to={`/${userId}/history`}      className={styles.drawerLink}><IconHistory />History</NavLink>
                     <NavLink to="/exchange-rate"            className={styles.drawerLink}><IconExchange />Exchange</NavLink>
                     <NavLink to={`/${userId}/profile`}      className={styles.drawerLink}><IconProfile />Profile</NavLink>
                     <button className={styles.drawerLogout} onClick={handleLogout}><IconLogout />Log out</button>
                  </>
               ) : (
                  <NavLink to="/login" className={styles.drawerLink}>Log in</NavLink>
               )}
            </div>
         )}
      </header>
   );
};
