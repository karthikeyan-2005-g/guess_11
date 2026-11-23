const API_BASE = '/api';

export class ApiError extends Error {
  statusCode: number;
  errors?: any[];

  constructor(message: string, statusCode: number = 500, errors?: any[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('gte_access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // If token expired, attempt refresh
    if (response.status === 401 && !endpoint.includes('/auth/')) {
      const refreshToken = localStorage.getItem('gte_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            localStorage.setItem('gte_access_token', refreshData.data.tokens.accessToken);
            localStorage.setItem('gte_refresh_token', refreshData.data.tokens.refreshToken);

            // Retry original request
            headers['Authorization'] = `Bearer ${refreshData.data.tokens.accessToken}`;
            const retryRes = await fetch(`${API_BASE}${endpoint}`, {
              ...options,
              headers,
            });
            const retryData = await retryRes.json();
            if (retryRes.ok) return retryData;
          }
        } catch (e) {
          // Clear session on refresh failure
          localStorage.removeItem('gte_access_token');
          localStorage.removeItem('gte_refresh_token');
          localStorage.removeItem('gte_user');
        }
      }
    }

    throw new ApiError(
      data.message || 'Something went wrong',
      response.status,
      data.errors
    );
  }

  return data;
}
