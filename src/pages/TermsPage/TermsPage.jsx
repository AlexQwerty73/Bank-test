import React from 'react';
import { Link } from 'react-router-dom';
import styles from './termsPage.module.css';

const Section = ({ title, children }) => (
   <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
   </section>
);

export const TermsPage = () => (
   <div className={styles.page}>
      <div className="container">
         <div className={styles.inner}>

            <div className={styles.breadcrumb}>
               <Link to="/">Home</Link>
               <span>›</span>
               <span>Terms of Service</span>
            </div>

            <div className={styles.header}>
               <div className={styles.headerIcon}>📋</div>
               <div>
                  <h1 className={styles.title}>Terms of Service</h1>
                  <p className={styles.meta}>Last updated: January 1, 2025 · Effective: January 1, 2025</p>
               </div>
            </div>

            <div className={styles.intro}>
               Please read these Terms of Service carefully before using <strong>Bankify</strong>.
               By creating an account or using our services, you agree to be bound by these terms.
            </div>

            <Section title="1. Acceptance of Terms">
               <p>
                  By accessing or using Bankify's services, you confirm that you are at least 18 years old,
                  have the legal capacity to enter into contracts, and agree to these terms in their entirety.
                  If you do not agree, please do not use our services.
               </p>
            </Section>

            <Section title="2. Description of Services">
               <p>Bankify provides the following financial services:</p>
               <ul>
                  <li>Multi-currency bank accounts (UAH, USD, EUR)</li>
                  <li>Debit and credit card issuance and management</li>
                  <li>Domestic and international money transfers</li>
                  <li>Currency exchange at competitive rates</li>
                  <li>Fixed-term deposits and savings products</li>
               </ul>
               <p>We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice.</p>
            </Section>

            <Section title="3. Account Registration">
               <p>
                  You must provide accurate and complete information when registering. You are responsible for:
               </p>
               <ul>
                  <li>Maintaining the confidentiality of your login credentials and PIN.</li>
                  <li>All activities that occur under your account.</li>
                  <li>Notifying us immediately of any unauthorized access or security breach.</li>
               </ul>
               <p>We reserve the right to suspend or close accounts that violate these terms.</p>
            </Section>

            <Section title="4. Transactions and Fees">
               <p>
                  All transactions are processed in the currency of the relevant account.
                  Exchange rates are updated periodically and may fluctuate. Transaction fees,
                  where applicable, will be clearly displayed before you confirm an operation.
                  All completed transactions are final unless a processing error occurs on our part.
               </p>
            </Section>

            <Section title="5. Deposits">
               <p>
                  Fixed-term deposits are subject to the terms agreed at the time of opening, including
                  the interest rate, term, and early closure penalties. Early withdrawal may result in
                  reduced interest (50% of proportional earnings) plus applicable taxes.
               </p>
            </Section>

            <Section title="6. Prohibited Uses">
               <p>You may not use Bankify to:</p>
               <ul>
                  <li>Engage in money laundering, fraud, or other illegal activities.</li>
                  <li>Violate any applicable local, national, or international law.</li>
                  <li>Transmit harmful, offensive, or unauthorized content.</li>
                  <li>Attempt to gain unauthorized access to our systems.</li>
                  <li>Use automated tools to access the service without our written consent.</li>
               </ul>
            </Section>

            <Section title="7. Limitation of Liability">
               <p>
                  To the maximum extent permitted by law, Bankify shall not be liable for indirect,
                  incidental, special, or consequential damages arising from your use of the service.
                  Our total liability for any claim shall not exceed the fees paid by you in the
                  12 months preceding the claim.
               </p>
            </Section>

            <Section title="8. Governing Law">
               <p>
                  These terms are governed by and construed in accordance with the laws of the
                  jurisdiction in which Bankify is registered. Any disputes shall be resolved
                  through binding arbitration, except where prohibited by law.
               </p>
            </Section>

            <Section title="9. Changes to Terms">
               <p>
                  We may update these terms periodically. Continued use of the service after changes
                  take effect constitutes acceptance of the updated terms. We will notify you of
                  material changes at least 30 days in advance.
               </p>
            </Section>

            <div className={styles.contact}>
               <h3>Questions about these terms?</h3>
               <p>
                  Contact our legal team at{' '}
                  <a href="mailto:legal@bankify.app">legal@bankify.app</a> or write to:<br />
                  Bankify Inc., 1 Finance Street, New York, NY 10001
               </p>
            </div>

            <div className={styles.footer}>
               <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
               <span>·</span>
               <Link to="/" className={styles.footerLink}>Back to Home</Link>
            </div>

         </div>
      </div>
   </div>
);
