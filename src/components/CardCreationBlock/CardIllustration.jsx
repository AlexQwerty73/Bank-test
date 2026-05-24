import React from 'react';

export const CardIllustration = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 460 300"
      width="460"
      height="300"
      fill="none"
      style={{ maxWidth: '100%' }}
   >
      <defs>
         <linearGradient id="ciBack" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#60A5FA" />
         </linearGradient>
         <linearGradient id="ciFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#4F46E5" />
         </linearGradient>
         <filter id="ciShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="14" stdDeviation="22" floodColor="rgba(79,70,229,0.38)" />
         </filter>
      </defs>

      {/* ── Back card (tilted, lighter) ── */}
      <g transform="rotate(-9 230 150) translate(40 30)">
         <rect width="340" height="210" rx="22" fill="url(#ciBack)" opacity="0.75" />
         <ellipse cx="290" cy="50" rx="120" ry="70" fill="white" opacity="0.06" />
      </g>

      {/* ── Front card ── */}
      <g transform="translate(56 40)" filter="url(#ciShadow)">
         <rect width="348" height="214" rx="22" fill="url(#ciFront)" />

         {/* Shine overlay */}
         <ellipse cx="295" cy="52" rx="130" ry="80" fill="white" opacity="0.07" />

         {/* Decorative circles */}
         <circle cx="300" cy="60" r="90" stroke="rgba(255,255,255,0.09)" strokeWidth="1" />
         <circle cx="300" cy="60" r="120" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

         {/* ── Chip ── */}
         <rect x="30" y="56" width="38" height="30" rx="5" fill="#F6C941" />
         <line x1="30" y1="66" x2="68" y2="66" stroke="#D4A017" strokeWidth="1.3" />
         <line x1="30" y1="74" x2="68" y2="74" stroke="#D4A017" strokeWidth="1.3" />
         <line x1="49" y1="56" x2="49" y2="86" stroke="#D4A017" strokeWidth="1.3" />

         {/* ── Bank name ── */}
         <text
            x="316"
            y="44"
            fontFamily="system-ui,sans-serif"
            fontSize="17"
            fontWeight="800"
            fill="rgba(255,255,255,0.92)"
            textAnchor="end"
            letterSpacing="-0.5"
         >
            FinBank
         </text>

         {/* ── Contactless ── */}
         <path d="M300,62 Q312,72 312,82 Q312,92 300,102" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.8" />
         <path d="M287,55 Q305,68 305,82 Q305,96 287,109" stroke="white" strokeWidth="2.8" strokeLinecap="round" fill="none" opacity="0.5" />

         {/* ── Card number ── */}
         <text x="30" y="154" fontFamily="monospace" fontSize="19" fontWeight="600" fill="white" letterSpacing="3">
            •••• •••• •••• 4242
         </text>

         {/* ── Cardholder ── */}
         <text x="30" y="192" fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="600" fill="rgba(255,255,255,0.7)" letterSpacing="1">
            JOHN DOE
         </text>

         {/* ── Valid thru ── */}
         <text x="214" y="183" fontFamily="system-ui,sans-serif" fontSize="8" fill="rgba(255,255,255,0.5)" letterSpacing="0.5">VALID THRU</text>
         <text x="214" y="196" fontFamily="system-ui,sans-serif" fontSize="13" fontWeight="600" fill="rgba(255,255,255,0.85)">05/27</text>

         {/* ── Mastercard circles ── */}
         <circle cx="302" cy="187" r="17" fill="#EB001B" opacity="0.88" />
         <circle cx="320" cy="187" r="17" fill="#F79E1B" opacity="0.88" />
         <ellipse cx="311" cy="187" rx="6" ry="14" fill="#FF5F00" opacity="0.6" />
      </g>
   </svg>
);
