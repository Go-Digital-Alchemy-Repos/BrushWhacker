import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AdminRole } from "@shared/schema";

interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
}

export function useAdminAuth() {
  const { data, isLoading, error } = useQuery<{ user: AdminUser } | null>({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      const res = await fetch("/api/admin/me", { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to check auth");
      return res.json();
    },
    retry: false,
    staleTime: 30000,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/admin/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
    },
  });

  const user = data?.user || null;

  function hasRole(allowedRoles: AdminRole[]): boolean {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  }

  function canAccessCms(): boolean {
    return hasRole(["super_admin", "admin", "editor"]);
  }

  function canAccessCrm(): boolean {
    return hasRole(["super_admin", "admin", "sales"]);
  }

  function canAccessBranding(): boolean {
    return hasRole(["super_admin", "admin"]);
  }

  function canManageUsers(): boolean {
    return hasRole(["super_admin"]);
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    hasRole,
    canAccessCms,
    canAccessCrm,
    canAccessBranding,
    canManageUsers,
  };
}
