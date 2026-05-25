const getDateFmt = () => {
   try { return JSON.parse(localStorage.getItem('app_dateFormat') ?? 'null') ?? 'DMY'; }
   catch { return 'DMY'; }
};

/**
 * Formats an ISO date string based on the app_dateFormat setting:
 *   DMY → DD/MM/YYYY  (default)
 *   MDY → MM/DD/YYYY
 *   YMD → YYYY-MM-DD
 */
export const formatDate = (dateString) => {
   if (!dateString) return '—';
   const d    = new Date(dateString);
   const dd   = String(d.getDate()).padStart(2, '0');
   const mm   = String(d.getMonth() + 1).padStart(2, '0');
   const yyyy = d.getFullYear();
   switch (getDateFmt()) {
      case 'MDY': return `${mm}/${dd}/${yyyy}`;
      case 'YMD': return `${yyyy}-${mm}-${dd}`;
      default:    return `${dd}/${mm}/${yyyy}`;
   }
};
