import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { useMemo } from 'react';

// Optimized Axios Instance
export const axiosInstance = axios.create({
  baseURL: 'https://admin.brendoo.com/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache for user info
let userInfoCache: {
  data: any;
  token: string | null;
  timestamp: number;
} | null = null;

const USER_CACHE_DURATION = 30000; // 30 seconds

// Fast user info getter
const getUserInfo = () => {
  const now = Date.now();

  if (userInfoCache && (now - userInfoCache.timestamp) < USER_CACHE_DURATION) {
    return userInfoCache;
  }

  try {
    const userStr = localStorage.getItem('user-info');
    const parsed = userStr ? JSON.parse(userStr) : null;

    userInfoCache = {
      data: parsed,
      token: parsed?.token || null,
      timestamp: now
    };

    return userInfoCache;
  } catch (error) {
    userInfoCache = { data: null, token: null, timestamp: now };
    return userInfoCache;
  }
};

// Check if endpoint is protected
const isProtectedEndpoint = (api: string): boolean => {
  return api.includes('/favorites') ||
      api.includes('/basket_items') ||
      api.includes('/orders') ||
      api.includes('/user');
};

// Main GETRequest hook
export default function GETRequest<T>(
    api: string,
    querykey: string,
    dependencies: any[] = [],
    params?: Record<string, any>
) {
  const { lang = 'ru' } = useParams<{ lang: string }>();

  const isProtected = useMemo(() => isProtectedEndpoint(api), [api]);
  const userInfo = useMemo(() => getUserInfo(), []);
  const shouldSkipQuery = useMemo(() =>
          isProtected && !userInfo.token,
      [isProtected, userInfo.token]
  );

  const { data, isLoading, isError, refetch, isFetching } = useQuery<T>({
    queryKey: [querykey, ...dependencies, params],
    queryFn: async () => {
      if (shouldSkipQuery) {
        return null as unknown as T;
      }

      try {
        const response = await axiosInstance.get<T>(api, {
          headers: {
            'Accept-Language': lang,
            ...(userInfo.token && { Authorization: `Bearer ${userInfo.token}` }),
          },
          params,
        });

        return response.data;
      } catch (error) {
        console.warn(`API Error [${querykey}]:`, error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status && status >= 400 && status < 500) {
          return false; // Don't retry 4xx errors
        }
      }
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
    enabled: !shouldSkipQuery,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    data: shouldSkipQuery ? (null as unknown as T) : data,
    isLoading: !shouldSkipQuery && isLoading,
    isError,
    isSkipped: shouldSkipQuery,
    refetch,
    isFetching,
  };
}

// Fast request hook for critical data
export function useFastRequest<T>(
    api: string,
    querykey: string,
    dependencies: any[] = [],
    params?: Record<string, any>
) {
  const { lang = 'ru' } = useParams<{ lang: string }>();
  const userInfo = getUserInfo();

  return useQuery<T>({
    queryKey: [querykey, ...dependencies, params],
    queryFn: async () => {
      const response = await axiosInstance.get<T>(api, {
        headers: {
          'Accept-Language': lang,
          ...(userInfo.token && { Authorization: `Bearer ${userInfo.token}` }),
        },
        params,
      });
      return response.data;
    },
    staleTime: 30000, // 30 seconds
    gcTime: 60000, // 1 minute
    retry: 1,
    refetchOnMount: true,
  });
}

// Mutation helper
export const createMutation = (
    method: 'post' | 'put' | 'delete' | 'patch',
    api: string
) => {
  return async (data?: any) => {
    const userInfo = getUserInfo();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (userInfo.token) {
      headers.Authorization = `Bearer ${userInfo.token}`;
    }

    const response = await axiosInstance[method](api, data, { headers });
    return response.data;
  };
};

// Clear user cache utility
export const clearUserCache = () => {
  userInfoCache = null;
};