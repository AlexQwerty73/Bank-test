/**
 * Shared localStorage settings helpers.
 * Keys are stored as `app_${key}` to namespace app preferences.
 */

export const getSetting = (key, fallback) => {
   try {
      return JSON.parse(localStorage.getItem(`app_${key}`) ?? 'null') ?? fallback;
   } catch {
      return fallback;
   }
};

export const setSetting = (key, val) =>
   localStorage.setItem(`app_${key}`, JSON.stringify(val));
