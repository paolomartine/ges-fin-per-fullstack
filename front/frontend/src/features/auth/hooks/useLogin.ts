import { useState } from 'react';
import { loginRequest } from '@/features/auth/services/authService';
import type { LoginCredentials, LoginResponseDto } from '@/features/auth/types';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials): Promise<LoginResponseDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await loginRequest(credentials);
      return session;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No se pudo iniciar sesión';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
