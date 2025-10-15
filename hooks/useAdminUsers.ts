import { formatApiError } from "@/misc/errors";
import { getUsers, getUserStats, GetUsersParams } from "@/services/admin";
import { useQuery } from "@tanstack/react-query";

export default function useAdminUsers(params?: GetUsersParams) {
  const { error, isLoading, data } = useQuery({
    queryKey: ["admin/users", params],
    queryFn() {
      return getUsers(params);
    },
  });

  return { 
    data: data?.data, 
    isLoading, 
    error: formatApiError(error) 
  };
}

export function useUserStats() {
  const { error, isLoading, data } = useQuery({
    queryKey: ["admin/users/stats"],
    queryFn() {
      return getUserStats();
    },
  });

  return { 
    data: data?.data, 
    isLoading, 
    error: formatApiError(error) 
  };
}
