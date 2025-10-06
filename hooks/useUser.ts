import { formatApiError } from "@/misc/errors";
import { user } from "@/services/auth";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const { error, isLoading, data } = useQuery({
    queryKey: ["auth/user"],
    queryFn() {
      return user();
    },
  });

  return { data: data?.data, isLoading, error: formatApiError(error) };
}
