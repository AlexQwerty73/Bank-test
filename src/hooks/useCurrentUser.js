import { useGetUsersQuery } from '../store';
import { useCurrentUserId } from './useCurrentUserId';

/**
 * Завантажує дані поточного авторизованого користувача.
 * Пропускає запит якщо userId відсутній.
 */
export const useCurrentUser = () => {
   const userId = useCurrentUserId();
   const { data: user, isLoading, error } = useGetUsersQuery(userId, {
      skip: !userId,
   });
   return { user, isLoading, error, userId };
};
