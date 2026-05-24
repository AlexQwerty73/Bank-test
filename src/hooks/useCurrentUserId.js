import { loadFromLocalStorage } from '../utils';

/**
 * Повертає userId поточного авторизованого користувача з localStorage.
 * Повертає null якщо користувач не авторизований.
 */
export const useCurrentUserId = () => {
   return loadFromLocalStorage('userId');
};
