import { httpClient } from '@/lib/httpClient';
import type { LoginCredentials, LoginResponseDto, RegisterCredentials, RegisterResponseDto } from '@/features/auth/types';

export function loginRequest(credentials: LoginCredentials): Promise<LoginResponseDto> {
  return httpClient.request<LoginResponseDto>('/api/usuarios/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function registerRequest(credentials: RegisterCredentials): Promise<RegisterResponseDto> {
  return httpClient.request<RegisterResponseDto>('/api/usuarios/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
