import { formatDate } from './formatDate';

/**
 * Formats an ISO datetime string as "<date> HH:MM"
 * where <date> respects the app_dateFormat setting.
 */
export const formatDateTime = (dateString) => {
   if (!dateString) return '—';
   const d   = new Date(dateString);
   const hh  = String(d.getHours()).padStart(2, '0');
   const min = String(d.getMinutes()).padStart(2, '0');
   return `${formatDate(dateString)} ${hh}:${min}`;
};
