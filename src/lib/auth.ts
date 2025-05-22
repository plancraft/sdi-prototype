import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

interface JWTPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

export function saveToken(token: string) {
  try {
    // Decode token to get expiration
    const decoded = jwtDecode<JWTPayload>(token);
    const expiryDate = new Date(decoded.exp * 1000); // Convert UNIX timestamp to Date
    
    // Store token and expiry
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
    
    return true;
  } catch (error) {
    console.error('Error saving token:', error);
    return false;
  }
}

export function getToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return null;
    }
    
    // Check if token has expired
    const expiryDate = new Date(expiry);
    if (expiryDate <= new Date()) {
      removeToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

export function isTokenExpired(): boolean {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiry) return true;
  
  const expiryDate = new Date(expiry);
  return expiryDate <= new Date();
}

export function getTokenExpiryTime(): Date | null {
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
  return expiry ? new Date(expiry) : null;
}