import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styles from './loginForm.module.css';
import { saveToLocalStorage } from '../../../utils';
import { useLazyGetUserByEmailQuery, useUpdateUserMutation } from '../../../store';

export const LoginForm = () => {
   const navigate = useNavigate();
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
            <input
               className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
               type="password"
               placeholder="••••••••"
               {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
         </div>

         <button className={styles.btn} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
         </button>

      </form>
   );
};
