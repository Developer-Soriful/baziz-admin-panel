"use client";

import { useState } from "react";
import { Plus, Briefcase, Building2, Receipt, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { ownershipEntities as seed, type OwnershipEntity } from "@/lib/data";

const swatches = ["#7c3aed", "#10b981", "#007aff", "#f59e0b", "#ec4899", "#008577"];
const empty: Omit<OwnershipEntity, "id"> = { name: "", type: "Personal", description: "", properties: 0, taxRef: "", color: "#008577" };

export default function OwnershipPage() {
  const toast = useToast();
  const [list, setList] = useState<OwnershipEntity[]>(() => [...seed]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<OwnershipEntity | null>(null);
  const [form, setForm] = useState<Omit<OwnershipEntity, "id">>(empty);
  const [del, setDel] = useState<OwnershipEntity | null>(null);

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (e: OwnershipEntity) => { setEditing(e); setForm(e); setModal(true); };
  const save = () => {
    if (!form.name.trim()) return toast("Please enter an entity name", "error");
    if (editing) { setList((l) => l.map((x) => (x.id === editing.id ? { ...editing, ...form } : x))); toast("Entity updated"); }
    else { setList((l) => [{ ...form, id: `own_${Date.now()}` }, ...l]); toast("Ownership entity added"); }
    setModal(false);
  };
  const remove = () => { if (del) { setList((l) => l.filter((x) => x.id !== del.id)); toast(`${del.name} deleted`, "info"); } };

  return (
    <div className="animate-in">
      <PageHeader title="Ownership Entities" subtitle="Track and manage the entities that own your properties" actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Entity</Button>} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {list.map((e) => (
          <Card key={e.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ background: e.color }}><Briefcase className="h-6 w-6" /></span>
                <div>
                  <h3 className="text-lg font-bold">{e.name}</h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold" style={{ background: `${e.color}1a`, color: e.color }}>{e.type}</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(e)} className="rounded-lg p-2 text-text-faint transition hover:bg-surface-2 hover:text-primary"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDel(e)} className="rounded-lg p-2 text-text-faint transition hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <p className="mt-3 text-sm text-text-muted">{e.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold"><Building2 className="h-3.5 w-3.5 text-primary" /> Properties: {e.properties}</span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 px-3 py-1.5 text-xs font-semibold"><Receipt className="h-3.5 w-3.5 text-primary" /> Tax: {e.taxRef}</span>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Entity" : "Add Ownership Entity"} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save Changes" : "Add Entity"}</Button></>}>
        <div className="space-y-4">
          <Field label="Entity Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Personal Portfolio" /></Field>
          <Field label="Entity Type"><Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>{["Personal", "Limited Company", "Partnership", "Trust", "Other"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tax Reference"><Input value={form.taxRef} onChange={(e) => setForm({ ...form, taxRef: e.target.value })} placeholder="GB123456789" /></Field>
            <Field label="Properties"><Input type="number" value={form.properties || ""} onChange={(e) => setForm({ ...form, properties: +e.target.value })} placeholder="0" /></Field>
          </div>
          <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this entity" /></Field>
          <Field label="Color">
            <div className="flex gap-2">
              {swatches.map((c) => (
                <button key={c} onClick={() => setForm({ ...form, color: c })} className="h-9 w-9 rounded-lg ring-2 ring-offset-2 ring-offset-surface transition" style={{ background: c, boxShadow: form.color === c ? `0 0 0 2px ${c}` : "none", opacity: form.color === c ? 1 : 0.6 }} />
              ))}
            </div>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={remove} title="Delete Entity?" message={`Are you sure you want to delete "${del?.name}"? This action cannot be undone.`} confirmLabel="Delete" danger />
    </div>
  );
}
