"use client";

import { useState } from "react";
import { UserPlus, ShieldCheck, CheckCircle2, Clock, Crown, MoreVertical, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button, Avatar, Toggle } from "@/components/ui/primitives";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { PillTabs, SearchInput } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { teamMembers as seedMembers, roles as seedRoles, permissionDefs, type TeamMember, type Role } from "@/lib/data";

export default function TeamPage() {
  const toast = useToast();
  const [members, setMembers] = useState<TeamMember[]>(() => [...seedMembers]);
  const [roles, setRoles] = useState<Role[]>(() => seedRoles.map((r) => ({ ...r, permissions: [...r.permissions] })));
  const [tab, setTab] = useState<"Members" | "Roles">("Members");
  const [q, setQ] = useState("");
  const [invite, setInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", roleId: "manager" });
  const [del, setDel] = useState<TeamMember | null>(null);
  const [roleModal, setRoleModal] = useState<Role | null>(null);
  const [newRole, setNewRole] = useState(false);
  const [newRoleForm, setNewRoleForm] = useState<{ name: string; description: string; permissions: string[] }>({ name: "", description: "", permissions: [] });

  const roleById = (id: string) => roles.find((r) => r.id === id);
  const membersInRole = (id: string) => members.filter((m) => m.roleId === id).length;
  const filteredMembers = members.filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()) || m.email.toLowerCase().includes(q.toLowerCase()));

  const sendInvite = () => {
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return toast("Fill in all fields", "error");
    setMembers((l) => [...l, { id: `tm_${Date.now()}`, name: inviteForm.name, email: inviteForm.email, roleId: inviteForm.roleId, status: "pending", properties: "All properties" }]);
    toast("Invitation sent");
    setInvite(false);
    setInviteForm({ name: "", email: "", roleId: "manager" });
  };
  const removeMember = () => { if (del) { setMembers((l) => l.filter((m) => m.id !== del.id)); toast(`${del.name} removed`, "info"); } };
  const createRole = () => {
    if (!newRoleForm.name.trim()) return toast("Enter a role name", "error");
    setRoles((l) => [...l, { id: `role_${Date.now()}`, name: newRoleForm.name, color: "#008577", description: newRoleForm.description, isSystem: false, permissions: newRoleForm.permissions }]);
    toast("Custom role created");
    setNewRole(false);
    setNewRoleForm({ name: "", description: "", permissions: [] });
  };

  const grouped = permissionDefs.reduce<Record<string, typeof permissionDefs>>((acc, p) => { (acc[p.category] ||= []).push(p); return acc; }, {});

  return (
    <div className="animate-in">
      <PageHeader title="Team & Permissions" subtitle="Manage teammates and role-based access control" actions={<Button onClick={() => setInvite(true)}><UserPlus className="h-4 w-4" /> Invite Member</Button>} />

      {/* Gradient header card */}
      <div className="overflow-hidden rounded-2xl p-6 text-white" style={{ background: "linear-gradient(120deg, #008577, #00574b)" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/70">Your Team</p>
            <p className="text-3xl font-extrabold">{members.length} members</p>
          </div>
          <div className="flex gap-3">
            {[
              { icon: CheckCircle2, label: "Active", value: members.filter((m) => m.status === "active").length },
              { icon: Clock, label: "Pending", value: members.filter((m) => m.status === "pending").length },
              { icon: ShieldCheck, label: "Roles", value: roles.length },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 px-4 py-3 text-center backdrop-blur">
                <s.icon className="mx-auto h-5 w-5" />
                <p className="mt-1 text-xl font-extrabold">{s.value}</p>
                <p className="text-[11px] text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5"><PillTabs value={tab} onChange={setTab} tabs={["Members", "Roles"]} /></div>

      {tab === "Members" && (
        <>
          <SearchInput value={q} onChange={setQ} placeholder="Search members..." className="mt-4 max-w-sm" />
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
            {filteredMembers.map((m) => {
              const role = roleById(m.roleId);
              return (
                <Card key={m.id} className="flex items-center gap-3 p-4">
                  <Avatar name={m.name} color={role?.color} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-bold">{m.name}</p>
                      <Badge tone={m.status === "active" ? "success" : "warning"}>{m.status}</Badge>
                    </div>
                    <p className="truncate text-xs text-text-muted">{m.email}</p>
                    <div className="mt-1 flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: role?.color }} /><span className="text-xs font-semibold">{role?.name}</span><span className="text-xs text-text-faint">· {m.properties}</span></div>
                  </div>
                  {m.roleId === "owner" ? (
                    <Crown className="h-5 w-5 text-amber" />
                  ) : (
                    <button onClick={() => setDel(m)} className="rounded-lg p-2 text-text-faint hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      )}

      {tab === "Roles" && (
        <>
          <button onClick={() => setNewRole(true)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border-strong py-3 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/5"><Plus className="h-4 w-4" /> Create custom role</button>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {roles.map((r) => (
              <Card key={r.id} className="p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${r.color}1a`, color: r.color }}><ShieldCheck className="h-5 w-5" /></span>
                  {r.isSystem && <span className="rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-faint">System</span>}
                </div>
                <h3 className="mt-3 font-bold">{r.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-text-muted">{r.description}</p>
                <p className="mt-2 text-xs text-text-faint">{r.permissions.length} permissions · {membersInRole(r.id)} members</p>
                <Button size="sm" variant="secondary" className="mt-3 w-full" onClick={() => setRoleModal(r)}>{r.isSystem ? "View permissions" : "Edit role"}</Button>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Invite modal */}
      <Modal open={invite} onClose={() => setInvite(false)} title="Invite Member" footer={<><Button variant="secondary" onClick={() => setInvite(false)}>Cancel</Button><Button onClick={sendInvite}>Send Invite</Button></>}>
        <div className="space-y-4">
          <Field label="Full Name"><Input value={inviteForm.name} onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })} placeholder="Jane Doe" /></Field>
          <Field label="Email"><Input value={inviteForm.email} onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })} placeholder="jane@company.com" /></Field>
          <Field label="Role"><Select value={inviteForm.roleId} onChange={(e) => setInviteForm({ ...inviteForm, roleId: e.target.value })}>{roles.filter((r) => r.id !== "owner").map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></Field>
        </div>
      </Modal>

      {/* Role view modal */}
      <Modal open={!!roleModal} onClose={() => setRoleModal(null)} title={roleModal?.name} subtitle={roleModal?.isSystem ? "System role · read-only" : "Custom role"} size="lg" footer={<Button onClick={() => setRoleModal(null)}>Close</Button>}>
        {roleModal && (
          <div className="space-y-5">
            {Object.entries(grouped).map(([cat, perms]) => (
              <div key={cat}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-faint">{cat}</p>
                <div className="space-y-2">
                  {perms.map((perm) => (
                    <div key={perm.key} className="flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
                      <span className={`text-sm ${perm.sensitive ? "text-warning" : ""}`}>{perm.label}</span>
                      <Toggle checked={roleModal.permissions.includes(perm.key)} disabled={roleModal.isSystem} onChange={(v) => setRoles((l) => l.map((r) => r.id === roleModal.id ? { ...r, permissions: v ? [...r.permissions, perm.key] : r.permissions.filter((k) => k !== perm.key) } : r)) } />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* New role modal */}
      <Modal open={newRole} onClose={() => setNewRole(false)} title="Create Custom Role" size="lg" footer={<><Button variant="secondary" onClick={() => setNewRole(false)}>Cancel</Button><Button onClick={createRole}>Create Role</Button></>}>
        <div className="space-y-4">
          <Field label="Role Name"><Input value={newRoleForm.name} onChange={(e) => setNewRoleForm({ ...newRoleForm, name: e.target.value })} placeholder="e.g. Regional Manager" /></Field>
          <Field label="Description"><Textarea rows={2} value={newRoleForm.description} onChange={(e) => setNewRoleForm({ ...newRoleForm, description: e.target.value })} placeholder="What this role can do" /></Field>
          <div>
            <p className="mb-2 text-[13px] font-semibold text-text-muted">Permissions ({newRoleForm.permissions.length}/{permissionDefs.length})</p>
            <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
              {Object.entries(grouped).map(([cat, perms]) => (
                <div key={cat}>
                  <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-text-faint">{cat}</p>
                  <div className="space-y-1.5">
                    {perms.map((perm) => (
                      <label key={perm.key} className="flex cursor-pointer items-center justify-between rounded-lg bg-surface-2 px-3 py-2">
                        <span className="text-sm">{perm.label}</span>
                        <Toggle checked={newRoleForm.permissions.includes(perm.key)} onChange={(v) => setNewRoleForm((f) => ({ ...f, permissions: v ? [...f.permissions, perm.key] : f.permissions.filter((k) => k !== perm.key) }))} />
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!del} onClose={() => setDel(null)} onConfirm={removeMember} title="Remove Member" message={`Remove ${del?.name} from the team?`} confirmLabel="Remove" danger />
    </div>
  );
}
