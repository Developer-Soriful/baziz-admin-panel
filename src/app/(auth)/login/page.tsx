"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth, demoAccounts } from "@/lib/auth";
import { roles } from "@/lib/data";
import { Button } from "@/components/ui/primitives";
import { Field, Input } from "@/components/ui/form";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("owner@propertera.com");
  const [password, setPassword] = useState("Admin123!");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const err = login(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        router.push("/dashboard");
      }
    }, 500);
  };

  const quickLogin = (acctEmail: string) => {
    setEmail(acctEmail);
    setPassword("Admin123!");
    setError(null);
    setLoading(true);
    setTimeout(() => {
      login(acctEmail, "Admin123!");
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="animate-in">
      <div className="mb-8 lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-base font-black text-white">
            P
          </span>
          <span className="text-lg font-extrabold">Propertera Admin</span>
        </div>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm text-text-muted">
        Sign in to the Propertera administration console.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Email address">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            icon={<Mail className="h-4 w-4" />}
            autoComplete="email"
            required
          />
        </Field>

        <Field label="Password">
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-faint">
              <Lock className="h-4 w-4" />
            </span>
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-base px-10"
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-text-muted">
            <input type="checkbox" className="h-4 w-4 rounded border-border-strong accent-primary" defaultChecked />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {error && (
          <div className="rounded-xl bg-danger/10 px-3.5 py-2.5 text-sm font-medium text-danger">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign in <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      {/* Role-based quick login */}
      <div className="mt-8">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-wider text-text-faint">
            Demo roles
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          {demoAccounts.map((a) => {
            const role = roles.find((r) => r.id === a.roleId)!;
            return (
              <button
                key={a.email}
                onClick={() => quickLogin(a.email)}
                className={cn(
                  "group flex items-center gap-2.5 rounded-xl border border-border bg-surface p-3 text-left transition-all hover:border-primary hover:shadow-sm"
                )}
              >
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black text-white"
                  style={{ background: role.color }}
                >
                  {role.name[0]}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold">{role.name}</p>
                  <p className="truncate text-[11px] text-text-muted">{a.email}</p>
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs text-text-faint">
          Password for all demo accounts: <span className="font-semibold">Admin123!</span>
        </p>
      </div>
    </div>
  );
}
