import React from 'react';
import styles from './pagination.module.css';

/**
 * Pagination controls.
 *
 * Props:
 *   page        — current page (1-based)
 *   totalPages  — total number of pages
 *   totalItems  — total number of items (for "showing X–Y of Z" label)
 *   startIndex  — 0-based index of first item on this page
 *   endIndex    — 0-based index (exclusive) of last item on this page
 *   onPage      — (n: number) => void — jump to a page
 *   onPrev      — () => void
 *   onNext      — () => void
 *   label       — optional noun, e.g. "transactions" (default "items")
 */
export const Pagination = ({
   page,
   totalPages,
   totalItems,
   startIndex,
   endIndex,
   onPage,
   onPrev,
   onNext,
   label = 'items',
}) => {
   if (totalPages <= 1) return null;

   /* Build page numbers with ellipsis.
      Always show: 1, last, current-1..current+1 */
   const buildPages = () => {
      if (totalPages <= 7) {
         return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      const pages = new Set([1, totalPages, page - 1, page, page + 1]);
      const arr   = [...pages]
         .filter(p => p >= 1 && p <= totalPages)
         .sort((a, b) => a - b);

      /* insert null gaps */
      const withGaps = [];
      arr.forEach((p, i) => {
         if (i > 0 && p - arr[i - 1] > 1) withGaps.push(null);
         withGaps.push(p);
      });
      return withGaps;
   };

   const pages = buildPages();

   return (
      <div className={styles.wrap}>
         {/* ── Info label ── */}
         <span className={styles.info}>
            {startIndex + 1}–{endIndex} of {totalItems} {label}
         </span>

         {/* ── Controls ── */}
         <div className={styles.controls}>
            {/* Prev */}
            <button
               className={`${styles.btn} ${styles.arrow}`}
               onClick={onPrev}
               disabled={page === 1}
               aria-label="Previous page"
            >
               <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M10 3L5 8l5 5"/>
               </svg>
            </button>

            {/* Page numbers */}
            {pages.map((p, i) =>
               p === null ? (
                  <span key={`gap-${i}`} className={styles.gap}>…</span>
               ) : (
                  <button
                     key={p}
                     className={`${styles.btn} ${p === page ? styles.btnActive : ''}`}
                     onClick={() => onPage(p)}
                     aria-current={p === page ? 'page' : undefined}
                  >
                     {p}
                  </button>
               )
            )}

            {/* Next */}
            <button
               className={`${styles.btn} ${styles.arrow}`}
               onClick={onNext}
               disabled={page === totalPages}
               aria-label="Next page"
            >
               <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 3l5 5-5 5"/>
               </svg>
            </button>
         </div>
      </div>
   );
};
