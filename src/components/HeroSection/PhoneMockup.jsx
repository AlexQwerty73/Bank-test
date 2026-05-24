import React from 'react';

export const PhoneMockup = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 280 500"
      width="280"
      height="500"
      fill="none"
      style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.38))', maxWidth: '100%' }}
   >
      <defs>
         <linearGradient id="pmCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#0EA5E9" />
         </linearGradient>
         <linearGradient id="pmPhoneBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#F8FAFC" />
         </linearGradient>
         <clipPath id="pmClip">
            <rect x="10" y="10" width="260" height="480" rx="36" />
         </clipPath>
      </defs>

      {/* Phone body */}
      <rect x="10" y="10" width="260" height="480" rx="36" fill="url(#pmPhoneBg)" stroke="#E5E7EB" strokeWidth="1" />

      {/* Camera pill */}
      <rect x="100" y="22" width="80" height="14" rx="7" fill="#E2E8F0" />

      <g clipPath="url(#pmClip)">

         {/* ── Header ── */}
         <rect x="10" y="44" width="260" height="46" fill="white" />
         <text x="30" y="74" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="700" fill="#111827">Good morning 👋</text>
         <circle cx="248" cy="68" r="16" fill="#EEF2FF" />
         <text x="248" y="74" fontFamily="system-ui,sans-serif" fontSize="12" fontWeight="700" textAnchor="middle" fill="#4F46E5">A</text>

         {/* ── Mini card ── */}
         <rect x="20" y="98" width="240" height="116" rx="16" fill="url(#pmCardGrad)" />
         {/* shine */}
         <ellipse cx="210" cy="115" rx="100" ry="60" fill="white" opacity="0.07" />
         {/* chip */}
         <rect x="34" y="116" width="28" height="22" rx="4" fill="#F6C941" />
         <line x1="34" y1="123" x2="62" y2="123" stroke="#D4A017" strokeWidth="1" />
         <line x1="34" y1="130" x2="62" y2="130" stroke="#D4A017" strokeWidth="1" />
         <line x1="48" y1="116" x2="48" y2="138" stroke="#D4A017" strokeWidth="1" />
         {/* contactless */}
         <path d="M218,122 Q228,130 228,137 Q228,144 218,152" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.75" />
         <path d="M209,118 Q223,128 223,137 Q223,146 209,156" stroke="white" strokeWidth="2.2" strokeLinecap="round" fill="none" opacity="0.5" />
         {/* card number */}
         <text x="34" y="168" fontFamily="monospace" fontSize="12" fontWeight="600" fill="white" letterSpacing="2">•••• •••• •••• 4242</text>
         {/* name & expiry */}
         <text x="34" y="188" fontFamily="system-ui,sans-serif" fontSize="9" fill="rgba(255,255,255,0.7)" letterSpacing="0.5">JOHN DOE</text>
         <text x="200" y="188" fontFamily="system-ui,sans-serif" fontSize="9" fill="rgba(255,255,255,0.7)">05/27</text>

         {/* ── Balance ── */}
         <text x="30" y="238" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="600" fill="#9CA3AF" letterSpacing="0.8">TOTAL BALANCE</text>
         <text x="30" y="265" fontFamily="system-ui,sans-serif" fontSize="26" fontWeight="800" fill="#111827">$2,450.00</text>
         <rect x="192" y="247" width="62" height="22" rx="8" fill="#D1FAE5" />
         <text x="223" y="262" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700" fill="#059669" textAnchor="middle">▲ 2.4%</text>

         {/* ── Divider ── */}
         <line x1="20" y1="283" x2="260" y2="283" stroke="#F3F4F6" strokeWidth="1" />

         {/* ── Recent label ── */}
         <text x="30" y="308" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="700" fill="#111827">Recent transactions</text>

         {/* ── TX 1 ── */}
         <circle cx="46" cy="336" r="16" fill="#FEE2E2" />
         <text x="46" y="341" fontFamily="system-ui" fontSize="13" textAnchor="middle">🛒</text>
         <text x="70" y="333" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="600" fill="#111827">Grocery Store</text>
         <text x="70" y="346" fontFamily="system-ui,sans-serif" fontSize="9" fill="#9CA3AF">Today · 14:22</text>
         <text x="254" y="337" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill="#DC2626" textAnchor="end">−$42.00</text>

         {/* ── TX 2 ── */}
         <circle cx="46" cy="376" r="16" fill="#D1FAE5" />
         <text x="46" y="381" fontFamily="system-ui" fontSize="13" textAnchor="middle">💼</text>
         <text x="70" y="373" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="600" fill="#111827">Salary</text>
         <text x="70" y="386" fontFamily="system-ui,sans-serif" fontSize="9" fill="#9CA3AF">Yesterday</text>
         <text x="254" y="377" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill="#059669" textAnchor="end">+$2,000.00</text>

         {/* ── TX 3 ── */}
         <circle cx="46" cy="416" r="16" fill="#EEF2FF" />
         <text x="46" y="421" fontFamily="system-ui" fontSize="13" textAnchor="middle">⚡</text>
         <text x="70" y="413" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="600" fill="#111827">Electricity</text>
         <text x="70" y="426" fontFamily="system-ui,sans-serif" fontSize="9" fill="#9CA3AF">23 May</text>
         <text x="254" y="417" fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill="#DC2626" textAnchor="end">−$67.00</text>

         {/* ── Bottom home bar ── */}
         <rect x="10" y="452" width="260" height="38" fill="white" />
         <rect x="110" y="466" width="60" height="5" rx="2.5" fill="#E2E8F0" />

      </g>
   </svg>
);
