import { useState } from 'react';
import { registerRequest } from '@/features/auth/services/authService';
import type { RegisterCredentials, RegisterResponseDto } from '@/features/auth/types';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const register = async (credentials: RegisterCredentials): Promise<RegisterResponseDto> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await registerRequest(credentials);
      setIsRegistered(true);
      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'No se pudo registrar';
      setError(message);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error, isRegistered };
}
