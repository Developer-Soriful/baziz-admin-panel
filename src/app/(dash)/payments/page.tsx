"use client";

import { useMemo, useRef, useState } from "react";
import {
  Wallet,
  Clock,
  AlertTriangle,
  TrendingUp,
  Download,
  Plus,
  MoreVertical,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { StatCard, PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button, Avatar } from "@/components/ui/primitives";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/form";
import { SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { RevenueChart } from "@/components/charts";
import { useToast } from "@/components/ui/toast";
import {
  payments as seedPayments,
  properties,
  tenants,
  paymentTone,
  type Payment,
} from "@/lib/data";
import { gbp, gbpCompact, colorFromString } from "@/lib/utils";

const revenueByMonth = [
  { month: "Jan", revenue: 42000, expenses: 8200 },
  { month: "Feb", revenue: 44500, expenses: 7600 },
  { month: "Mar", revenue: 46200, expenses: 9100 },
  { month: "Apr", revenue: 45100, expenses: 8800 },
  { month: "May", revenue: 48300, expenses: 9400 },
  { month: "Jun", revenue: 51200, expenses: 8900 },
];

type StatusFilter = "All" | "Paid" | "Pending" | "Overdue";

const statusChips: { value: StatusFilter; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Paid", label: "Paid" },
  { value: "Pending", label: "Pending" },
  { value: "Overdue", label: "Overdue" },
];

interface PaymentForm {
  property: string;
  tenant: string;
  label: string;
  amount: string;
  date: string;
  status: Payment["status"];
}

const emptyForm: PaymentForm = {
  property: properties[0]?.name ?? "",
  tenant: tenants[0]?.name ?? "",
  label: "",
  amount: "",
  date: "",
  status: "Pending",
};

export default function PaymentsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Payment[]>(() => [...seedPayments]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<StatusFilter>("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<PaymentForm>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const sum = (s: Payment["status"]) =>
      rows.filter((r) => r.status === s).reduce((acc, r) => acc + r.amount, 0);
    const collected = sum("Paid");
    const pending = sum("Pending");
    const overdue = sum("Overdue");
    const total = rows.reduce((acc, r) => acc + r.amount, 0);
    const rate = total > 0 ? Math.round((collected / total) * 100) : 0;
    return { collected, pending, overdue, rate };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesFilter = filter === "All" || r.status === filter;
      const matchesQuery =
        !q ||
        r.tenant.toLowerCase().includes(q) ||
        r.property.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [rows, query, filter]);

  function openRecord() {
    setForm(emptyForm);
    setModalOpen(true);
  }

  function savePayment() {
    if (!form.label.trim() || !form.amount.trim()) {
      toast("Please add a label and amount", "warning");
      return;
    }
    const amount = Number(form.amount);
    if (Number.isNaN(amount) || amount <= 0) {
      toast("Enter a valid amount", "warning");
      return;
    }
    const newPayment: Payment = {
      id: `pay_${Date.now()}`,
      label: form.label.trim(),
      amount,
      date:
        form.date.trim() ||
        new Date().toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      status: form.status,
      tenant: form.tenant,
      property: form.property,
      landlord: "Platform",
    };
    setRows((prev) => [newPayment, ...prev]);
    setModalOpen(false);
    toast("Payment recorded", "success");
  }

  function markPaid(id: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Paid" } : r))
    );
    setMenuId(null);
    toast("Marked as paid", "success");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    toast("Payment deleted", "info");
    setDeleteTarget(null);
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Payments"
        subtitle="Track and manage rent payments"
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toast("Report exported", "success")}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button size="sm" onClick={openRecord}>
              <Plus className="h-4 w-4" />
              Record Payment
            </Button>
          </>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Collected"
          value={gbp(stats.collected)}
          sub={`${rows.filter((r) => r.status === "Paid").length} paid this period`}
          icon={Wallet}
          accent="#10b981"
        />
        <StatCard
          label="Pending"
          value={gbp(stats.pending)}
          sub={`${rows.filter((r) => r.status === "Pending").length} awaiting payment`}
          icon={Clock}
          accent="#f59e0b"
        />
        <StatCard
          label="Overdue"
          value={gbp(stats.overdue)}
          sub={`${rows.filter((r) => r.status === "Overdue").length} overdue`}
          icon={AlertTriangle}
          accent="#ef4444"
        />
        <StatCard
          label="Collection Rate"
          value={`${stats.rate}%`}
          sub={`${gbpCompact(stats.collected)} of billed`}
          icon={TrendingUp}
          accent="#007aff"
          trend={{ value: `${stats.rate}%`, up: stats.rate >= 70 }}
        />
      </div>

      {/* Payments over time */}
      <Card className="mt-4 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Payments Over Time</h3>
            <p className="text-xs text-text-muted">Revenue vs expenses · last 6 months</p>
          </div>
          <div className="hidden items-center gap-4 text-xs font-semibold sm:flex">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber" />
              Expenses
            </span>
          </div>
        </div>
        <div className="h-56">
          <RevenueChart data={revenueByMonth} />
        </div>
      </Card>

      {/* Toolbar */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search tenant or property..."
          className="sm:max-w-xs"
        />
        <FilterChips chips={statusChips} value={filter} onChange={setFilter} />
      </div>

      {/* Table */}
      <Card className="mt-4 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No payments found"
            message="Try adjusting your search or filters, or record a new payment."
            action={
              <Button size="sm" onClick={openRecord}>
                <Plus className="h-4 w-4" />
                Record Payment
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-text-faint">
                  <th className="px-5 py-3">Tenant</th>
                  <th className="px-5 py-3">Property</th>
                  <th className="px-5 py-3">Label</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={p.tenant}
                          size={34}
                          color={colorFromString(p.tenant)}
                        />
                        <span className="font-semibold">{p.tenant}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-text-muted">{p.property}</td>
                    <td className="px-5 py-3 text-text-muted">{p.label}</td>
                    <td className="px-5 py-3 text-text-muted">{p.date}</td>
                    <td className="px-5 py-3 text-right font-bold">
                      {gbp(p.amount, { decimals: true })}
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={paymentTone(p.status)}>{p.status}</Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <RowMenu
                        open={menuId === p.id}
                        onToggle={() =>
                          setMenuId((cur) => (cur === p.id ? null : p.id))
                        }
                        canMarkPaid={p.status !== "Paid"}
                        onMarkPaid={() => markPaid(p.id)}
                        onDelete={() => {
                          setMenuId(null);
                          setDeleteTarget(p);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Record Payment modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Payment"
        subtitle="Log a new rent payment against a tenant."
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={savePayment}>Save Payment</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Property">
            <Select
              value={form.property}
              onChange={(e) => setForm({ ...form, property: e.target.value })}
            >
              {properties.map((prop) => (
                <option key={prop.id} value={prop.name}>
                  {prop.name}
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
          <Field label="Label" className="sm:col-span-2">
            <Input
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. July 2026 Rent"
            />
          </Field>
          <Field label="Amount (£)">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="1850"
            />
          </Field>
          <Field label="Date">
            <Input
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="1 Jul 2026"
            />
          </Field>
          <Field label="Status" className="sm:col-span-2">
            <Select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as Payment["status"] })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </Select>
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Payment"
        message={`Delete "${deleteTarget?.label}" for ${deleteTarget?.tenant}? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

function RowMenu({
  open,
  onToggle,
  canMarkPaid,
  onMarkPaid,
  onDelete,
}: {
  open: boolean;
  onToggle: () => void;
  canMarkPaid: boolean;
  onMarkPaid: () => void;
  onDelete: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={onToggle}
        className="rounded-lg p-1.5 text-text-faint transition hover:bg-surface-2 hover:text-text"
        aria-label="Row actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={onToggle} aria-hidden />
          <div className="animate-in absolute right-0 z-20 mt-1 w-40 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-float">
            {canMarkPaid && (
              <button
                onClick={onMarkPaid}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-text hover:bg-surface-2"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                Mark Paid
              </button>
            )}
            <button
              onClick={onDelete}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-danger hover:bg-surface-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}
