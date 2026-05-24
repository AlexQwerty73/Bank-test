import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './loginForm.module.css';
import { saveToLocalStorage } from '../../../utils';
import { useLazyGetUserByEmailQuery, useUpdateUserMutation } from '../../../store';

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

export const LoginForm = () => {
   const navigate = useNavigate();
   const [showPass, setShowPass] = useState(false);
   const [getUserByEmail] = useLazyGetUserByEmailQuery();
   const [updateUser] = useUpdateUserMutation();

   const {
      register,
      handleSubmit,
      setError,
      formState: { errors, isSubmitting },
   } = useForm();

   const onSubmit = async ({ email, password }) => {
      const { data: users = [] } = await getUserByEmail(email);
      const user = users[0];

      if (!user) {
         setError('email', { message: 'No account found with this email' });
         return;
      }
      if (user.password !== password) {
         setError('password', { message: 'Incorrect password' });
         return;
      }

      saveToLocalStorage('userId', user.id);
      updateUser({ ...user, lastLogin: new Date().toISOString() });
      navigate('/');
   };

   return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

         <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
               className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
               type="email"
               placeholder="you@example.com"
               {...register('email', {
                  required: 'Email is required',
                  pattern: {
                     value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                     message: 'Enter a valid email address',
                  },
               })}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
         </div>

         <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passWrap}>
               <input
                  className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password', { required: 'Password is required' })}
               />
               <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
               >
                  {showPass ? <EyeOffIcon /> : <EyeIcon />}
               </button>
            </div>
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
         </div>

         <button className={styles.btn} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
         </button>

      </form>
   );
};
