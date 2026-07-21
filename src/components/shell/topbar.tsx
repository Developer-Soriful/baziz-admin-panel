"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Moon, Sun, Bell, Search, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Avatar } from "@/components/ui/primitives";
import { recentActivity } from "@/lib/data";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-text-muted hover:bg-surface-2 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
        <input
          placeholder="Search properties, tenants, payments..."
          className="input-base h-10 pl-10"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={toggle}
          className="rounded-xl p-2.5 text-text-muted transition hover:bg-surface-2 hover:text-text"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative rounded-xl p-2.5 text-text-muted transition hover:bg-surface-2 hover:text-text"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-surface" />
          </button>
          {notifOpen && (
            <div className="animate-in absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-float">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-bold">Notifications</p>
              </div>
              <div className="max-h-80 divide-y divide-border overflow-y-auto">
                {recentActivity.map((a) => (
                  <div key={a.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{a.who}</p>
                      <p className="text-xs text-text-muted">{a.action}</p>
                      <p className="mt-0.5 text-[11px] text-text-faint">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-surface-2"
          >
            <Avatar name={user?.name ?? "User"} color={user?.avatarColor} size={34} />
            <div className="hidden text-left sm:block">
              <p className="text-[13px] font-bold leading-tight">{user?.name}</p>
              <p className="text-[11px] text-text-muted">{user?.roleName}</p>
            </div>
            <ChevronDown className="hidden h-4 w-4 text-text-faint sm:block" />
          </button>
          {menuOpen && (
            <div className="animate-in absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-surface shadow-float">
              <div className="border-b border-border px-4 py-3">
                <p className="truncate text-sm font-bold">{user?.name}</p>
                <p className="truncate text-xs text-text-muted">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2.5 px-4 py-3 text-sm font-semibold text-danger transition hover:bg-danger/8"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
