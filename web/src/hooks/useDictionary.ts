import { useQuery } from '@tanstack/react-query';
import { ApiError, lookup, type LookupResponse } from '../api';

export function useLookup(query: string) {
  const trimmed = query.trim();
  return useQuery<LookupResponse, ApiError>({
    queryKey: ['dictionary', trimmed.toLowerCase()],
    queryFn: () => lookup(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on 404 (word not found)
      if (error.status === 404) return false;
      return failureCount < 2;
    },
  });
}
