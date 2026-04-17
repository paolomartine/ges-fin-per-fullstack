import { API_URL } from '@/config/env';

export type ApiError = {
  name: 'ApiError';
  status: number;
  message: string;
};

function createApiError(status: number, message: string): ApiError {
  return { name: 'ApiError', status, message };
}

export function isApiError(e: unknown): e is ApiError {
  return typeof e === 'object' && e !== null && (e as ApiError).name === 'ApiError';
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw createApiError(response.status, (body as { message?: string }).message ?? 'Error en la solicitud');
  }

  return response.json() as Promise<T>;
}

export const httpClient = { request };
