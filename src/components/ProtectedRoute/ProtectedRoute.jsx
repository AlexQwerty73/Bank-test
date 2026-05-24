import { Navigate, Outlet } from 'react-router-dom';
import { loadFromLocalStorage } from '../../utils';

/**
 * Захищений маршрут — якщо користувач не авторизований (немає userId в localStorage),
 * перенаправляє на /login.
 */
export const ProtectedRoute = () => {
   const userId = loadFromLocalStorage('userId');
   return userId ? <Outlet /> : <Navigate to="/login" replace />;
};
