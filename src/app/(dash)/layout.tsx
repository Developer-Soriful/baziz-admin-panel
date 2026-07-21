"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Sidebar } from "@/components/shell/sidebar";
import { Topbar } from "@/components/shell/topbar";

export default function DashLayout({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="lg:pl-[264px]">
        <Topbar onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
