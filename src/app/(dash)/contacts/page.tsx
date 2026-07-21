"use client";

import { useState } from "react";
import { Plus, User, Phone, Mail, Pencil, Trash2, Contact as ContactIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Button } from "@/components/ui/primitives";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { SearchInput, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { contacts as seed, type Contact } from "@/lib/data";
import { colorFromString } from "@/lib/utils";

const professions = ["Plumber", "Electrician", "Builder", "Carpenter", "Gardener", "Cleaner", "HVAC Technician", "Roofer", "Locksmith", "Pest Control"];
const empty: Omit<Contact, "id"> = { company: "", badge: "Plumber", person: "", phone: "", email: "", notes: "", added: "" };

export default function ContactsPage() {
  const toast = useToast();
  const [list, setList] = useState<Contact[]>(() => [...seed]);
  const [q, setQ] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<Omit<Contact, "id">>(empty);
  const [del, setDel] = useState<Contact | null>(null);

  const filtered = list.filter((c) => !q || [c.company, c.person, c.badge].some((v) => v.toLowerCase().includes(q.toLowerCase())));

  const today = () => new Date().toLocaleDateString("en-GB");
  const openAdd = () => { setEditing(null); setForm({ ...empty, added: today() }); setModal(true); };
  const openEdit = (c: Contact) => { setEditing(c); setForm(c); setModal(true); };
  const save = () => {
    if (!form.company.trim()) return toast("Please enter a company name", "error");
    if (editing) { setList((l) => l.map((x) => (x.id === editing.id ? { ...editing, ...form } : x))); toast("Contact updated successfully"); }
    else { setList((l) => [{ ...form, id: `cont_${Date.now()}` }, ...l]); toast("Contact added successfully"); }
    setModal(false);
  };

  return (
    <div className="animate-in">
      <PageHeader title="Contacts" subtitle="Manage your maintenance & service provider directory" actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Contact</Button>} />

      <SearchInput value={q} onChange={setQ} placeholder="Search by company, person or profession..." className="max-w-md" />

      {filtered.length === 0 ? (
        <Card className="mt-4"><EmptyState icon={ContactIcon} title="No contacts found" message="Add your first service contact to get started." /></Card>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => {
            const color = colorFromString(c.badge);
            return (
              <Card key={c.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold">{c.company}</h3>
                  <span className="rounded-full px-2.5 py-1 text-xs font-semibold" style={{ background: `${color}1a`, color }}>{c.badge}</span>
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-text-muted">
                  <p className="flex items-center gap-2"><User className="h-4 w-4" /> {c.person}</p>
                  <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {c.phone}</p>
                  <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {c.email}</p>
                </div>
                {c.notes && <div className="mt-3 rounded-lg bg-surface-2 p-3 text-xs text-text-muted"><span className="font-semibold text-text">Notes: </span>{c.notes}</div>}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs text-text-faint">Added: {c.added}</span>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(c)} className="rounded-lg p-2 text-text-faint transition hover:bg-surface-2 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setDel(c)} className="rounded-lg p-2 text-text-faint transition hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Contact" : "Add New Contact"} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save Changes" : "Add Contact"}</Button></>}>
        <div className="space-y-4">
          <Field label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Swift Plumbing Ltd" /></Field>
          <Field label="Contact Person"><Input value={form.person} onChange={(e) => setForm({ ...form, person: e.target.value })} placeholder="John Swift" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="555-123-4567" /></Field>
            <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" /></Field>
          </div>
          <Field label="Profession"><Select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}>{professions.map((p) => <option key={p}>{p}</option>)}</Select></Field>
          <Field label="Notes"><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any useful notes about this contact" /></Field>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={() => { if (del) { setList((l) => l.filter((x) => x.id !== del.id)); toast(`${del.company} deleted`, "info"); } }} title="Delete Contact" message={`Are you sure you want to delete ${del?.company}? This action cannot be undone.`} confirmLabel="Delete" danger />
    </div>
  );
}
