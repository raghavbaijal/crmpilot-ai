import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5678';

export const apiClient = axios.create({
  baseURL,
  timeout: 30000, // 30-second request timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized error formatter
export interface APIErrorResponse {
  message: string;
  status?: number;
  originalError: any;
}

export function formatAPIError(error: any): APIErrorResponse {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;
    let message = 'An error occurred while communicating with the AI server.';
    
    if (data && typeof data === 'object') {
      message = data.message || data.error || JSON.stringify(data);
    } else if (data && typeof data === 'string') {
      message = data;
    } else if (error.message) {
      message = error.message;
    }

    if (error.code === 'ECONNABORTED') {
      message = 'Request timed out. The server took too long to respond.';
    } else if (!error.response) {
      message = 'Network error. Please check your internet connection.';
    }

    return {
      message,
      status,
      originalError: error,
    };
  }

  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    originalError: error,
  };
}

// Request interceptor for development logging
apiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        payload: config.data,
      });
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(formatAPIError(error));
  }
);

// Response interceptor for development logging
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} status: ${response.status}`, {
        body: response.data,
      });
    }
    return response;
  },
  (error) => {
    const formattedError = formatAPIError(error);
    if (import.meta.env.DEV) {
      console.error(`[API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`, formattedError);
    }
    return Promise.reject(formattedError);
  }
);

export default apiClient;
