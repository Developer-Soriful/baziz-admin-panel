"use client";

import { useState } from "react";
import Link from "next/link";
import { UserPlus, Users, CheckCircle2, Clock, AlertTriangle, Trash2, ChevronRight } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button, Avatar } from "@/components/ui/primitives";
import { Field, Input, Select } from "@/components/ui/form";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { tenants as seed, properties, tenantTone, type Tenant } from "@/lib/data";
import { gbp, colorFromString } from "@/lib/utils";

const empty: Omit<Tenant, "id"> = {
  name: "", property: "", landlord: "", unit: "", status: "Active", rent: 0, deposit: 0,
  leaseStart: "", leaseEnd: "", email: "", phone: "", joined: "",
};

export default function TenantsPage() {
  const toast = useToast();
  const [list, setList] = useState<Tenant[]>(() => [...seed]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "Active" | "Expiring" | "Overdue">("all");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Tenant | null>(null);
  const [form, setForm] = useState<Omit<Tenant, "id">>(empty);
  const [del, setDel] = useState<Tenant | null>(null);

  const filtered = list.filter((t) => {
    const mq = !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.property.toLowerCase().includes(q.toLowerCase());
    const mf = filter === "all" || t.status === filter;
    return mq && mf;
  });

  const counts = {
    active: list.filter((t) => t.status === "Active").length,
    expiring: list.filter((t) => t.status === "Expiring").length,
    overdue: list.filter((t) => t.status === "Overdue").length,
  };

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (t: Tenant) => { setEditing(t); setForm(t); setModal(true); };
  const save = () => {
    if (!form.name.trim()) return toast("Please enter a tenant name", "error");
    if (editing) {
      setList((l) => l.map((x) => (x.id === editing.id ? { ...editing, ...form } : x)));
      toast("Tenant updated successfully");
    } else {
      setList((l) => [{ ...form, id: `ten_${Date.now()}` }, ...l]);
      toast("Tenant added successfully");
    }
    setModal(false);
  };
  const remove = () => {
    if (!del) return;
    setList((l) => l.filter((x) => x.id !== del.id));
    toast(`${del.name} removed`, "info");
  };

  return (
    <div className="animate-in">
      <PageHeader
        title="Tenants"
        subtitle="Every tenant using the Propertera app across all landlords"
        actions={<Button onClick={openAdd}><UserPlus className="h-4 w-4" /> Add Tenant</Button>}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Tenants" value={String(list.length)} icon={Users} accent="#007aff" />
        <StatCard label="Active" value={String(counts.active)} icon={CheckCircle2} accent="#10b981" />
        <StatCard label="Expiring" value={String(counts.expiring)} icon={Clock} accent="#ff9500" />
        <StatCard label="Overdue" value={String(counts.overdue)} icon={AlertTriangle} accent="#ff3b30" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Search tenants by name or property..." className="sm:max-w-xs" />
        <FilterChips
          value={filter}
          onChange={setFilter}
          chips={[
            { value: "all", label: "All" },
            { value: "Active", label: "Active" },
            { value: "Expiring", label: "Expiring" },
            { value: "Overdue", label: "Overdue" },
          ]}
        />
      </div>

      <Card className="mt-4 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={Users} title="No tenants found" message="Try adjusting your search or filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-text-faint">
                  <th className="px-5 py-3">Tenant</th>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Landlord</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Rent</th>
                  <th className="px-5 py-3">Lease End</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id} className="group transition hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <Link href={`/tenants/${t.id}`} className="flex items-center gap-3">
                        <Avatar name={t.name} color={colorFromString(t.name)} size={38} />
                        <div>
                          <p className="font-semibold group-hover:text-primary">{t.name}</p>
                          <p className="text-xs text-text-muted">{t.email}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-text-muted">{t.property}</td>
                    <td className="px-5 py-3 font-medium">{t.landlord}</td>
                    <td className="px-5 py-3"><Badge tone={tenantTone(t.status)}>{t.status}</Badge></td>
                    <td className="px-5 py-3 font-bold">{gbp(t.rent)}</td>
                    <td className="px-5 py-3 text-text-muted">{t.leaseEnd || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(t)}>Edit</Button>
                        <button onClick={() => setDel(t)} className="rounded-lg p-2 text-text-faint transition hover:bg-danger/10 hover:text-danger" aria-label="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <Link href={`/tenants/${t.id}`} className="rounded-lg p-2 text-text-faint transition hover:bg-surface-2 hover:text-primary">
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? "Edit Tenant" : "Add New Tenant"}
        subtitle="Enter the tenant and lease details."
        footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save Changes" : "Add Tenant"}</Button></>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" className="sm:col-span-2"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" /></Field>
          <Field label="Email"><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" /></Field>
          <Field label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+44 7700 900000" /></Field>
          <Field label="Property"><Select value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })}><option value="">Select property</option>{properties.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <Field label="Landlord"><Input value={form.landlord} onChange={(e) => setForm({ ...form, landlord: e.target.value })} placeholder="James Anderson" /></Field>
          <Field label="Unit"><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="4B" /></Field>
          <Field label="Monthly Rent (£)"><Input type="number" value={form.rent || ""} onChange={(e) => setForm({ ...form, rent: +e.target.value })} placeholder="1850" /></Field>
          <Field label="Deposit (£)"><Input type="number" value={form.deposit || ""} onChange={(e) => setForm({ ...form, deposit: +e.target.value })} placeholder="2000" /></Field>
          <Field label="Lease Start"><Input type="date" value={form.leaseStart} onChange={(e) => setForm({ ...form, leaseStart: e.target.value })} /></Field>
          <Field label="Lease End"><Input type="date" value={form.leaseEnd} onChange={(e) => setForm({ ...form, leaseEnd: e.target.value })} /></Field>
          <Field label="Status" className="sm:col-span-2"><Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Tenant["status"] })}>{["Active", "Expiring", "Overdue", "New", "Pending"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete Tenant" message={`Are you sure you want to remove ${del?.name}? This action cannot be undone.`} confirmLabel="Delete" danger />
    </div>
  );
}
