"use client";

import { useState } from "react";
import { Receipt, TrendingUp, RotateCcw, XCircle, Download, MoreVertical } from "lucide-react";
import { PageHeader, StatCard } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { transactions as seed, txnTone, type Transaction } from "@/lib/data";
import { gbp } from "@/lib/utils";

export default function TransactionsPage() {
  const toast = useToast();
  const [list, setList] = useState<Transaction[]>(() => [...seed]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Transaction["status"]>("all");
  const [menu, setMenu] = useState<string | null>(null);

  const filtered = list.filter((t) => (!q || t.customer.toLowerCase().includes(q.toLowerCase()) || t.invoiceNo.toLowerCase().includes(q.toLowerCase())) && (filter === "all" || t.status === filter));
  const paid = list.filter((t) => t.status === "Paid").reduce((s, t) => s + t.amount, 0);
  const failed = list.filter((t) => t.status === "Failed").length;
  const refunded = list.filter((t) => t.status === "Refunded").reduce((s, t) => s + t.amount, 0);

  const refund = (id: string) => { setList((l) => l.map((t) => t.id === id ? { ...t, status: "Refunded" } : t)); setMenu(null); toast("Refund issued", "warning"); };

  return (
    <div className="animate-in">
      <PageHeader title="Transactions" subtitle="Platform billing, invoices and refunds" actions={<Button variant="secondary" onClick={() => toast("Export started")}><Download className="h-4 w-4" /> Export CSV</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Collected (visible)" value={gbp(paid, { decimals: true })} icon={TrendingUp} accent="#10b981" />
        <StatCard label="Refunded" value={gbp(refunded, { decimals: true })} icon={RotateCcw} accent="#ff9500" />
        <StatCard label="Failed Payments" value={String(failed)} icon={XCircle} accent="#ff3b30" />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={q} onChange={setQ} placeholder="Search by customer or invoice..." className="sm:max-w-sm" />
        <FilterChips value={filter} onChange={setFilter} chips={[{ value: "all", label: "All" }, { value: "Paid", label: "Paid" }, { value: "Pending", label: "Pending" }, { value: "Failed", label: "Failed" }, { value: "Refunded", label: "Refunded" }]} />
      </div>

      <Card className="mt-4 overflow-hidden">
        {filtered.length === 0 ? <EmptyState icon={Receipt} title="No transactions found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead><tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-text-faint">
                <th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Plan</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Method</th><th className="px-5 py-3">Date</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right"></th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {filtered.map((t) => (
                  <tr key={t.id} className="transition hover:bg-surface-2">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{t.invoiceNo}</td>
                    <td className="px-5 py-3 font-semibold">{t.customer}</td>
                    <td className="px-5 py-3 text-text-muted">{t.plan}</td>
                    <td className="px-5 py-3 font-bold">{gbp(t.amount, { decimals: true })}</td>
                    <td className="px-5 py-3 text-text-muted">{t.method}</td>
                    <td className="px-5 py-3 text-text-muted">{t.date}</td>
                    <td className="px-5 py-3"><Badge tone={txnTone(t.status)}>{t.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="relative flex justify-end">
                        <button onClick={() => setMenu(menu === t.id ? null : t.id)} className="rounded-lg p-2 text-text-faint hover:bg-surface-2"><MoreVertical className="h-4 w-4" /></button>
                        {menu === t.id && (
                          <div className="animate-in absolute right-0 top-full z-20 mt-1 w-44 overflow-hidden rounded-xl border border-border bg-surface shadow-float">
                            <button onClick={() => { toast("Invoice downloaded"); setMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-surface-2"><Download className="h-4 w-4" /> Download invoice</button>
                            {t.status === "Paid" && <button onClick={() => refund(t.id)} className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-danger/8"><RotateCcw className="h-4 w-4" /> Issue refund</button>}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
