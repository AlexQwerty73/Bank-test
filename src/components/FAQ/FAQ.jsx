import React, { useState } from 'react';
import styles from './faq.module.css';
import { useInView } from 'react-intersection-observer';

const FAQ_ITEMS = [
   {
      question: 'How do I open an account?',
      answer:   'Click "Open free account", fill in your name, email and password — that\'s it. Your account is ready in under 2 minutes with no branch visits or paperwork.',
   },
   {
      question: 'What currencies are supported?',
      answer:   'We support UAH (Ukrainian hryvnia), USD (US dollar) and EUR (euro). You can open a separate account for each currency and hold all three simultaneously.',
   },
   {
      question: 'How do I issue a card?',
      answer:   'Go to the Cards section and click "Add card". Choose the account to link it to and the card type — debit or credit. Each account supports one debit and one credit card.',
   },
   {
      question: 'Is my money safe?',
      answer:   'Yes. All data is protected with 256-bit TLS encryption. We use two-factor authentication and real-time fraud monitoring to keep your account secure around the clock.',
   },
   {
      question: 'How do deposits work?',
      answer:   'Open a deposit from the Deposits section. Use the calculator to estimate your earnings based on amount, currency and term. Interest is calculated monthly and credited at the end of the term.',
   },
   {
      question: 'Can I transfer money between accounts?',
      answer:   'Yes. Go to Transactions → New Transfer and select the source and destination accounts. Transfers between your own accounts are instant and free of charge.',
   },
];

const FAQItem = ({ item, isOpen, onToggle }) => {
   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

   return (
      <div
         ref={ref}
         className={`${styles.item} ${inView ? styles.visible : ''} ${isOpen ? styles.open : ''}`}
      >
         <button className={styles.question} onClick={onToggle} aria-expanded={isOpen}>
            <span>{item.question}</span>
            <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
         </button>
         {isOpen && (
            <div className={styles.answer}>
               {item.answer}
            </div>
         )}
      </div>
   );
};

export const FAQ = () => {
   const [openIndex, setOpenIndex] = useState(null);
   const [headRef, headInView] = useInView({ triggerOnce: true, threshold: 0.3 });

   const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

   return (
      <section className={styles.faq}>
         <div className={`${styles.head} ${headInView ? styles.headVisible : ''}`} ref={headRef}>
            <p className={styles.eyebrow}>FAQ</p>
            <h2 className={styles.title}>Frequently Asked Questions</h2>
         </div>
         <div className={styles.list}>
            {FAQ_ITEMS.map((item, i) => (
               <FAQItem
                  key={item.question}
                  item={item}
                  isOpen={openIndex === i}
                  onToggle={() => toggle(i)}
               />
            ))}
         </div>
      </section>
   );
};
