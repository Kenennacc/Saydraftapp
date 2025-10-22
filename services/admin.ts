import client from "./client";

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
  createdAt: string;
  lastLogin?: string;
  subscription?: {
    id: string;
    plan: "free" | "paid";
    status: "active" | "canceled" | "past_due" | "unpaid" | "trialing" | "incomplete" | "incomplete_expired";
  } | null;
};

export type CreateUser = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role?: "admin" | "user";
};

export type UpdateUser = {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
};

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type PaginatedUsersResponse = {
  users: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UserStats = {
  totalUsers: number;
  verifiedUsers: number;
  pendingVerification: number;
  adminUsers: number;
  bannedUsers: number;
};

// Get all users with pagination and search
export const getUsers = (params?: GetUsersParams) => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.search) searchParams.append("search", params.search);
  
  const queryString = searchParams.toString();
  const url = queryString ? `/admin/users?${queryString}` : "/admin/users";
  
  return client.get<any, { data: PaginatedUsersResponse }>(url);
};

// Get user by ID
export const getUser = (id: string) => {
  return client.get<any, { data: AdminUser }>(`/admin/users/${id}`);
};

// Create new user
export const createUser = (payload: CreateUser) => {
  return client.post<any, { data: AdminUser }, CreateUser>("/admin/users", payload);
};

// Update user
export const updateUser = (id: string, payload: UpdateUser) => {
  return client.patch<any, { data: AdminUser }, UpdateUser>(`/admin/users/${id}`, payload);
};

// Delete user
export const deleteUser = (id: string) => {
  return client.delete(`/admin/users/${id}`);
};

// Verify user email
export const verifyUser = (id: string) => {
  return client.post<any, { data: AdminUser }>(`/admin/users/${id}/verify`);
};

// Ban user
export const banUser = (id: string) => {
  return client.post<any, { data: AdminUser }>(`/admin/users/${id}/ban`);
};

// Unban user
export const unbanUser = (id: string) => {
  return client.post<any, { data: AdminUser }>(`/admin/users/${id}/unban`);
};

// Get user statistics
export const getUserStats = () => {
  return client.get<any, { data: UserStats }>("/admin/users/stats");
};
