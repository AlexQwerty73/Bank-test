import React from 'react';
import styles from './faq.module.css';
import { useInView } from 'react-intersection-observer';

export const FAQ = () => {
   const faqItems = [
      {
         question: "How to open an account in your bank?",
         answer: "To open an account in our bank, you need to visit any branch with a passport and identification code (for legal entities) or identification number (for individuals). Our specialists will provide you with all the necessary information and fill out the required documents."
      },
      {
         question: "What advantages do clients of your bank have?",
         answer: "Our bank offers a wide range of services, including various credit and deposit products, investment opportunities, electronic payment systems, and much more. We also provide a high level of service and individual approach to each client."
      },
      {
         question: "Lorem ipsum dolor sit amet?",
         answer: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nesciunt ipsam aspernatur illum corporis dicta cum exercitationem perferendis. Deleniti, alias enim eligendi, voluptas in asperiores iusto quae iste fugiat cumque quaerat!"
      },
      {
         question: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet?",
         answer: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe sapiente commodi vel cum eaque harum non, eum et expedita sed cumque rerum error nam eligendi eius. Assumenda molestiae dolores illum! Adipisci ducimus perspiciatis ratione ipsam deleniti asperiores nostrum facilis saepe doloribus laboriosam rem iusto consequuntur enim cumque dignissimos, laudantium dolor quidem sapiente ea aliquid porro. Rem eveniet beatae itaque enim!"
      },
   ];

   return (
      <div className={styles.faq}>
         <h2 className={styles.title}>Frequently Asked Questions (FAQ)</h2>
         <div className={styles.faqList}>
            {faqItems.map((item, index) => (
               <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
         </div>
      </div>
   );
};

const FAQItem = ({ question, answer }) => {
   const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.5
   });

   return (
      <div ref={ref} className={`${styles.dialog} ${inView ? styles.visible : ''}`}>
         <div className={styles.cloud}>{question}</div>
         <div className={styles.cloud}>{answer}</div>
      </div>
   );
};
