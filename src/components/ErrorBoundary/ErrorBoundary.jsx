import React from 'react';
import styles from './errorBoundary.module.css';

export class ErrorBoundary extends React.Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false, error: null, showDetails: false };
   }

   static getDerivedStateFromError(error) {
      return { hasError: true, error };
   }

   componentDidCatch(error, info) {
      console.error('[ErrorBoundary] Uncaught error:', error, info.componentStack);
   }

   handleReload = () => {
      window.location.reload();
   };

   handleHome = () => {
      window.location.href = '/';
   };

   render() {
      if (!this.state.hasError) return this.props.children;

      const { error, showDetails } = this.state;

      return (
         <div className={styles.page}>
            <div className={styles.card}>

               {/* Illustration */}
               <div className={styles.illustration}>
                  <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                     <circle cx="60" cy="60" r="52" fill="#FEF2F2"/>
                     {/* Gear body */}
                     <path d="M60 38a22 22 0 1 1 0 44 22 22 0 0 1 0-44z" fill="#fff" stroke="#FECACA" strokeWidth="2.5"/>
                     {/* Gear teeth */}
                     <path d="M60 28v-6M60 98v-6M30.1 40.1l-4.2-4.2M94.1 84.1l-4.2-4.2M20 60h-6M106 60h-6M30.1 79.9l-4.2 4.2M94.1 35.9l-4.2 4.2"
                        stroke="#FECACA" strokeWidth="5" strokeLinecap="round"/>
                     {/* X in center */}
                     <path d="M52 52l16 16M68 52L52 68" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round"/>
                  </svg>
               </div>

               <h1 className={styles.title}>Something went wrong</h1>
               <p className={styles.desc}>
                  An unexpected error occurred. Try refreshing the page —<br/>
                  if the problem persists, clear your browser cache.
               </p>

               <div className={styles.actions}>
                  <button className={styles.reloadBtn} onClick={this.handleReload}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4v5h5M16 16v-5h-5"/>
                        <path d="M3.5 9a7 7 0 1 1 .5 5.5"/>
                     </svg>
                     Reload page
                  </button>
                  <button className={styles.homeBtn} onClick={this.handleHome}>
                     <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9.5L10 3l7 6.5V17a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
                        <path d="M7 18v-7h6v7"/>
                     </svg>
                     Go home
                  </button>
               </div>

               {/* Collapsible error details for devs */}
               {error && (
                  <div className={styles.detailsWrap}>
                     <button
                        className={styles.detailsToggle}
                        onClick={() => this.setState(s => ({ showDetails: !s.showDetails }))}
                     >
                        {showDetails ? '▲' : '▼'} Error details
                     </button>
                     {showDetails && (
                        <pre className={styles.detailsCode}>
                           {error.message}
                           {error.stack ? '\n\n' + error.stack : ''}
                        </pre>
                     )}
                  </div>
               )}

            </div>
         </div>
      );
   }
}
