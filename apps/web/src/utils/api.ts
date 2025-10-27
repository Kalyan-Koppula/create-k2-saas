/// <reference types="vite/client" />

/**
 * API configuration and utilities
 */

const config = {
  apiUrl: import.meta.env.VITE_API_URL,
  apiProxy: import.meta.env.VITE_API_PROXY,
  isDevelopment: import.meta.env.DEV,
} as const;

// Log config in development
if (import.meta.env.DEV) {
  console.log('API Config:', {
    apiUrl: config.apiUrl,
    apiProxy: config.apiProxy,
    isDevelopment: config.isDevelopment
  });
}

/**
 * Get the full URL for an API endpoint
 * In development: Returns the proxy path (/api/endpoint)
 * In production: Returns the full URL (https://api.domain.com/endpoint)
 */
export function getApiUrl(endpoint: string): string {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

  // In development, use the proxy
  if (config.isDevelopment) {
    return `${config.apiProxy}/${cleanEndpoint}`;
  }

  // In production/staging, use the full URL
  return `${config.apiUrl}/${cleanEndpoint}`;
}

/**
 * Common fetch options for API calls
 */
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // For cookies/auth if needed
};

/**
 * Basic API client with error handling
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  const response = await fetch(url, {
    ...defaultFetchOptions,
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data as T;
}