"use client";

import { useState } from "react";
import { ScrollText } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Avatar } from "@/components/ui/primitives";
import { SearchInput, EmptyState } from "@/components/ui/misc";
import { auditLog, type StatusTone } from "@/lib/data";
import { colorFromString } from "@/lib/utils";

const dot: Record<StatusTone, string> = { danger: "#ff3b30", warning: "#ff9500", success: "#34c759", info: "#007aff", primary: "#7c3aed", neutral: "#8e8e93" };

export default function AuditLogPage() {
  const [q, setQ] = useState("");
  const filtered = auditLog.filter((a) => !q || a.actor.toLowerCase().includes(q.toLowerCase()) || a.action.toLowerCase().includes(q.toLowerCase()) || a.target.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="animate-in">
      <PageHeader title="Audit Log" subtitle="A record of every administrative action on the platform" />
      <SearchInput value={q} onChange={setQ} placeholder="Search actor, action or target..." className="mb-5 max-w-md" />
      <Card className="p-2 sm:p-4">
        {filtered.length === 0 ? <EmptyState icon={ScrollText} title="No matching entries" /> : (
          <div className="relative pl-4">
            <div className="absolute bottom-3 left-[22px] top-3 w-px bg-border" />
            <div className="space-y-1">
              {filtered.map((a) => (
                <div key={a.id} className="relative flex items-start gap-4 rounded-xl p-3 transition hover:bg-surface-2">
                  <span className="relative z-10 mt-0.5 h-3 w-3 shrink-0 rounded-full ring-4 ring-surface" style={{ background: dot[a.type] }} />
                  <Avatar name={a.actor} color={colorFromString(a.actor)} size={34} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm"><span className="font-bold">{a.actor}</span> <span className="text-text-muted">{a.action}</span> <span className="font-semibold">{a.target}</span></p>
                    <p className="mt-0.5 text-xs text-text-faint">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
