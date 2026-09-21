/**
 * Client-side route protection middleware for React + Vite SPA.
 *
 * This file exports helper utilities used by ProtectedRoute and PublicRoute.
 * All actual route enforcement is done in:
 *  - src/routes/ProtectedRoute.tsx
 *  - src/routes/PublicRoute.tsx
 */

import { isTokenValid, clearAuthSession } from './utils/auth';
import { getToken } from './utils/storage';
import { getFromLocalStorage } from './utils/localStorage';

export interface AuthStatus {
    isAuthenticated: boolean;
    token: string | null;
}

/**
 * Synchronously checks whether the current user is authenticated.
 * Returns the token if valid, or null if missing / expired / garbage.
 * Also purges stale tokens so they don't linger in storage.
 */
export const checkAuthStatus = (): AuthStatus => {
    if (typeof window === 'undefined') {
        return { isAuthenticated: false, token: null };
    }

    const token = getToken() || getFromLocalStorage('accessToken');
    const isValid = isTokenValid(token);

    if (!isValid) {
        if (token) {
            clearAuthSession();
        }
        return { isAuthenticated: false, token: null };
    }

    return { isAuthenticated: true, token };
};

export default checkAuthStatus;
