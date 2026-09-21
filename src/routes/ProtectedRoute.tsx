import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getToken } from '../utils/storage';
import { getFromLocalStorage } from '../utils/localStorage';
import { isTokenValid, clearAuthSession } from '../utils/auth';
import { logout } from '../features/auth/authSlice';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Redux token is the primary source of truth (set immediately on login dispatch)
  const tokenFromRedux = useAppSelector((state) => state.auth.token);
  // localStorage as secondary fallback (for page refresh scenarios)
  const tokenFromStorage = getToken() || getFromLocalStorage('accessToken');
  const token = tokenFromRedux || tokenFromStorage;

  // Only run the validity check on stale storage tokens (not freshly dispatched ones)
  // This prevents wiping a valid token that was JUST set during login navigation
  const isStaleStorageToken = !tokenFromRedux && !!tokenFromStorage;
  const isExpired = isStaleStorageToken && !isTokenValid(tokenFromStorage);

  useEffect(() => {
    // Clean up only after render to avoid sync side effects during navigation
    if (isExpired && tokenFromStorage) {
      dispatch(logout());
      clearAuthSession();
    }
  }, [isExpired, tokenFromStorage, dispatch]);

  if (!token || isExpired) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
