import { useState, useEffect, useMemo } from 'react';

/**
 * usePagination
 * @param {Array}  items     — the full list to paginate
 * @param {number} pageSize  — items per page
 * @returns {{
 *   page:       number,
 *   totalPages: number,
 *   totalItems: number,
 *   pageItems:  Array,
 *   setPage:    (n: number) => void,
 *   prevPage:   () => void,
 *   nextPage:   () => void,
 *   startIndex: number,
 *   endIndex:   number,
 * }}
 */
export function usePagination(items, pageSize = 10) {
   const [page, setPage] = useState(1);

   /* reset to page 1 whenever the list length or page size changes */
   useEffect(() => {
      setPage(1);
   }, [items.length, pageSize]);

   const totalItems = items.length;
   const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

   /* clamp page in case list shrinks */
   const safePage   = Math.min(page, totalPages);

   const startIndex = (safePage - 1) * pageSize;
   const endIndex   = Math.min(startIndex + pageSize, totalItems);

   const pageItems = useMemo(
      () => items.slice(startIndex, endIndex),
      [items, startIndex, endIndex],
   );

   const prevPage = () => setPage(p => Math.max(1, p - 1));
   const nextPage = () => setPage(p => Math.min(totalPages, p + 1));

   return {
      page:       safePage,
      totalPages,
      totalItems,
      pageItems,
      setPage,
      prevPage,
      nextPage,
      startIndex,
      endIndex,
   };
}
