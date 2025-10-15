import { useUserInContext } from "@/providers/User";
import { AdminPermission, ADMIN_ROLES } from "@/types/admin";

export default function useAdminPermissions() {
  const user = useUserInContext();

  const hasPermission = (permission: AdminPermission): boolean => {
    if (!user || user.role !== "admin") {
      return false;
    }

    // For now, all admins have all permissions
    // In the future, you can implement role-based permissions
    const adminRole = user.adminRole || "admin";
    const role = ADMIN_ROLES[adminRole];
    
    return role?.permissions.includes(permission) ?? false;
  };

  const hasAnyPermission = (permissions: AdminPermission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: AdminPermission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canManageUsers = (): boolean => {
    return hasAnyPermission([
      "users.read",
      "users.create", 
      "users.update",
      "users.delete"
    ]);
  };

  const canModerateUsers = (): boolean => {
    return hasAnyPermission([
      "users.verify",
      "users.ban", 
      "users.unban"
    ]);
  };

  const canAccessSystemSettings = (): boolean => {
    return hasPermission("system.settings");
  };

  const canViewLogs = (): boolean => {
    return hasPermission("system.logs");
  };

  const canViewAnalytics = (): boolean => {
    return hasPermission("system.analytics");
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canManageUsers,
    canModerateUsers,
    canAccessSystemSettings,
    canViewLogs,
    canViewAnalytics,
    user,
    isAdmin: user?.role === "admin",
    isVerified: user?.isVerified
  };
}
