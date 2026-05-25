import React from 'react';
import { Link } from 'react-router-dom';
import styles from './privacyPage.module.css';

const Section = ({ title, children }) => (
   <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
   </section>
);

export const PrivacyPage = () => (
   <div className={styles.page}>
      <div className="container">
         <div className={styles.inner}>

            <div className={styles.breadcrumb}>
               <Link to="/">Home</Link>
               <span>›</span>
               <span>Privacy Policy</span>
            </div>

            <div className={styles.header}>
               <div className={styles.headerIcon}>🔒</div>
               <div>
                  <h1 className={styles.title}>Privacy Policy</h1>
                  <p className={styles.meta}>Last updated: January 1, 2025 · Effective: January 1, 2025</p>
               </div>
            </div>

            <div className={styles.intro}>
               At <strong>Bankify</strong>, we are committed to protecting your personal information.
               This Privacy Policy explains how we collect, use, and safeguard your data when you use our services.
            </div>

            <Section title="1. Information We Collect">
               <p>We collect the following types of information:</p>
               <ul>
                  <li><strong>Account data</strong> — name, email address, phone number, and date of birth provided during registration.</li>
                  <li><strong>Financial data</strong> — account balances, transaction history, card details (masked), and deposit records.</li>
                  <li><strong>Technical data</strong> — IP address, browser type, device identifiers, and usage patterns collected automatically.</li>
                  <li><strong>Communication data</strong> — messages you send to our support team.</li>
               </ul>
            </Section>

            <Section title="2. How We Use Your Information">
               <p>Your information is used to:</p>
               <ul>
                  <li>Provide, operate, and improve our banking services.</li>
                  <li>Process transactions and maintain accurate account records.</li>
                  <li>Verify your identity and prevent fraud.</li>
                  <li>Send important account notifications and security alerts.</li>
                  <li>Comply with legal and regulatory obligations.</li>
               </ul>
            </Section>

            <Section title="3. Data Sharing">
               <p>
                  We do <strong>not</strong> sell your personal data. We may share information with:
               </p>
               <ul>
                  <li><strong>Service providers</strong> who assist us in delivering our services (under strict confidentiality agreements).</li>
                  <li><strong>Regulatory authorities</strong> when required by law.</li>
                  <li><strong>Fraud prevention services</strong> to protect you and our platform.</li>
               </ul>
            </Section>

            <Section title="4. Data Security">
               <p>
                  We implement industry-standard security measures including 256-bit AES encryption,
                  TLS for data in transit, multi-factor authentication, and regular security audits.
                  However, no method of transmission over the internet is 100% secure.
               </p>
            </Section>

            <Section title="5. Your Rights">
               <p>Depending on your location, you may have the right to:</p>
               <ul>
                  <li>Access, correct, or delete your personal data.</li>
                  <li>Object to or restrict certain processing activities.</li>
                  <li>Data portability — receive your data in a structured format.</li>
                  <li>Withdraw consent at any time (where processing is consent-based).</li>
               </ul>
               <p>To exercise these rights, contact us at <a href="mailto:privacy@bankify.app">privacy@bankify.app</a>.</p>
            </Section>

            <Section title="6. Cookies">
               <p>
                  We use cookies and similar technologies to remember your preferences, keep you signed in,
                  and analyze how our service is used. You can control cookie settings through your browser.
               </p>
            </Section>

            <Section title="7. Data Retention">
               <p>
                  We retain your personal data for as long as your account is active or as required by law.
                  Financial records are typically retained for 7 years after account closure.
               </p>
            </Section>

            <Section title="8. Changes to This Policy">
               <p>
                  We may update this policy from time to time. We will notify you of significant changes
                  via email or an in-app notification at least 30 days before they take effect.
               </p>
            </Section>

            <div className={styles.contact}>
               <h3>Questions?</h3>
               <p>
                  Contact our Data Protection Officer at{' '}
                  <a href="mailto:privacy@bankify.app">privacy@bankify.app</a> or write to:<br />
                  Bankify Inc., 1 Finance Street, New York, NY 10001
               </p>
            </div>

            <div className={styles.footer}>
               <Link to="/terms" className={styles.footerLink}>Terms of Service</Link>
               <span>·</span>
               <Link to="/" className={styles.footerLink}>Back to Home</Link>
            </div>

         </div>
      </div>
   </div>
);
