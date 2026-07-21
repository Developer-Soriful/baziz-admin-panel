"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups, bottomNav } from "@/lib/nav-config";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { hasPermission } = useAuth();

  const canSee = (perm?: string) => !perm || hasPermission(perm);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col bg-sidebar text-sidebar-text transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={onClose}>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-base font-black text-white shadow-[var(--shadow-glow)]">
              P
            </span>
            <div className="leading-tight">
              <p className="text-[15px] font-extrabold text-white">Propertera</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted">
                Admin Console
              </p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-sidebar-muted hover:bg-white/5 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-3">
          {navGroups.map((group) => {
            const items = group.items.filter((i) => canSee(i.permission));
            if (!items.length) return null;
            return (
              <div key={group.title}>
                <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-sidebar-muted">
                  {group.title}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const active =
                      pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                          active
                            ? "bg-primary text-white shadow-[var(--shadow-glow)]"
                            : "text-sidebar-text/80 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px] shrink-0" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-white/10 px-3 py-3">
          {bottomNav.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-sidebar-text/80 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </aside>
    </>
  );
}
