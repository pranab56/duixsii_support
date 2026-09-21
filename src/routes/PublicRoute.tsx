import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { getToken } from '../utils/storage';
import { getFromLocalStorage } from '../utils/localStorage';
import { isTokenValid } from '../utils/auth';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  // Redux token is the primary source of truth (set immediately on login dispatch)
  const tokenFromRedux = useAppSelector((state) => state.auth.token);
  // localStorage as fallback for page refresh
  const tokenFromStorage = getToken() || getFromLocalStorage('accessToken');

  // Authenticated if Redux has a token (fresh login) OR storage has a valid-looking token
  const isAuthenticated = !!tokenFromRedux || isTokenValid(tokenFromStorage);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
