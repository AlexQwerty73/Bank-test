import React, { useState } from 'react';
import styles from '.././formComponent.module.css';

const EyeIcon = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z"/>
      <circle cx="10" cy="10" r="3"/>
   </svg>
);
const EyeOffIcon = () => (
   <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 11.94A9.98 9.98 0 0 0 19 10s-3.5-7-9-7c-1.17 0-2.28.22-3.31.6M6.53 6.53A9.98 9.98 0 0 0 1 10s3.5 7 9 7c1.58 0 3.03-.42 4.29-1.14"/>
      <line x1="2" y1="2" x2="18" y2="18"/>
   </svg>
);

export const Password = ({ register, errors }) => {
   const [show, setShow] = useState(false);
   const name = 'password';

   return (
      <div className={styles.input_container}>
         <label>
            <div className={styles.title}>Password:</div>
            <div className={styles.passWrap}>
               <input
                  placeholder="••••••••"
                  type={show ? 'text' : 'password'}
                  {...register(name, {
                     required: 'Password is required',
                     minLength: {
                        value: 8,
                        message: 'Password must be at least 8 characters long',
                     },
                  })}
               />
               <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShow(v => !v)}
                  tabIndex={-1}
                  aria-label={show ? 'Hide password' : 'Show password'}
               >
                  {show ? <EyeOffIcon /> : <EyeIcon />}
               </button>
            </div>
         </label>
         {errors[name] && <p>{errors[name].message}</p>}
      </div>
   );
};