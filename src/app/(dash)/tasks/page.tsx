"use client";

import { useState } from "react";
import { Plus, Check, MoreVertical, Pencil, Trash2, CircleCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Button } from "@/components/ui/primitives";
import { Field, Input, Select } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { PillTabs, FilterChips, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { tasks as seed, properties, priorityTone, type TaskItem } from "@/lib/data";
import { cn } from "@/lib/utils";

const empty: Omit<TaskItem, "id"> = { title: "", property: "General", priority: "Medium", due: "", bucket: "Today", done: false };

export default function TasksPage() {
  const toast = useToast();
  const [list, setList] = useState<TaskItem[]>(() => [...seed]);
  const [tab, setTab] = useState<TaskItem["bucket"]>("Today");
  const [pri, setPri] = useState<"all" | "High" | "Medium" | "Low">("all");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<TaskItem | null>(null);
  const [form, setForm] = useState<Omit<TaskItem, "id">>(empty);
  const [menu, setMenu] = useState<string | null>(null);

  const filtered = list.filter((t) => t.bucket === tab && (pri === "all" || t.priority === pri));

  const toggle = (id: string) => setList((l) => l.map((t) => (t.id === id ? { ...t, done: !t.done, bucket: !t.done ? "Completed" : "Today", priority: !t.done ? "Completed" : "Medium" } : t)));
  const openAdd = () => { setEditing(null); setForm({ ...empty, bucket: tab === "Completed" ? "Today" : tab }); setModal(true); };
  const openEdit = (t: TaskItem) => { setEditing(t); setForm(t); setModal(true); setMenu(null); };
  const save = () => {
    if (!form.title.trim()) return toast("Please enter a task title", "error");
    if (editing) { setList((l) => l.map((x) => (x.id === editing.id ? { ...editing, ...form } : x))); toast("Task updated"); }
    else { setList((l) => [{ ...form, id: `task_${Date.now()}` }, ...l]); toast("Task added"); }
    setModal(false);
  };
  const remove = (id: string) => { setList((l) => l.filter((t) => t.id !== id)); toast("Task deleted", "info"); setMenu(null); };

  return (
    <div className="animate-in">
      <PageHeader title="Tasks" subtitle="Manage your team's to-do list" actions={<Button onClick={openAdd}><Plus className="h-4 w-4" /> Add Task</Button>} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PillTabs value={tab} onChange={setTab} tabs={["Today", "Upcoming", "Completed"]} />
        <FilterChips value={pri} onChange={setPri} chips={[{ value: "all", label: "All" }, { value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }]} />
      </div>

      <Card className="mt-4">
        {filtered.length === 0 ? (
          <EmptyState icon={CircleCheck} title="No tasks" message="You're all caught up for now!" />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-4">
                <button onClick={() => toggle(t.id)} className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition", t.done ? "border-success bg-success text-white" : "border-border-strong hover:border-primary")}>
                  {t.done && <Check className="h-3.5 w-3.5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <p className={cn("font-semibold", t.done && "text-text-faint line-through")}>{t.title}</p>
                  <p className="text-xs text-text-muted">{t.property}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={cn("text-xs font-bold", `text-${priorityTone(t.priority)}`)} style={{ color: priorityTone(t.priority) === "danger" ? "#ff3b30" : priorityTone(t.priority) === "warning" ? "#ff9500" : priorityTone(t.priority) === "success" ? "#34c759" : "#007aff" }}>{t.priority}</p>
                    <p className="text-xs text-text-faint">{t.due}</p>
                  </div>
                  <div className="relative">
                    <button onClick={() => setMenu(menu === t.id ? null : t.id)} className="rounded-lg p-2 text-text-faint hover:bg-surface-2"><MoreVertical className="h-4 w-4" /></button>
                    {menu === t.id && (
                      <div className="animate-in absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-float">
                        <button onClick={() => openEdit(t)} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface-2"><Pencil className="h-4 w-4" /> Edit</button>
                        <button onClick={() => remove(t.id)} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-danger/8"><Trash2 className="h-4 w-4" /> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Task" : "Add Task"} footer={<><Button variant="secondary" onClick={() => setModal(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save Changes" : "Add Task"}</Button></>}>
        <div className="space-y-4">
          <Field label="Task Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Gas Safety Inspection" /></Field>
          <Field label="Property"><Select value={form.property} onChange={(e) => setForm({ ...form, property: e.target.value })}><option>General</option>{properties.map((p) => <option key={p.id}>{p.name}</option>)}</Select></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Priority"><Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskItem["priority"] })}>{["High", "Medium", "Low"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
            <Field label="Due"><Input value={form.due} onChange={(e) => setForm({ ...form, due: e.target.value })} placeholder="10:00 AM / Tomorrow" /></Field>
          </div>
          <Field label="Bucket"><Select value={form.bucket} onChange={(e) => setForm({ ...form, bucket: e.target.value as TaskItem["bucket"] })}>{["Today", "Upcoming", "Completed"].map((s) => <option key={s}>{s}</option>)}</Select></Field>
        </div>
      </Modal>
    </div>
  );
}
