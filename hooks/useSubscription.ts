import { getSubscriptionStatus } from '@/services/subscription';
import { useQuery } from '@tanstack/react-query';

export default function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: getSubscriptionStatus,
    staleTime: 5 * 60 * 1000,
  });
}
