// Game Server Base URL resolution for Web & Native Capacitor APK
export function getServerBaseUrl(): string {
  const custom = localStorage.getItem('gte_server_url');
  if (custom) {
    return custom.replace(/\/$/, '');
  }

  // Check if a cloud API URL was injected at build time (e.g. Render)
  if (import.meta.env.VITE_API_URL) {
    return (import.meta.env.VITE_API_URL as string).replace(/\/$/, '');
  }

  // Detect if running inside Capacitor Native APK (origin is localhost without Vite port or capacitor://)
  const isCapacitorNative =
    typeof window !== 'undefined' &&
    (window.location.protocol === 'capacitor:' ||
      window.location.protocol === 'file:' ||
      (window.location.hostname === 'localhost' && window.location.port !== '5173'));

  if (isCapacitorNative) {
    return 'https://guess-the-eleven-umyl.onrender.com';
  }

  return '';
}

export function setServerBaseUrl(url: string) {
  if (url) {
    localStorage.setItem('gte_server_url', url.replace(/\/$/, ''));
  } else {
    localStorage.removeItem('gte_server_url');
  }
}

export function getApiBase(): string {
  const base = getServerBaseUrl();
  return base ? `${base}/api` : '/api';
}

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
  const apiBase = getApiBase();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err: any) {
    throw new ApiError(
      `Cannot connect to game server at ${apiBase || 'localhost'}. Make sure the server is running and your phone is on the same Wi-Fi.`,
      0
    );
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new ApiError(
      `Game server returned non-JSON response from ${apiBase}${endpoint}. Check server address in settings.`,
      response.status || 500
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || (data && data.success === false)) {
    // If token expired, attempt refresh
    if (response.status === 401 && !endpoint.includes('/auth/')) {
      const refreshToken = localStorage.getItem('gte_refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${apiBase}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData?.data?.tokens?.accessToken) {
              localStorage.setItem('gte_access_token', refreshData.data.tokens.accessToken);
              localStorage.setItem('gte_refresh_token', refreshData.data.tokens.refreshToken);

              // Retry original request
              headers['Authorization'] = `Bearer ${refreshData.data.tokens.accessToken}`;
              const retryRes = await fetch(`${apiBase}${endpoint}`, {
                ...options,
                headers,
              });
              const retryData = await retryRes.json();
              if (retryRes.ok) return retryData;
            }
          }
        } catch (e) {
          localStorage.removeItem('gte_access_token');
          localStorage.removeItem('gte_refresh_token');
          localStorage.removeItem('gte_user');
        }
      }
    }

    throw new ApiError(
      data.message || 'Invalid server response. Please verify credentials or server connection.',
      response.status || 400,
      data.errors
    );
  }

  if (data && typeof data === 'object' && !('data' in data) && !('success' in data)) {
    throw new ApiError('Unexpected server response format.', 500);
  }

  return data;
}
