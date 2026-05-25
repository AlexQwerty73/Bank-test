import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAddAccountMutation, useGetAccountsByUserIdQuery } from '../../../store';
import { generateAccountNumber, loadFromLocalStorage } from '../../../utils';
import styles from './createAccountForm.module.css';

const CreateAccountSkeleton = () => (
   <div className={styles.skeleton}>
      <div className={`${styles.sk} ${styles.skHint}`} />
      {[0, 1, 2].map(i => (
         <div key={i} className={`${styles.sk} ${styles.skOption}`} />
      ))}
      <div className={`${styles.sk} ${styles.skBtn}`} />
   </div>
);

const ALL_CURRENCIES  = ['UAH', 'EUR', 'USD'];
const CURRENCY_FLAGS  = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };
const CURRENCY_NAMES  = { USD: 'US Dollar', EUR: 'Euro', UAH: 'Ukrainian Hryvnia' };
const CURRENCY_DESC   = {
   USD: 'Best for international transfers and online shopping',
   EUR: 'Use across Europe and for euro-denominated payments',
   UAH: 'Primary currency for local payments in Ukraine',
};

export const CreateAccountForm = () => {
   const { userId }    = useParams();
   const navigate      = useNavigate();
   const localUserId   = loadFromLocalStorage('userId');
   const safeUserId    = userId === localUserId ? localUserId : '';

   const [addAccount, { isLoading }] = useAddAccountMutation();
   const { data: existingAccounts = [], isLoading: accLoading } =
      useGetAccountsByUserIdQuery(safeUserId, { skip: !safeUserId });

   const existingCurrencies  = useMemo(() => existingAccounts.map(a => a.currency), [existingAccounts]);
   const availableCurrencies = useMemo(
      () => ALL_CURRENCIES.filter(c => !existingCurrencies.includes(c)),
      [existingCurrencies],
   );

   const [selected, setSelected] = React.useState('');

   const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selected) return;
      await addAccount({
         userId:        safeUserId,
         accountNumber: generateAccountNumber(selected),
         currency:      selected,
         balance:       0,
         createdAt:     new Date().toISOString(),
      }).unwrap();
      navigate(`/${userId}/transactions`);
   };

   if (accLoading) return <CreateAccountSkeleton />;

   if (availableCurrencies.length === 0) {
      return (
         <div className={styles.limitBox}>
            <span className={styles.limitIcon}>✅</span>
            <p className={styles.limitTitle}>All accounts open</p>
            <p className={styles.limitText}>
               You already have accounts in all three currencies: UAH, EUR, USD.
            </p>
         </div>
      );
   }

   return (
      <form className={styles.form} onSubmit={handleSubmit}>
         <p className={styles.hint}>One account per currency. Select a currency to open:</p>

         <div className={styles.options}>
            {availableCurrencies.map(cur => (
               <label
                  key={cur}
                  className={`${styles.option} ${selected === cur ? styles.optionActive : ''}`}
               >
                  <input
                     type="radio"
                     name="currency"
                     value={cur}
                     checked={selected === cur}
                     onChange={() => setSelected(cur)}
                     className={styles.radio}
                  />
                  <span className={styles.optionFlag}>{CURRENCY_FLAGS[cur]}</span>
                  <div className={styles.optionText}>
                     <span className={styles.optionCode}>{cur}</span>
                     <span className={styles.optionName}>{CURRENCY_NAMES[cur]}</span>
                     <span className={styles.optionDesc}>{CURRENCY_DESC[cur]}</span>
                  </div>
                  {selected === cur && (
                     <span className={styles.checkmark}>✓</span>
                  )}
               </label>
            ))}
         </div>

         {/* Already opened accounts */}
         {existingAccounts.length > 0 && (
            <div className={styles.existing}>
               <p className={styles.existingLabel}>Already opened:</p>
               <div className={styles.existingList}>
                  {existingAccounts.map(acc => (
                     <span key={acc.id} className={styles.existingBadge}>
                        {CURRENCY_FLAGS[acc.currency]} {acc.currency}
                     </span>
                  ))}
               </div>
            </div>
         )}

         <button
            className={styles.btn}
            type="submit"
            disabled={isLoading || !selected}
         >
            {isLoading ? 'Opening account…' : `Open ${selected || '…'} account`}
         </button>
      </form>
   );
};
