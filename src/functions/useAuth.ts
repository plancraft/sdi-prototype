import { useState } from 'react';
import { useAtom } from 'jotai';
import { AuthRepository } from '../repositories/auth.repository';
import { authTokenAtom } from '../store/auth';
import { saveToken } from '../lib/auth';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, setAuthToken] = useAtom(authTokenAtom);

  const repository = new AuthRepository();

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const token = await repository.login(email, password);
      if (!saveToken(token)) {
        throw new Error('Failed to save authentication token');
      }
      setAuthToken(token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
      setAuthToken(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}