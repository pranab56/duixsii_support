import { getToken, removeToken } from './storage';
import { removeFromLocalStorage, getFromLocalStorage } from './localStorage';

export interface DecodedTokenPayload {
  exp?: number;
  iat?: number;
  role?: string;
  id?: string;
  _id?: string;
  userId?: string;
  email?: string;
  [key: string]: unknown;
}

/**
 * Safely decodes a JWT token without external libraries
 */
export const decodeJwt = (token: string): DecodedTokenPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload) as DecodedTokenPayload;
  } catch {
    return null;
  }
};

/**
 * Checks if a token exists, is well-formed, and is not expired
 */
export const isTokenValid = (token: string | null | undefined): boolean => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const cleanToken = token.trim();
  if (
    cleanToken === '' ||
    cleanToken === 'undefined' ||
    cleanToken === 'null' ||
    cleanToken === '[object Object]'
  ) {
    return false;
  }

  const parts = cleanToken.split('.');
  // If it looks like a JWT (3 parts), try to decode and check expiry
  if (parts.length === 3) {
    const decoded = decodeJwt(cleanToken);
    // Only reject if we CAN decode AND the token is definitively expired
    // If decode fails, trust the token — the server will reject it with 401 if invalid
    if (decoded && typeof decoded.exp === 'number') {
      return decoded.exp * 1000 > Date.now();
    }
    // Could not decode or no exp claim — treat as valid (non-empty, JWT-shaped)
    return true;
  }

  // Opaque token (not JWT-shaped) — accept as long as it's non-empty
  return cleanToken.length > 10;
};

/**
 * Completely clears all authentication state from storage and cookies
 */
export const clearAuthSession = (): void => {
  try {
    removeToken();
    removeFromLocalStorage('accessToken');
    removeFromLocalStorage('refreshToken');
    removeFromLocalStorage('userData');
    removeFromLocalStorage('role');
    removeFromLocalStorage('userRole');
    removeFromLocalStorage('permissions');
    removeFromLocalStorage('forgetToken');
    removeFromLocalStorage('email');
    if (typeof document !== 'undefined') {
      document.cookie = 'douxsii-support-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'douxsii-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  } catch (err) {
    console.error('Error clearing auth session:', err);
  }
};

/**
 * Retrieves valid token or cleans stale token
 */
export const getValidAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const token = getToken() || getFromLocalStorage('accessToken');
  if (!isTokenValid(token)) {
    if (token) {
      clearAuthSession();
    }
    return null;
  }
  return token;
};
