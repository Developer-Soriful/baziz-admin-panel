"use client";

import { useState } from "react";
import { User, Bell, Palette, CreditCard, Globe, RefreshCw, ShieldAlert, Check } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Button, Toggle, Avatar } from "@/components/ui/primitives";
import { Field, Input, Select } from "@/components/ui/form";
import { ConfirmDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <Card className="p-5">
      <h3 className="mb-4 flex items-center gap-2 text-base font-bold"><Icon className="h-4 w-4 text-primary" /> {title}</h3>
      {children}
    </Card>
  );
}
function ToggleRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div><p className="text-sm font-semibold">{label}</p>{hint && <p className="text-xs text-text-muted">{hint}</p>}</div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function SettingsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [notif, setNotif] = useState({ email: true, push: true, sms: false });
  const [locationSvc, setLocationSvc] = useState(true);
  const [autoSync, setAutoSync] = useState(false);
  const [lang, setLang] = useState("en");
  const [plan, setPlan] = useState<"Free" | "Pro">("Free");
  const [del, setDel] = useState(false);

  return (
    <div className="animate-in">
      <PageHeader title="Settings" subtitle="App preferences and configuration" actions={<Button onClick={() => toast("Settings saved successfully!")}>Save Settings</Button>} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Section icon={User} title="Account">
          <div className="mb-4 flex items-center gap-3">
            <Avatar name={user?.name ?? "U"} color={user?.avatarColor} size={52} />
            <div><p className="font-bold">{user?.name}</p><p className="text-sm text-text-muted">{user?.roleName}</p></div>
          </div>
          <div className="space-y-3">
            <Field label="Full Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          </div>
        </Section>

        <Section icon={Palette} title="Preferences">
          <ToggleRow label="Dark Theme" hint="Switch between light and dark mode" checked={theme === "dark"} onChange={toggle} />
          <div className="border-t border-border" />
          <ToggleRow label="Location Services" hint="Show property locations on maps" checked={locationSvc} onChange={setLocationSvc} />
          <ToggleRow label="Auto Sync" hint="Automatically sync data in the background" checked={autoSync} onChange={setAutoSync} />
          <div className="pt-2.5">
            <Field label="Language">
              <Select value={lang} onChange={(e) => { setLang(e.target.value); toast("Language updated!"); }}>
                <option value="en">English (UK)</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </Select>
            </Field>
          </div>
        </Section>

        <Section icon={Bell} title="Notifications">
          <ToggleRow label="Email Notifications" checked={notif.email} onChange={(v) => setNotif({ ...notif, email: v })} />
          <ToggleRow label="Push Notifications" checked={notif.push} onChange={(v) => setNotif({ ...notif, push: v })} />
          <ToggleRow label="SMS Notifications" checked={notif.sms} onChange={(v) => setNotif({ ...notif, sms: v })} />
        </Section>

        <Section icon={CreditCard} title="Billing & Plan">
          <div className="grid grid-cols-2 gap-3">
            {([
              { id: "Free", price: "£0/mo", features: ["Up to 3 properties", "Basic reports"] },
              { id: "Pro", price: "£19.99/mo", features: ["Unlimited properties", "Advanced AI insights", "Tax reports"] },
            ] as const).map((pl) => (
              <button key={pl.id} onClick={() => setPlan(pl.id)} className={cn("rounded-xl border-2 p-4 text-left transition", plan === pl.id ? "border-primary bg-primary/5" : "border-border")}>
                <div className="flex items-center justify-between"><span className="font-bold">{pl.id}</span>{plan === pl.id && <Check className="h-4 w-4 text-primary" />}</div>
                <p className="mt-1 text-lg font-extrabold text-primary">{pl.price}</p>
                <ul className="mt-2 space-y-1 text-xs text-text-muted">{pl.features.map((f) => <li key={f} className="flex items-center gap-1"><Check className="h-3 w-3 text-success" />{f}</li>)}</ul>
              </button>
            ))}
          </div>
        </Section>
      </div>

      <Card className="mt-4 border-danger/30 p-5">
        <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-danger"><ShieldAlert className="h-4 w-4" /> Danger Zone</h3>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-muted">Permanently delete all portfolio data. This cannot be undone.</p>
          <Button variant="danger" onClick={() => setDel(true)}>Delete All Data</Button>
        </div>
      </Card>

      <p className="mt-6 text-center text-xs text-text-faint">Propertera Admin · App Version 1.0.0</p>

      <ConfirmDialog open={del} onClose={() => setDel(false)} onConfirm={() => toast("All data has been queued for deletion.", "info")} title="Delete All Data?" message="This will permanently remove all property records, tenant info and payment history. Are you absolutely sure?" confirmLabel="Delete Everything" danger />
    </div>
  );
}
