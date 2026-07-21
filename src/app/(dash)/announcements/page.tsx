"use client";

import { useState } from "react";
import { Megaphone, Plus, Smartphone, Globe, Mail, Users, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/modal";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { PillTabs, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { announcements as seed, announceTone, type Announcement } from "@/lib/data";

const channelIcon = { App: Smartphone, Website: Globe, Email: Mail };
const empty = { title: "", body: "", audience: "All Users" as Announcement["audience"], channel: "App" as Announcement["channel"] };

export default function AnnouncementsPage() {
  const toast = useToast();
  const [list, setList] = useState<Announcement[]>(() => [...seed]);
  const [tab, setTab] = useState<"All" | "Sent" | "Scheduled" | "Draft">("All");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);

  const filtered = list.filter((a) => tab === "All" || a.status === tab);
  const send = (draft: boolean) => {
    if (!form.title.trim()) return toast("Enter a title", "error");
    setList((l) => [{ id: `an_${Date.now()}`, ...form, status: draft ? "Draft" : "Sent", date: draft ? "—" : new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }, ...l]);
    toast(draft ? "Saved as draft" : "Announcement sent"); setModal(false);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Announcements" subtitle="Broadcast messages to app & website users" actions={<Button onClick={() => { setForm(empty); setModal(true); }}><Plus className="h-4 w-4" /> New Announcement</Button>} />
      <div className="mb-5"><PillTabs value={tab} onChange={setTab} tabs={["All", "Sent", "Scheduled", "Draft"]} /></div>
      {filtered.length === 0 ? <Card><EmptyState icon={Megaphone} title="No announcements" /></Card> : (
        <div className="space-y-3">
          {filtered.map((a) => { const CI = channelIcon[a.channel]; return (
            <Card key={a.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Megaphone className="h-5 w-5" /></span>
                  <div><p className="font-bold">{a.title}</p><p className="mt-0.5 text-sm text-text-muted">{a.body}</p></div>
                </div>
                <Badge tone={announceTone(a.status)}>{a.status}</Badge>
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-text-muted">
                <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {a.audience}</span>
                <span className="inline-flex items-center gap-1.5"><CI className="h-3.5 w-3.5" /> {a.channel}</span>
                <span>{a.date}</span>
              </div>
            </Card>
          ); })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="New Announcement" footer={<><Button variant="secondary" onClick={() => send(true)}>Save Draft</Button><Button onClick={() => send(false)}><Send className="h-4 w-4" /> Send Now</Button></>}>
        <div className="space-y-4">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What's new?" /></Field>
          <Field label="Message"><Textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write your announcement…" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Audience"><Select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value as Announcement["audience"] })}>{["All Users", "Landlords", "Tenants"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Channel"><Select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as Announcement["channel"] })}>{["App", "Website", "Email"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          </div>
        </div>
      </Modal>
    </div>
  );
}
