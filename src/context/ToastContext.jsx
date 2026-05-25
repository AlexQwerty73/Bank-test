import React, { createContext, useContext, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './toast.module.css';

/* ── Context ─────────────────────────────────────────────── */
const ToastCtx = createContext(null);

export const useToast = () => {
   const ctx = useContext(ToastCtx);
   if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
   return ctx;
};

/* ── Single toast ────────────────────────────────────────── */
const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };

const Toast = ({ id, type, message, onDismiss }) => (
   <div className={`${styles.toast} ${styles[type] ?? styles.info}`} role="alert">
      <span className={styles.icon}>{ICONS[type] ?? ICONS.info}</span>
      <span className={styles.msg}>{message}</span>
      <button className={styles.close} onClick={() => onDismiss(id)} aria-label="Dismiss">✕</button>
   </div>
);

/* ── Portal container ────────────────────────────────────── */
const ToastPortal = ({ toasts, onDismiss }) =>
   toasts.length === 0 ? null
   : ReactDOM.createPortal(
      <div className={styles.container}>
         {toasts.map(t => <Toast key={t.id} {...t} onDismiss={onDismiss} />)}
      </div>,
      document.body,
   );

/* ── Provider ────────────────────────────────────────────── */
let _uid = 1;

export const ToastProvider = ({ children }) => {
   const [toasts, setToasts] = useState([]);

   const dismiss = useCallback((id) =>
      setToasts(p => p.filter(t => t.id !== id)), []);

   const add = useCallback((type, message, duration = 4000) => {
      const id = `toast-${_uid++}`;
      setToasts(p => [...p, { id, type, message }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
   }, [dismiss]);

   const toast = {
      success: (msg, dur) => add('success', msg, dur),
      error:   (msg, dur) => add('error',   msg, dur),
      info:    (msg, dur) => add('info',    msg, dur),
      warning: (msg, dur) => add('warning', msg, dur),
   };

   return (
      <ToastCtx.Provider value={toast}>
         {children}
         <ToastPortal toasts={toasts} onDismiss={dismiss} />
      </ToastCtx.Provider>
   );
};
