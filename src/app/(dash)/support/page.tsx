"use client";

import { useState } from "react";
import { LifeBuoy, CircleDot, Loader, CheckCircle2, Smartphone, Globe, Mail, Send } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button, Avatar } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/form";
import { PillTabs, SearchInput, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { supportTickets as seed, ticketTone, priorityTone, type SupportTicket } from "@/lib/data";
import { colorFromString } from "@/lib/utils";

const channelIcon = { App: Smartphone, Website: Globe, Email: Mail };

export default function SupportPage() {
  const toast = useToast();
  const [list, setList] = useState<SupportTicket[]>(() => [...seed]);
  const [tab, setTab] = useState<"All" | "Open" | "In Progress" | "Resolved">("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<SupportTicket | null>(null);
  const [reply, setReply] = useState("");

  const filtered = list.filter((t) => (!q || t.subject.toLowerCase().includes(q.toLowerCase()) || t.user.toLowerCase().includes(q.toLowerCase())) && (tab === "All" || t.status === tab));
  const counts = { open: list.filter((t) => t.status === "Open").length, prog: list.filter((t) => t.status === "In Progress").length, resolved: list.filter((t) => t.status === "Resolved").length };
  const setStatus = (id: string, status: SupportTicket["status"]) => { setList((l) => l.map((t) => t.id === id ? { ...t, status } : t)); toast(`Ticket ${status.toLowerCase()}`); };

  return (
    <div className="animate-in">
      <PageHeader title="Support Tickets" subtitle="Requests from landlords and tenants across the app & website" />
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Open" value={String(counts.open)} icon={CircleDot} accent="#ff9500" />
        <StatCard label="In Progress" value={String(counts.prog)} icon={Loader} accent="#007aff" />
        <StatCard label="Resolved" value={String(counts.resolved)} icon={CheckCircle2} accent="#10b981" />
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PillTabs value={tab} onChange={setTab} tabs={["All", "Open", "In Progress", "Resolved"]} />
        <SearchInput value={q} onChange={setQ} placeholder="Search tickets..." className="sm:ml-auto sm:max-w-xs" />
      </div>

      {filtered.length === 0 ? <Card className="mt-4"><EmptyState icon={LifeBuoy} title="No tickets" message="Support requests will appear here." /></Card> : (
        <div className="mt-4 space-y-3">
          {filtered.map((t) => { const CI = channelIcon[t.channel]; return (
            <Card key={t.id} className="p-4">
              <div className="flex items-start gap-3">
                <Avatar name={t.user} color={colorFromString(t.user)} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><p className="font-bold">{t.subject}</p><Badge tone={priorityTone(t.priority)}>{t.priority}</Badge></div>
                  <p className="text-xs text-text-muted">{t.user} · {t.role} · <span className="inline-flex items-center gap-1"><CI className="h-3 w-3" />{t.channel}</span> · {t.date}</p>
                  <p className="mt-1.5 line-clamp-1 text-sm text-text-muted">{t.message}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2"><Badge tone={ticketTone(t.status)}>{t.status}</Badge><Button size="sm" variant="secondary" onClick={() => { setOpen(t); setReply(""); }}>Open</Button></div>
              </div>
            </Card>
          ); })}
        </div>
      )}

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.subject} subtitle={open ? `${open.user} · ${open.role} · ${open.channel}` : ""} size="lg"
        footer={open && <>
          {open.status !== "Resolved" && <Button variant="secondary" onClick={() => { setStatus(open.id, "In Progress"); setOpen(null); }}>Mark In Progress</Button>}
          <Button onClick={() => { setStatus(open.id, "Resolved"); toast("Reply sent & ticket resolved"); setOpen(null); }}><Send className="h-4 w-4" /> Send & Resolve</Button>
        </>}>
        {open && (
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-2 p-4"><p className="text-xs font-semibold text-text-muted">{open.user} wrote:</p><p className="mt-1 text-sm">{open.message}</p></div>
            <Textarea rows={5} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply to the user…" />
          </div>
        )}
      </Modal>
    </div>
  );
}
