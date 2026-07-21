"use client";

import { useMemo, useState } from "react";
import {
  Wrench,
  CalendarClock,
  Activity,
  CheckCircle2,
  Coins,
  Plus,
  Pencil,
  XCircle,
  Building2,
  User,
  Tag,
  Calendar,
} from "lucide-react";
import { StatCard, PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Field, Input, Textarea, Select } from "@/components/ui/form";
import { PillTabs, SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import {
  maintenance as seedMaintenance,
  properties,
  tenants,
  maintTone,
  priorityTone,
  type MaintenanceTicket,
} from "@/lib/data";
import { gbp } from "@/lib/utils";

type Tab = "scheduled" | "active" | "history";
type PriorityFilter = "All" | MaintenanceTicket["priority"];

const tabs: { value: Tab; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "history", label: "History" },
];

const priorityChips: { value: PriorityFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Low", label: "Low" },
  { value: "Normal", label: "Normal" },
  { value: "High", label: "High" },
  { value: "Urgent", label: "Urgent" },
  { value: "Emergency", label: "Emergency" },
];

const PRIORITIES: MaintenanceTicket["priority"][] = [
  "Low",
  "Normal",
  "High",
  "Urgent",
  "Emergency",
];
const CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Heating",
  "Structural",
  "Appliance",
  "Cleaning",
  "Landscaping",
  "Other",
];
const STATUSES: MaintenanceTicket["status"][] = [
  "scheduled",
  "active",
  "completed",
  "cancelled",
];

interface TicketForm {
  title: string;
  description: string;
  property: string;
  tenant: string;
  priority: MaintenanceTicket["priority"];
  category: string;
  cost: string;
  status: MaintenanceTicket["status"];
}

const emptyForm: TicketForm = {
  title: "",
  description: "",
  property: properties[0]?.name ?? "",
  tenant: tenants[0]?.name ?? "",
  priority: "Normal",
  category: "Plumbing",
  cost: "",
  status: "scheduled",
};

export default function MaintenancePage() {
  const toast = useToast();
  const [rows, setRows] = useState<MaintenanceTicket[]>(() => [...seedMaintenance]);
  const [tab, setTab] = useState<Tab>("scheduled");
  const [query, setQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TicketForm>(emptyForm);
  const [cancelTarget, setCancelTarget] = useState<MaintenanceTicket | null>(null);

  const stats = useMemo(() => {
    const scheduled = rows.filter((r) => r.status === "scheduled").length;
    const active = rows.filter((r) => r.status === "active").length;
    const completed = rows.filter((r) => r.status === "completed").length;
    const totalCost = rows.reduce((acc, r) => acc + r.cost, 0);
    return { scheduled, active, completed, totalCost };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesTab =
        tab === "history" ? r.status === "completed" : r.status === tab;
      const matchesPriority =
        priorityFilter === "All" || r.priority === priorityFilter;
      const matchesQuery =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q);
      return matchesTab && matchesPriority && matchesQuery;
    });
  }, [rows, tab, priorityFilter, query]);

  function openNew() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(t: MaintenanceTicket) {
    setEditingId(t.id);
    setForm({
      title: t.title,
      description: t.description,
      property: t.property,
      tenant: t.tenant,
      priority: t.priority,
      category: t.category,
      cost: String(t.cost),
      status: t.status,
    });
    setModalOpen(true);
  }

  function saveTicket() {
    if (!form.title.trim()) {
      toast("Please add a title", "warning");
      return;
    }
    const cost = Number(form.cost) || 0;
    if (editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...r,
                title: form.title.trim(),
                description: form.description.trim(),
                property: form.property,
                tenant: form.tenant,
                priority: form.priority,
                category: form.category,
                cost,
                status: form.status,
              }
            : r
        )
      );
      toast("Ticket updated", "success");
    } else {
      const newTicket: MaintenanceTicket = {
        id: `mnt_${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        property: form.property,
        landlord: "Platform",
        tenant: form.tenant,
        priority: form.priority,
        category: form.category,
        cost,
        status: form.status,
        date: new Date().toLocaleDateString("en-GB"),
      };
      setRows((prev) => [newTicket, ...prev]);
      toast("Ticket created", "success");
    }
    setModalOpen(false);
  }

  function confirmCancel() {
    if (!cancelTarget) return;
    setRows((prev) =>
      prev.map((r) =>
        r.id === cancelTarget.id ? { ...r, status: "cancelled" } : r
      )
    );
    toast("Ticket cancelled", "info");
    setCancelTarget(null);
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Maintenance"
        subtitle="Manage all maintenance activities"
        actions={
          <Button size="sm" onClick={openNew}>
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Scheduled"
          value={String(stats.scheduled)}
          sub="Upcoming jobs"
          icon={CalendarClock}
          accent="#f59e0b"
        />
        <StatCard
          label="Active"
          value={String(stats.active)}
          sub="In progress"
          icon={Activity}
          accent="#007aff"
        />
        <StatCard
          label="Completed"
          value={String(stats.completed)}
          sub="Resolved tickets"
          icon={CheckCircle2}
          accent="#10b981"
        />
        <StatCard
          label="Total Cost"
          value={gbp(stats.totalCost)}
          sub="Across all tickets"
          icon={Coins}
          accent="#7c3aed"
        />
      </div>

      {/* Toolbar */}
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <PillTabs tabs={tabs} value={tab} onChange={setTab} />
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search title or description..."
            className="sm:max-w-xs"
          />
        </div>
        <FilterChips
          chips={priorityChips}
          value={priorityFilter}
          onChange={setPriorityFilter}
        />
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <Card className="mt-4">
          <EmptyState
            icon={Wrench}
            title="No tickets here"
            message="Nothing matches this view yet. Create a new ticket to get started."
            action={
              <Button size="sm" onClick={openNew}>
                <Plus className="h-4 w-4" />
                New Ticket
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filtered.map((t) => (
            <Card key={t.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/12 text-warning">
                    <Wrench className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold leading-snug">{t.title}</h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
                      <Badge tone={maintTone(t.status)}>{t.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm text-text-muted">{t.description}</p>

              <div className="mt-4 space-y-2 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-text-faint" />
                  {t.property}
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-text-faint" />
                  {t.tenant}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-surface-2 px-2 py-0.5 font-semibold text-text">
                    <Tag className="h-3 w-3" />
                    {t.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-text-faint" />
                    {t.date}
                  </span>
                </div>
              </div>

              {tab === "history" ? (
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-xs font-medium text-text-muted">
                    Final cost
                  </span>
                  <span className="text-lg font-extrabold text-success">
                    {gbp(t.cost)}
                  </span>
                </div>
              ) : (
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                  <span className="text-sm font-bold">{gbp(t.cost)}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(t)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCancelTarget(t)}
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* New / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit Ticket" : "New Ticket"}
        subtitle="Log the maintenance job details below."
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTicket}>
              {editingId ? "Save Changes" : "Create Ticket"}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Boiler service"
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Describe the issue or job..."
            />
          </Field>
          <Field label="Property">
            <Select
              value={form.property}
              onChange={(e) => setForm({ ...form, property: e.target.value })}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Tenant">
            <Select
              value={form.tenant}
              onChange={(e) => setForm({ ...form, tenant: e.target.value })}
            >
              {tenants.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value as MaintenanceTicket["priority"],
                })
              }
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Category">
            <Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Estimated Cost (£)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              placeholder="200"
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as MaintenanceTicket["status"],
                })
              }
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={confirmCancel}
        title="Cancel Ticket"
        message={`Cancel "${cancelTarget?.title}"? Its status will be set to cancelled.`}
        confirmLabel="Cancel Ticket"
        danger
      />
    </div>
  );
}
