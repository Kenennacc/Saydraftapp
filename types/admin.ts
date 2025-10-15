export type AdminPermission = 
  | "users.read"
  | "users.create"
  | "users.update"
  | "users.delete"
  | "users.verify"
  | "users.ban"
  | "users.unban"
  | "system.settings"
  | "system.logs"
  | "system.analytics";

export type AdminRole = {
  name: string;
  permissions: AdminPermission[];
  description: string;
};

export const ADMIN_ROLES: Record<string, AdminRole> = {
  super_admin: {
    name: "Super Admin",
    permissions: [
      "users.read",
      "users.create", 
      "users.update",
      "users.delete",
      "users.verify",
      "users.ban",
      "users.unban",
      "system.settings",
      "system.logs",
      "system.analytics"
    ],
    description: "Full access to all admin features"
  },
  admin: {
    name: "Admin",
    permissions: [
      "users.read",
      "users.create",
      "users.update", 
      "users.verify",
      "users.ban",
      "users.unban"
    ],
    description: "User management and moderation"
  },
  moderator: {
    name: "Moderator", 
    permissions: [
      "users.read",
      "users.verify",
      "users.ban",
      "users.unban"
    ],
    description: "User verification and moderation only"
  }
};

export type AdminUser = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  timezone: string;
  isVerified: boolean;
  verifiedAt?: string;
  bannedAt?: string;
  role: "admin" | "user";
  adminRole?: keyof typeof ADMIN_ROLES;
  createdAt: string;
  lastLogin?: string;
};
