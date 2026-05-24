import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useAddCardMutation, useGetCardsByUserIdQuery, useGetAccountsByUserIdQuery } from '../../../store';
import { useNavigate, useParams } from 'react-router-dom';
import { generateCVV, generateCardNumber, generateExpiryDate, loadFromLocalStorage } from '../../../utils';
import styles from './createCardForm.module.css';

// Max 1 debit + 1 credit per account (all currencies equal)
const MAX_PER_CATEGORY = 1; // per account per category
const CURRENCY_FLAGS = { USD: '🇺🇸', EUR: '🇪🇺', UAH: '🇺🇦' };

export const CreateCardForm = () => {
   const navigate    = useNavigate();
   const { userId }  = useParams();
   const localUserId = loadFromLocalStorage('userId');
   const checkedUserId = userId === localUserId ? localUserId : '';

   const [addCard, { isLoading: isSubmitting }] = useAddCardMutation();

   const { data: existingCards = [],    isLoading: cardsLoading    } =
      useGetCardsByUserIdQuery(checkedUserId, { skip: !checkedUserId });
   const { data: userAccounts = [],     isLoading: accountsLoading } =
      useGetAccountsByUserIdQuery(checkedUserId, { skip: !checkedUserId });

   const generatedData = useMemo(() => ({
      number:     generateCardNumber(),
      expiryDate: generateExpiryDate(),
      cvv:        generateCVV(),
   }), []);

   // Count cards per account per category
   const cardSlots = useMemo(() =>
      existingCards.reduce((map, c) => {
         const key = `${c.accountId}::${c.category}`;
         map[key] = (map[key] || 0) + 1;
         return map;
      }, {}),
   [existingCards]);

   // Per account: which categories still have a free slot
   const availableCategories = useMemo(() => {
      const result = {};
      userAccounts.forEach(acc => {
         const hasDebit  = (cardSlots[`${acc.id}::debit`]  || 0) >= MAX_PER_CATEGORY;
         const hasCredit = (cardSlots[`${acc.id}::credit`] || 0) >= MAX_PER_CATEGORY;
         result[acc.id] = {
            debit:  !hasDebit,
            credit: !hasCredit,
            any:    !hasDebit || !hasCredit,
         };
      });
      return result;
   }, [userAccounts, cardSlots]);

   // Accounts that have at least one free slot
   const availableAccounts = useMemo(() =>
      userAccounts.filter(acc => availableCategories[acc.id]?.any),
   [userAccounts, availableCategories]);

   const { register, handleSubmit, watch, formState: { errors } } = useForm();
   const watchedAccountId = watch('accountId', '');

   const onSubmit = async (data) => {
      const targetAccount = availableAccounts.find(a => a.id === data.accountId);
      if (!targetAccount) return;

      await addCard({
         userId:     checkedUserId,
         accountId:  targetAccount.id,
         number:     generatedData.number,
         expiryDate: generatedData.expiryDate,
         cvv:        generatedData.cvv,
         pin:        data.pin,
         type:       data.type,
         category:   data.category,
      });
      navigate(`/${userId}/cards`);
   };

   if (cardsLoading || accountsLoading) return <p className={styles.info}>Loading…</p>;

   // No accounts at all
   if (userAccounts.length === 0) {
      return (
         <div className={styles.limitBox}>
            <span className={styles.limitIcon}>🏦</span>
            <p className={styles.limitTitle}>No accounts found</p>
            <p className={styles.limitText}>
               You need at least one account before you can issue a card.
            </p>
         </div>
      );
   }

   // All account slots full
   if (availableAccounts.length === 0) {
      return (
         <div className={styles.limitBox}>
            <span className={styles.limitIcon}>🚫</span>
            <p className={styles.limitTitle}>Card limit reached</p>
            <p className={styles.limitText}>
               Maximum <strong>1 debit + 1 credit</strong> card per account (up to <strong>6 cards</strong> total across all currencies).
               Delete an existing card to issue a new one.
            </p>
         </div>
      );
   }

   return (
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

         {/* Account slot usage summary */}
         <div className={styles.slotsRow}>
            {userAccounts.map(acc => {
               const debitUsed  = cardSlots[`${acc.id}::debit`]  || 0;
               const creditUsed = cardSlots[`${acc.id}::credit`] || 0;
               const totalUsed  = debitUsed + creditUsed;
               const full = totalUsed >= 2;
               return (
                  <div key={acc.id} className={`${styles.slot} ${full ? styles.slotFull : styles.slotFree}`}>
                     <span className={styles.slotCur}>{CURRENCY_FLAGS[acc.currency]} {acc.currency}</span>
                     <span className={styles.slotCount}>{totalUsed}/2</span>
                     <span className={styles.slotDetail}>
                        {debitUsed > 0 ? '💳' : '○'} debit &nbsp;
                        {creditUsed > 0 ? '💳' : '○'} credit
                     </span>
                  </div>
               );
            })}
         </div>

         {/* Link to account */}
         <div className={styles.field}>
            <label className={styles.label}>Link to account</label>
            <select
               className={`${styles.input} ${errors.accountId ? styles.inputErr : ''}`}
               {...register('accountId', { required: 'Select an account' })}
            >
               <option value="">Select account</option>
               {availableAccounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                     {CURRENCY_FLAGS[acc.currency] ?? ''} {acc.currency} — {Number(acc.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })} {acc.currency}
                  </option>
               ))}
            </select>
            {errors.accountId && <span className={styles.err}>{errors.accountId.message}</span>}
         </div>

         {/* PIN */}
         <div className={styles.field}>
            <label className={styles.label}>PIN</label>
            <input
               className={`${styles.input} ${errors.pin ? styles.inputErr : ''}`}
               type="password"
               inputMode="numeric"
               maxLength={4}
               placeholder="4 digits"
               {...register('pin', {
                  required: 'PIN is required',
                  pattern: { value: /^\d{4}$/, message: 'Exactly 4 digits' },
               })}
            />
            {errors.pin && <span className={styles.err}>{errors.pin.message}</span>}
         </div>

         {/* Card type */}
         <div className={styles.field}>
            <label className={styles.label}>Card type</label>
            <select
               className={`${styles.input} ${errors.type ? styles.inputErr : ''}`}
               {...register('type', { required: 'Select a card type' })}
            >
               <option value="">Select type</option>
               <option value="VISA">Visa</option>
               <option value="MASTERCARD">Mastercard</option>
            </select>
            {errors.type && <span className={styles.err}>{errors.type.message}</span>}
         </div>

         {/* Category — filtered by what's still free on the selected account */}
         <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
               className={`${styles.input} ${errors.category ? styles.inputErr : ''}`}
               {...register('category', { required: 'Select a category' })}
            >
               <option value="">Select category</option>
               {(!watchedAccountId || availableCategories[watchedAccountId]?.debit) && (
                  <option value="debit">Debit</option>
               )}
               {(!watchedAccountId || availableCategories[watchedAccountId]?.credit) && (
                  <option value="credit">Credit</option>
               )}
            </select>
            {errors.category && <span className={styles.err}>{errors.category.message}</span>}
            {watchedAccountId && availableCategories[watchedAccountId] && (
               <span className={styles.hint}>
                  {availableCategories[watchedAccountId]?.debit && !availableCategories[watchedAccountId]?.credit
                     ? 'Only debit available (credit already issued)'
                     : !availableCategories[watchedAccountId]?.debit && availableCategories[watchedAccountId]?.credit
                     ? 'Only credit available (debit already issued)'
                     : 'Both debit and credit available'}
               </span>
            )}
         </div>

         <button className={styles.btn} type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create card'}
         </button>
      </form>
   );
};
