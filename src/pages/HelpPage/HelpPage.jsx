import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './helpPage.module.css';

/* ── FAQ data ─────────────────────────────────────────── */
const FAQ = [
   {
      category: 'Accounts & Cards',
      items: [
         {
            q: 'How do I open a new account?',
            a: 'Go to your profile → Issue Card page, or navigate to Transactions → New Account. You can hold one account per currency (UAH, USD, EUR).',
         },
         {
            q: 'How many cards can I have?',
            a: 'You can have up to 1 debit and 1 credit card per account — a maximum of 6 cards total across all three currencies.',
         },
         {
            q: 'How do I get my account number?',
            a: 'Open the Transactions page, select an account, and click on the account number to copy it. It is displayed in IBAN format.',
         },
         {
            q: 'Why is my card expired?',
            a: 'Cards expire after the date shown on the front face (MM/YY). You can issue a replacement card from the Issue Card page.',
         },
      ],
   },
   {
      category: 'Transfers & Payments',
      items: [
         {
            q: 'How do I send money to another account?',
            a: 'Go to Transactions → Transfer, enter the recipient\'s account number, amount and optional description, then confirm. Funds are transferred instantly.',
         },
         {
            q: 'What currencies can I transfer?',
            a: 'You can transfer in UAH, USD, or EUR. The transfer currency must match the source account currency. Cross-currency transfers require an exchange first.',
         },
         {
            q: 'Is there a transfer limit?',
            a: 'There is no hard limit in the demo. In production, limits would be set per account type and regulatory requirements.',
         },
         {
            q: 'Can I cancel a transfer after sending?',
            a: 'Transfers in this demo are instant and final. Contact support immediately if you sent funds to the wrong account.',
         },
      ],
   },
   {
      category: 'Deposits',
      items: [
         {
            q: 'How do deposits work?',
            a: 'Fixed-term deposits lock your funds for a chosen period (3–24 months) and earn interest at the shown annual rate. Interest is calculated monthly.',
         },
         {
            q: 'What happens if I close a deposit early?',
            a: 'Early closure applies a 50% penalty on earned interest. You receive your principal back plus half of the proportional interest, minus 19% tax.',
         },
         {
            q: 'How is interest taxed?',
            a: 'Interest income is subject to a 19% withholding tax. The "after tax" amount is shown in the deposit calculator before you open a deposit.',
         },
         {
            q: 'What does "Matures soon" mean?',
            a: 'When a deposit has 7 days or fewer remaining, it shows a warning badge. Once matured, you can collect the full payout from the Deposits page.',
         },
      ],
   },
   {
      category: 'Security & Privacy',
      items: [
         {
            q: 'How do I hide my balances on screen?',
            a: 'Go to Settings → Privacy → "Hide account balances". When enabled, all balance amounts show as •••• across the app.',
         },
         {
            q: 'Can I mask my card numbers?',
            a: 'Yes. Settings → Privacy → "Mask card numbers" shows only the last 4 digits. You can reveal the full number with the eye button on the card detail page.',
         },
         {
            q: 'How do I change my password?',
            a: 'Go to Settings → About → Help & Support and contact our team. Self-service password change will be available in a future update.',
         },
      ],
   },
   {
      category: 'App Settings',
      items: [
         {
            q: 'How do I change the date format?',
            a: 'Settings → Regional → Date format. You can choose DD/MM/YYYY (default), MM/DD/YYYY, or YYYY-MM-DD. Changes apply immediately across all pages.',
         },
         {
            q: 'What is compact layout?',
            a: 'Compact layout reduces the spacing and padding in lists and cards, so more information fits on the screen at once. Toggle it in Settings → Appearance.',
         },
         {
            q: 'How do I export my transactions?',
            a: 'Settings → Data & Storage → Export CSV. This downloads all your transactions as a UTF-8 CSV file, compatible with Excel and Google Sheets.',
         },
      ],
   },
];

/* ── Accordion item ────────────────────────────────────── */
const FaqItem = ({ q, a }) => {
   const [open, setOpen] = useState(false);
   return (
      <div className={`${styles.faqItem} ${open ? styles.faqItemOpen : ''}`}>
         <button className={styles.faqQ} onClick={() => setOpen(o => !o)}>
            <span>{q}</span>
            <svg
               className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ''}`}
               viewBox="0 0 20 20" fill="none" stroke="currentColor"
               strokeWidth="2" strokeLinecap="round" width="16" height="16"
            >
               <path d="M5 8l5 5 5-5"/>
            </svg>
         </button>
         {open && <p className={styles.faqA}>{a}</p>}
      </div>
   );
};

/* ── Page ─────────────────────────────────────────────── */
export const HelpPage = () => {
   const [searchQ, setSearchQ]   = useState('');
   const [activeCategory, setActiveCategory] = useState('all');

   const q = searchQ.trim().toLowerCase();

   const filtered = FAQ.map(group => ({
      ...group,
      items: group.items.filter(item =>
         (activeCategory === 'all' || activeCategory === group.category) &&
         (!q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q))
      ),
   })).filter(g => g.items.length > 0);

   return (
      <div className={styles.page}>
         <div className="container">
            <div className={styles.inner}>

               {/* ── Breadcrumb ── */}
               <div className={styles.breadcrumb}>
                  <Link to="/">Home</Link>
                  <span>›</span>
                  <span>Help & Support</span>
               </div>

               {/* ── Hero ── */}
               <div className={styles.hero}>
                  <div className={styles.heroIcon}>🆘</div>
                  <div>
                     <h1 className={styles.heroTitle}>Help & Support</h1>
                     <p className={styles.heroSub}>Find answers, guides and contact options</p>
                  </div>
               </div>

               {/* ── Contact cards ── */}
               <div className={styles.contactGrid}>
                  {[
                     { icon: '✉️', label: 'Email support',  value: 'support@bankify.app',  href: 'mailto:support@bankify.app',  desc: 'Reply within 24 h'  },
                     { icon: '📞', label: 'Phone',          value: '+1 (800) 123-45-67',    href: 'tel:+18001234567',            desc: '24/7 available'     },
                     { icon: '💬', label: 'Live chat',      value: 'Start chat',            href: '#',                          desc: 'Average wait: 2 min'},
                  ].map(({ icon, label, value, href, desc }) => (
                     <a key={label} href={href} className={styles.contactCard}>
                        <span className={styles.contactCardIcon}>{icon}</span>
                        <div>
                           <div className={styles.contactCardLabel}>{label}</div>
                           <div className={styles.contactCardValue}>{value}</div>
                           <div className={styles.contactCardDesc}>{desc}</div>
                        </div>
                     </a>
                  ))}
               </div>

               {/* ── FAQ section ── */}
               <div className={styles.faqSection}>
                  <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

                  {/* Search */}
                  <div className={styles.searchWrap}>
                     <svg className={styles.searchIcon} viewBox="0 0 20 20" fill="none"
                          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
                          width="16" height="16">
                        <circle cx="9" cy="9" r="5"/><path d="M20 20l-4.3-4.3"/>
                     </svg>
                     <input
                        className={styles.searchInput}
                        type="search"
                        placeholder="Search questions…"
                        value={searchQ}
                        onChange={e => setSearchQ(e.target.value)}
                     />
                  </div>

                  {/* Category pills */}
                  <div className={styles.categoryRow}>
                     {['all', ...FAQ.map(g => g.category)].map(cat => (
                        <button
                           key={cat}
                           className={`${styles.catPill} ${activeCategory === cat ? styles.catPillActive : ''}`}
                           onClick={() => setActiveCategory(cat)}
                        >
                           {cat === 'all' ? 'All topics' : cat}
                        </button>
                     ))}
                  </div>

                  {/* FAQ groups */}
                  {filtered.length === 0 ? (
                     <div className={styles.noResults}>
                        <span>🔍</span>
                        <p>No questions match your search. Try different keywords or <button className={styles.clearBtn} onClick={() => setSearchQ('')}>clear the search</button>.</p>
                     </div>
                  ) : (
                     filtered.map(group => (
                        <div key={group.category} className={styles.faqGroup}>
                           <div className={styles.faqGroupLabel}>{group.category}</div>
                           {group.items.map(item => (
                              <FaqItem key={item.q} q={item.q} a={item.a} />
                           ))}
                        </div>
                     ))
                  )}
               </div>

               {/* ── Still need help? ── */}
               <div className={styles.stillNeedHelp}>
                  <div className={styles.stillIcon}>🤝</div>
                  <div>
                     <h3 className={styles.stillTitle}>Still need help?</h3>
                     <p className={styles.stillDesc}>
                        Our support team is available 24/7. Describe your issue in detail and we'll
                        get back to you as quickly as possible.
                     </p>
                  </div>
                  <a href="mailto:support@bankify.app" className={styles.stillBtn}>
                     Contact support
                  </a>
               </div>

               {/* ── Footer links ── */}
               <div className={styles.footerLinks}>
                  <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                  <span>·</span>
                  <Link to="/terms"   className={styles.footerLink}>Terms of Service</Link>
                  <span>·</span>
                  <Link to="/"        className={styles.footerLink}>Back to Home</Link>
               </div>

            </div>
         </div>
      </div>
   );
};
