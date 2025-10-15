import { useUserInContext } from "@/providers/User";

export default function useAdminAccess() {
  const user = useUserInContext();

  const isAdmin = user.isAdmin;
  const isVerified = user?.isVerified;
  const canAccessAdmin = isAdmin && isVerified;

  return {
    user,
    isAdmin,
    isVerified,
    canAccessAdmin,
    isLoading: !user
  };
}
