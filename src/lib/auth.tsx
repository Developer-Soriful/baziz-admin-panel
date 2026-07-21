"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { roles as roleDefs } from "./data";

export interface AdminUser {
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  avatarColor: string;
}

interface DemoAccount {
  email: string;
  password: string;
  name: string;
  roleId: string;
  avatarColor: string;
}

// Demo accounts — one per key platform-admin role
export const demoAccounts: DemoAccount[] = [
  { email: "superadmin@propertera.com", password: "Admin123!", name: "John Carter", roleId: "superadmin", avatarColor: "#7c3aed" },
  { email: "finance@propertera.com", password: "Admin123!", name: "Sofia Reyes", roleId: "finance", avatarColor: "#10b981" },
  { email: "support@propertera.com", password: "Admin123!", name: "Daniel Okafor", roleId: "support", avatarColor: "#007aff" },
  { email: "moderator@propertera.com", password: "Admin123!", name: "Mei Lin", roleId: "moderator", avatarColor: "#f59e0b" },
];

interface AuthContextValue {
  user: AdminUser | null;
  ready: boolean;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  hasPermission: (key: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "propertera_admin_user";

function roleName(roleId: string) {
  return roleDefs.find((r) => r.id === roleId)?.name ?? "Member";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  const login = useCallback((email: string, password: string): string | null => {
    const e = email.trim().toLowerCase();
    const acct = demoAccounts.find((a) => a.email === e);
    if (!acct || acct.password !== password) {
      return "Invalid email or password.";
    }
    const u: AdminUser = {
      name: acct.name,
      email: acct.email,
      roleId: acct.roleId,
      roleName: roleName(acct.roleId),
      avatarColor: acct.avatarColor,
    };
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch {}
    return null;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const hasPermission = useCallback(
    (key: string) => {
      if (!user) return false;
      const role = roleDefs.find((r) => r.id === user.roleId);
      return role?.permissions.includes(key) ?? false;
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
