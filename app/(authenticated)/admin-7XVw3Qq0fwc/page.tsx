"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@heroui/modal";
import { 
  MoreVerticalIcon, 
  SearchIcon, 
  UsersIcon, 
  ShieldCheckIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  PlusIcon,
  CheckIcon,
  BanIcon,
  UserCheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "lucide-react";
import { useState, useMemo } from "react";
import { useUserInContext } from "@/providers/User";
import useAdminUsers, { useUserStats } from "@/hooks/useAdminUsers";
import { createUser, updateUser, deleteUser, verifyUser, banUser, unbanUser } from "@/services/admin";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast} from '@heroui/toast'
import AdminGuard from "@/components/AdminGuard";

export default function AdminDashboard() {
  const user = useUserInContext();
 const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | "verify" | "ban" | "unban">("view");
  const [editForm, setEditForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  });

  const { data: usersData, isLoading: usersLoading, error: usersError } = useAdminUsers({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined
  });
  const { data: stats, isLoading: statsLoading } = useUserStats();
  const queryClient = useQueryClient();

  // Check if current user is admin (you might want to add role checking logic)
  if (!user) {
    return <div>Loading...</div>;
  }

  const users = usersData?.users || [];
  const pagination = usersData?.pagination;

  // Mutations
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/users"] });
      addToast({
        description: "User updated successfully",
        color: "success",
      });
      onOpenChange();
    },
    onError: (error) => {
      addToast({
        description: "Failed to update user",
        color: "danger",
      });
      console.error(error);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["admin/users/stats"] });
      addToast({
        description: "User deleted successfully",
        color: "success",
      });
      onOpenChange();
    },
    onError: (error) => {
      addToast({
        description: "Failed to delete user",
        color: "danger",
      });
      console.error(error);
    }
  });

  const verifyUserMutation = useMutation({
    mutationFn: verifyUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["admin/users/stats"] });
      addToast({
        description: "User verified successfully",
        color: "success",
      });
      onOpenChange();
    },
    onError: (error) => {
      addToast({
        description: "Failed to verify user",
        color: "danger",
      });
      console.error(error);
    }
  });

  const banUserMutation = useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["admin/users/stats"] });
      addToast({
        description: "User banned successfully",
        color: "success",
      });
      onOpenChange();
    },
    onError: (error) => {
      addToast({
        description: "Failed to ban user",
        color: "danger",
      });
      console.error(error);
    }
  });

  const unbanUserMutation = useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin/users"] });
      queryClient.invalidateQueries({ queryKey: ["admin/users/stats"] });
      addToast({
        description: "User unbanned successfully",
        color: "success",
      });
      onOpenChange();
    },
    onError: (error) => {
      addToast({
        description: "Failed to unban user",
        color: "danger",
      });
      console.error(error);
    }
  });

  if (usersLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-danger mb-4">Failed to load users</p>
          <Button color="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const handleUserAction = (action: "view" | "edit" | "delete" | "verify" | "ban" | "unban", user: any) => {
    setSelectedUser(user);
    setModalType(action);
    if (action === "edit") {
      setEditForm({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: ""
      });
    }
    onOpen();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const handleEditUser = () => {
    if (selectedUser) {
      updateUserMutation.mutate({
        id: selectedUser.id,
        data: editForm
      });
    }
  };

  const handleVerifyUser = () => {
    if (selectedUser) {
      verifyUserMutation.mutate(selectedUser.id);
    }
  };

  const handleBanUser = () => {
    if (selectedUser) {
      banUserMutation.mutate(selectedUser.id);
    }
  };

  const handleUnbanUser = () => {
    if (selectedUser) {
      unbanUserMutation.mutate(selectedUser.id);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getUserMenuItems = (user: any) => {
    const items: Array<{
      key: string;
      label: string;
      icon: React.ReactElement;
      onPress: () => void;
      className?: string;
      color?: "success" | "default" | "primary" | "secondary" | "warning" | "danger";
    }> = [
      {
        key: "view",
        label: "View Details",
        icon: <EyeIcon className="w-4 h-4" />,
        onPress: () => handleUserAction("view", user)
      }
    ];

    // Only show edit option if user has permission
      items.push({
        key: "edit",
        label: "Edit User",
        icon: <EditIcon className="w-4 h-4" />,
        onPress: () => handleUserAction("edit", user)
      });
  
      items.push({
        key: "verify",
        label: "Verify Email",
        icon: <CheckIcon className="w-4 h-4" />,
        onPress: () => handleUserAction("verify", user)
      });
 
      if (!user.bannedAt) {
        items.push({
          key: "ban",
          label: "Ban User",
          icon: <BanIcon className="w-4 h-4" />,
          onPress: () => handleUserAction("ban", user),
          className: "text-warning"
        });
      } else {
        items.push({
          key: "unban",
          label: "Unban User",
          icon: <UserCheckIcon className="w-4 h-4" />,
          onPress: () => handleUserAction("unban", user),
          className: "text-success"
        });
      }
    

      items.push({
        key: "delete",
        label: "Delete User",
        icon: <TrashIcon className="w-4 h-4" />,
        onPress: () => handleUserAction("delete", user),
        className: "text-danger",
        color: "danger"
      });
    

    return items;
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-foreground/70">
            Manage users and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UsersIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-success/10 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Verified Users</p>
                <p className="text-2xl font-bold">{stats?.verifiedUsers || 0}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-warning/10 rounded-lg">
                <UsersIcon className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Pending Verification</p>
                <p className="text-2xl font-bold">{stats?.pendingVerification || 0}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <ShieldCheckIcon className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-foreground/70">Banned Users</p>
                <p className="text-2xl font-bold">{stats?.bannedUsers || 0}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">User Management</h2>
              <p className="text-sm text-foreground/70">
                Manage registered users and their permissions
              </p>
            </div>
         
              <Button
                color="primary"
                startContent={<PlusIcon className="w-4 h-4" />}
              >
                Add User
              </Button>
          
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  startContent={<SearchIcon className="w-4 h-4" />}
                  className="max-w-sm"
                />
                <div className="flex items-center gap-2">
                  <label className="text-sm text-foreground/70">Per page:</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="p-2 border border-divider rounded-md bg-background"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <Table aria-label="Users table">
                <TableHeader>
                  <TableColumn>NAME</TableColumn>
                  <TableColumn>EMAIL</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>ROLE</TableColumn>
                  <TableColumn>LAST LOGIN</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {user.firstname} {user.lastname}
                          </span>
                          <span className="text-sm text-foreground/70">
                            ID: {user.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Chip
                            color={user.isVerified ? "success" : "warning"}
                            size="sm"
                            variant="flat"
                          >
                            {user.isVerified ? "Verified" : "Pending"}
                          </Chip>
                          {user.bannedAt && (
                            <Chip
                              color="danger"
                              size="sm"
                              variant="flat"
                            >
                              Banned
                            </Chip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={user.role === "admin" ? "primary" : "default"}
                          size="sm"
                          variant="flat"
                        >
                          {user.role}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? (
                          <span className="text-sm">
                            {new Date(user.lastLogin).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-sm text-foreground/50">
                            Never
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                            >
                              <MoreVerticalIcon className="w-4 h-4" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            {getUserMenuItems(user).map((item) => (
                              <DropdownItem
                                key={item.key}
                                startContent={item.icon}
                                onPress={item.onPress}
                                className={item.className}
                                color={item.color as any}
                              >
                                {item.label}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-foreground/70">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      isDisabled={pagination.page === 1}
                      onPress={() => handlePageChange(pagination.page - 1)}
                    >
                      <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                        if (pageNum > pagination.totalPages) return null;
                        
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={pageNum === pagination.page ? "solid" : "light"}
                            color={pageNum === pagination.page ? "primary" : "default"}
                            onPress={() => handlePageChange(pageNum)}
                            className="min-w-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      isDisabled={pagination.page === pagination.totalPages}
                      onPress={() => handlePageChange(pagination.page + 1)}
                    >
                      <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {modalType === "view" && "User Details"}
                {modalType === "edit" && "Edit User"}
                {modalType === "delete" && "Delete User"}
                {modalType === "verify" && "Verify User Email"}
                {modalType === "ban" && "Ban User"}
                {modalType === "unban" && "Unban User"}
              </ModalHeader>
              <ModalBody>
                {modalType === "view" && selectedUser && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-sm text-foreground/70">
                        {selectedUser.firstname} {selectedUser.lastname}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-foreground/70">
                        {selectedUser.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Chip
                        color={selectedUser.isVerified ? "success" : "warning"}
                        size="sm"
                        variant="flat"
                      >
                        {selectedUser.isVerified ? "Verified" : "Pending"}
                      </Chip>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Role</label>
                      <Chip
                        color={selectedUser.role === "admin" ? "primary" : "default"}
                        size="sm"
                        variant="flat"
                      >
                        {selectedUser.role}
                      </Chip>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Created At</label>
                      <p className="text-sm text-foreground/70">
                        {new Date(selectedUser.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Login</label>
                      <p className="text-sm text-foreground/70">
                        {selectedUser.lastLogin 
                          ? new Date(selectedUser.lastLogin).toLocaleDateString()
                          : "Never"
                        }
                      </p>
                    </div>
                    {selectedUser.bannedAt && (
                      <div>
                        <label className="text-sm font-medium">Banned At</label>
                        <p className="text-sm text-danger">
                          {new Date(selectedUser.bannedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedUser.verifiedAt && (
                      <div>
                        <label className="text-sm font-medium">Verified At</label>
                        <p className="text-sm text-foreground/70">
                          {new Date(selectedUser.verifiedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {modalType === "edit" && selectedUser && (
                  <div className="space-y-4">
                    <Input
                      label="First Name"
                      value={editForm.firstname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, firstname: e.target.value }))}
                    />
                    <Input
                      label="Last Name"
                      value={editForm.lastname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, lastname: e.target.value }))}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Leave blank to keep current password"
                      value={editForm.password}
                      onChange={(e) => setEditForm(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                )}

                {modalType === "delete" && selectedUser && (
                  <div className="space-y-4">
                    <p className="text-foreground/70">
                      Are you sure you want to delete user{" "}
                      <span className="font-medium">
                        {selectedUser.firstname} {selectedUser.lastname}
                      </span>{" "}
                      ({selectedUser.email})?
                    </p>
                    <p className="text-sm text-danger">
                      This action cannot be undone.
                    </p>
                  </div>
                )}

                {modalType === "verify" && selectedUser && (
                  <div className="space-y-4">
                    <p className="text-foreground/70">
                      Are you sure you want to verify the email for{" "}
                      <span className="font-medium">
                        {selectedUser.firstname} {selectedUser.lastname}
                      </span>{" "}
                      ({selectedUser.email})?
                    </p>
                    <p className="text-sm text-foreground/70">
                      This will mark the user's email as verified.
                    </p>
                  </div>
                )}

                {modalType === "ban" && selectedUser && (
                  <div className="space-y-4">
                    <p className="text-foreground/70">
                      Are you sure you want to ban user{" "}
                      <span className="font-medium">
                        {selectedUser.firstname} {selectedUser.lastname}
                      </span>{" "}
                      ({selectedUser.email})?
                    </p>
                    <p className="text-sm text-warning">
                      This will prevent the user from accessing their account.
                    </p>
                  </div>
                )}

                {modalType === "unban" && selectedUser && (
                  <div className="space-y-4">
                    <p className="text-foreground/70">
                      Are you sure you want to unban user{" "}
                      <span className="font-medium">
                        {selectedUser.firstname} {selectedUser.lastname}
                      </span>{" "}
                      ({selectedUser.email})?
                    </p>
                    <p className="text-sm text-success">
                      This will restore the user's access to their account.
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                {modalType === "view" && (
                  <Button color="primary" onPress={onClose}>
                    Close
                  </Button>
                )}
                {modalType === "edit" && (
                  <Button 
                    color="primary" 
                    onPress={handleEditUser}
                    isLoading={updateUserMutation.isPending}
                  >
                    Save Changes
                  </Button>
                )}
                {modalType === "delete" && (
                  <Button 
                    color="danger" 
                    onPress={handleDeleteUser}
                    isLoading={deleteUserMutation.isPending}
                  >
                    Delete User
                  </Button>
                )}
                {modalType === "verify" && (
                  <Button 
                    color="success" 
                    onPress={handleVerifyUser}
                    isLoading={verifyUserMutation.isPending}
                  >
                    Verify User
                  </Button>
                )}
                {modalType === "ban" && (
                  <Button 
                    color="warning" 
                    onPress={handleBanUser}
                    isLoading={banUserMutation.isPending}
                  >
                    Ban User
                  </Button>
                )}
                {modalType === "unban" && (
                  <Button 
                    color="success" 
                    onPress={handleUnbanUser}
                    isLoading={unbanUserMutation.isPending}
                  >
                    Unban User
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      </div>
    </AdminGuard>
  );
}
