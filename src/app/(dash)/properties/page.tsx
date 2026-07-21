"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Building2,
  DoorOpen,
  DoorClosed,
  Wallet,
  Plus,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Users,
  MoreVertical,
  Trash2,
  Pencil,
  LayoutGrid,
  List,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import { StatCard, PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Field, Input, Select } from "@/components/ui/form";
import { SearchInput, FilterChips, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import { properties as seedProperties, ownershipEntities, type Property } from "@/lib/data";
import { gbp, gbpCompact } from "@/lib/utils";

type FilterKey = "All" | "Occupied" | "Vacant";
type ViewMode = "grid" | "list";

const PROPERTY_TYPES = ["Apartment", "Studio", "Condo", "House", "Commercial"];

const emptyForm = {
  name: "",
  type: "Apartment",
  address: "",
  city: "",
  rent: "",
  value: "",
  beds: "",
  baths: "",
  size: "",
  status: "Occupied" as Property["status"],
  entity: ownershipEntities[0]?.name ?? "",
};

export default function PropertiesPage() {
  const toast = useToast();
  const [items, setItems] = useState<Property[]>(() => [...seedProperties]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");
  const [view, setView] = useState<ViewMode>("grid");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState({ ...emptyForm });

  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const occupied = items.filter((p) => p.status === "Occupied").length;
  const vacant = items.length - occupied;
  const portfolioValue = items.reduce((s, p) => s + p.value, 0);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      const matchesFilter = filter === "All" || p.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [items, search, filter]);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  }

  function openEdit(p: Property) {
    setEditing(p);
    setMenuOpen(null);
    setForm({
      name: p.name,
      type: p.type,
      address: p.address,
      city: p.city,
      rent: String(p.rent),
      value: String(p.value),
      beds: String(p.beds),
      baths: String(p.baths),
      size: p.size,
      status: p.status,
      entity: p.entity,
    });
    setModalOpen(true);
  }

  function handleSave() {
    if (!form.name.trim() || !form.address.trim()) {
      toast("Name and address are required", "error");
      return;
    }
    const rent = Number(form.rent) || 0;
    const value = Number(form.value) || 0;
    const computedYield = value > 0 ? Number(((rent * 12 * 100) / value).toFixed(2)) : 0;

    if (editing) {
      setItems((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? {
                ...p,
                name: form.name.trim(),
                type: form.type,
                address: form.address.trim(),
                city: form.city.trim(),
                rent,
                value,
                beds: Number(form.beds) || 0,
                baths: Number(form.baths) || 0,
                size: form.size.trim() || "—",
                status: form.status,
                entity: form.entity,
                yield: computedYield,
              }
            : p
        )
      );
      toast(`${form.name} updated`, "success");
    } else {
      const newProp: Property = {
        id: `prop_${Date.now()}`,
        name: form.name.trim(),
        type: form.type,
        address: form.address.trim(),
        city: form.city.trim(),
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
        landlord: form.entity || "Platform",
        rent,
        value,
        status: form.status,
        yield: computedYield,
        beds: Number(form.beds) || 0,
        baths: Number(form.baths) || 0,
        size: form.size.trim() || "—",
        entity: form.entity,
        tenants: form.status === "Occupied" ? 1 : 0,
      };
      setItems((prev) => [newProp, ...prev]);
      toast(`${newProp.name} added`, "success");
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setItems((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    toast(`${deleteTarget.name} deleted`, "info");
    setDeleteTarget(null);
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Properties"
        subtitle="Track and manage all your properties"
        actions={
          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" /> Add Property
          </Button>
        }
      />

      {/* Stat row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Properties" value={String(items.length)} sub="Across your portfolio" icon={Building2} accent="#007aff" />
        <StatCard label="Occupied" value={String(occupied)} sub={`${Math.round((occupied / (items.length || 1)) * 100)}% occupancy`} icon={DoorClosed} accent="#10b981" />
        <StatCard label="Vacant" value={String(vacant)} sub="Awaiting tenants" icon={DoorOpen} accent="#ff9500" />
        <StatCard label="Portfolio Value" value={gbpCompact(portfolioValue)} sub={gbp(portfolioValue)} icon={Wallet} accent="#7c3aed" />
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or address..."
          className="w-full lg:max-w-sm"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterChips
            value={filter}
            onChange={setFilter}
            chips={[
              { value: "All", label: "All" },
              { value: "Occupied", label: "Occupied" },
              { value: "Vacant", label: "Vacant" },
            ]}
          />
          <div className="inline-flex rounded-xl bg-surface-2 p-1">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`rounded-lg p-2 transition ${view === "grid" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`rounded-lg p-2 transition ${view === "list" ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={Building2}
            title="No properties found"
            message="Try adjusting your search or filters, or add a new property."
            action={
              <Button onClick={openAdd}>
                <Plus className="h-4 w-4" /> Add Property
              </Button>
            }
          />
        </Card>
      ) : view === "grid" ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              p={p}
              menuOpen={menuOpen === p.id}
              onToggleMenu={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
              onEdit={() => openEdit(p)}
              onDelete={() => {
                setMenuOpen(null);
                setDeleteTarget(p);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((p) => (
            <PropertyRow
              key={p.id}
              p={p}
              menuOpen={menuOpen === p.id}
              onToggleMenu={() => setMenuOpen(menuOpen === p.id ? null : p.id)}
              onEdit={() => openEdit(p)}
              onDelete={() => {
                setMenuOpen(null);
                setDeleteTarget(p);
              }}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Property" : "Add Property"}
        subtitle={editing ? "Update the property details" : "Create a new property record"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Property"}</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Name" className="sm:col-span-2">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sunset Apartments" />
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Property["status"] })}>
              <option value="Occupied">Occupied</option>
              <option value="Vacant">Vacant</option>
            </Select>
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St" />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Anytown, CA" />
          </Field>
          <Field label="Ownership Entity">
            <Select value={form.entity} onChange={(e) => setForm({ ...form, entity: e.target.value })}>
              {ownershipEntities.map((o) => (
                <option key={o.id} value={o.name}>
                  {o.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Rent (£ / month)">
            <Input type="number" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} placeholder="1850" />
          </Field>
          <Field label="Value (£)">
            <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="500000" />
          </Field>
          <Field label="Beds">
            <Input type="number" value={form.beds} onChange={(e) => setForm({ ...form, beds: e.target.value })} placeholder="2" />
          </Field>
          <Field label="Baths">
            <Input type="number" value={form.baths} onChange={(e) => setForm({ ...form, baths: e.target.value })} placeholder="2" />
          </Field>
          <Field label="Size" className="sm:col-span-2">
            <Input value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="1,200 sqft" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete property"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </div>
  );
}

/* ---------------- Card menu ---------------- */
function CardMenu({
  open,
  onToggle,
  onEdit,
  onDelete,
}: {
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        aria-label="Options"
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/90 text-text-muted backdrop-blur transition hover:bg-surface hover:text-text"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }} />
          <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-float">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-text hover:bg-surface-2"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- Grid card ---------------- */
function PropertyCard({
  p,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
}: {
  p: Property;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group overflow-hidden transition hover:shadow-float">
      <div className="relative">
        <Link href={`/properties/${p.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.name}
            className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          <ShieldCheck className="h-3.5 w-3.5" /> Managed
        </span>
        <div className="absolute right-3 top-3">
          <CardMenu open={menuOpen} onToggle={onToggleMenu} onEdit={onEdit} onDelete={onDelete} />
        </div>
        <span className="absolute bottom-3 left-3">
          <Badge tone={p.status === "Occupied" ? "success" : "warning"} dot>
            {p.status}
          </Badge>
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/properties/${p.id}`} className="min-w-0">
            <h3 className="truncate text-base font-bold hover:text-primary">{p.name}</h3>
          </Link>
          <Badge tone="info">{p.type}</Badge>
        </div>
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {p.address}
        </p>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-lg font-extrabold">{gbp(p.rent)}<span className="text-xs font-medium text-text-faint">/mo</span></p>
            <p className="flex items-center gap-1 text-xs font-bold text-success">
              <TrendingUp className="h-3.5 w-3.5" /> {p.yield}% yield
            </p>
          </div>
          <p className="text-right text-sm font-bold">{gbpCompact(p.value)}</p>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {p.beds} beds</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4" /> {p.baths} baths</span>
          <span className="flex items-center gap-1"><Ruler className="h-4 w-4" /> {p.size}</span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="truncate font-semibold text-text-muted">{p.entity}</span>
          <span className="flex items-center gap-1 font-semibold text-text-muted"><Users className="h-3.5 w-3.5" /> {p.tenants} tenants</span>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- List row ---------------- */
function PropertyRow({
  p,
  menuOpen,
  onToggleMenu,
  onEdit,
  onDelete,
}: {
  p: Property;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="flex items-center gap-4 p-3 transition hover:shadow-float">
      <Link href={`/properties/${p.id}`} className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/properties/${p.id}`} className="min-w-0">
            <h3 className="truncate text-sm font-bold hover:text-primary sm:text-base">{p.name}</h3>
          </Link>
          <Badge tone="info">{p.type}</Badge>
          <Badge tone={p.status === "Occupied" ? "success" : "warning"} dot>
            {p.status}
          </Badge>
        </div>
        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {p.address}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-faint">
          <span>{p.beds} bd</span>
          <span>{p.baths} ba</span>
          <span>{p.size}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {p.tenants}</span>
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-extrabold">{gbp(p.rent)}<span className="text-xs font-medium text-text-faint">/mo</span></p>
        <p className="text-xs font-bold text-success">{p.yield}% yield</p>
      </div>
      <CardMenu open={menuOpen} onToggle={onToggleMenu} onEdit={onEdit} onDelete={onDelete} />
    </Card>
  );
}
