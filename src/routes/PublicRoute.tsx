import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { getToken } from '../utils/storage';
import { getFromLocalStorage } from '../utils/localStorage';

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const tokenFromRedux = useAppSelector((state) => state.auth.token);
  const tokenFromStorage = getToken() || getFromLocalStorage('accessToken');

  const token = tokenFromRedux || tokenFromStorage;

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
