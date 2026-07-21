"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  MapPin,
  TrendingUp,
  Ruler,
  Building2,
  Clock,
  Bookmark,
  Trash2,
  Store,
  Handshake,
  Eye,
  MessageSquare,
  Users,
  Target,
  CalendarClock,
  Wallet,
  User,
  Mail,
} from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { Modal, ConfirmDialog } from "@/components/ui/modal";
import { Field, Input, Textarea, Select } from "@/components/ui/form";
import { SearchInput, PillTabs, EmptyState } from "@/components/ui/misc";
import { useToast } from "@/components/ui/toast";
import {
  marketplace as seedMarketplace,
  jointVentures as seedJVs,
  type MarketplaceListing,
  type JointVenture,
  type StatusTone,
} from "@/lib/data";
import { gbp, num } from "@/lib/utils";

type Tab = "properties" | "jv";
type Sort = "newest" | "price-asc" | "price-desc" | "yield-desc";

function epcTone(rating: string): StatusTone {
  const r = rating.toUpperCase();
  return r === "A" || r === "B" ? "success" : "warning";
}

function riskTone(risk: string): StatusTone {
  const r = risk.toUpperCase();
  if (r.includes("LOW")) return "success";
  if (r.includes("HIGH")) return "danger";
  return "warning";
}

function listedNum(s: string) {
  const m = s.match(/\d+/);
  return m ? Number(m[0]) : 0;
}

export default function MarketplacePage() {
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("properties");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");

  const [listings, setListings] = useState<MarketplaceListing[]>(() => [...seedMarketplace]);
  const [ventures, setVentures] = useState<JointVenture[]>(() => [...seedJVs]);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const [detail, setDetail] = useState<MarketplaceListing | null>(null);
  const [jvDetail, setJvDetail] = useState<JointVenture | null>(null);
  const [enquireProp, setEnquireProp] = useState<MarketplaceListing | null>(null);
  const [enquireJv, setEnquireJv] = useState<JointVenture | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MarketplaceListing | null>(null);

  const enquiryEmpty = { name: "", email: "", phone: "", message: "" };
  const [enquiry, setEnquiry] = useState({ ...enquiryEmpty });

  const listEmpty = {
    title: "",
    location: "",
    price: "",
    type: "Apartment",
    size: "",
    yield: "",
    epcRating: "A",
    description: "",
  };
  const [listForm, setListForm] = useState({ ...listEmpty });

  const filteredProps = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = listings.filter(
      (l) =>
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
    );
    out = [...out].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "yield-desc": return b.yield - a.yield;
        default: return listedNum(a.listedDays) - listedNum(b.listedDays);
      }
    });
    return out;
  }, [listings, search, sort]);

  const filteredJvs = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = ventures.filter(
      (v) =>
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        v.projectType.toLowerCase().includes(q)
    );
    out = [...out].sort((a, b) => {
      switch (sort) {
        case "price-asc": return a.investmentNeeded - b.investmentNeeded;
        case "price-desc": return b.investmentNeeded - a.investmentNeeded;
        case "yield-desc": return b.expectedReturn - a.expectedReturn;
        default: return listedNum(a.daysOnMarket) - listedNum(b.daysOnMarket);
      }
    });
    return out;
  }, [ventures, search, sort]);

  function toggleSave(id: string) {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast("Removed from saved", "info");
      } else {
        next.add(id);
        toast("Saved to your list", "success");
      }
      return next;
    });
  }

  function handleDelete() {
    if (!deleteTarget) return;
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    toast(`${deleteTarget.title} removed`, "info");
    setDeleteTarget(null);
  }

  function submitEnquiry(kind: "prop" | "jv") {
    if (!enquiry.name.trim() || !enquiry.email.trim()) {
      toast("Name and email are required", "error");
      return;
    }
    toast("Your enquiry has been sent", "success");
    setEnquiry({ ...enquiryEmpty });
    if (kind === "prop") setEnquireProp(null);
    else setEnquireJv(null);
  }

  function submitListing() {
    if (!listForm.title.trim() || !listForm.location.trim()) {
      toast("Title and location are required", "error");
      return;
    }
    const newListing: MarketplaceListing = {
      id: `mkt_${Date.now()}`,
      title: listForm.title.trim(),
      location: listForm.location.trim(),
      price: Number(listForm.price) || 0,
      type: listForm.type,
      size: listForm.size.trim() || "—",
      yield: Number(listForm.yield) || 0,
      listedDays: "0d",
      description: listForm.description.trim() || "No description provided.",
      imageUrl:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
      epcRating: listForm.epcRating,
      ownershipPercent: 100,
    };
    setListings((prev) => [newListing, ...prev]);
    toast(`${newListing.title} listed`, "success");
    setListForm({ ...listEmpty });
    setListOpen(false);
    setTab("properties");
  }

  return (
    <div className="animate-in">
      <PageHeader
        title="Marketplace"
        subtitle="Investment opportunities & joint ventures"
        actions={
          <Button onClick={() => setListOpen(true)}>
            <Plus className="h-4 w-4" /> List Property
          </Button>
        }
      />

      <PillTabs<Tab>
        tabs={[
          { value: "properties", label: "Properties" },
          { value: "jv", label: "Joint Ventures" },
        ]}
        value={tab}
        onChange={setTab}
      />

      {/* Toolbar */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder={tab === "properties" ? "Search properties..." : "Search ventures..."}
          className="w-full sm:max-w-sm"
        />
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="sm:w-56"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="yield-desc">Yield: High to Low</option>
        </Select>
      </div>

      {tab === "properties" ? (
        filteredProps.length === 0 ? (
          <Card className="mt-6">
            <EmptyState
              icon={Store}
              title="No listings found"
              message="Try adjusting your search, or list a new property."
              action={
                <Button onClick={() => setListOpen(true)}>
                  <Plus className="h-4 w-4" /> List Property
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProps.map((l) => (
              <PropertyListingCard
                key={l.id}
                l={l}
                saved={saved.has(l.id)}
                onSave={() => toggleSave(l.id)}
                onView={() => setDetail(l)}
                onDelete={() => setDeleteTarget(l)}
              />
            ))}
          </div>
        )
      ) : filteredJvs.length === 0 ? (
        <Card className="mt-6">
          <EmptyState
            icon={Handshake}
            title="No joint ventures found"
            message="Try adjusting your search terms."
          />
        </Card>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredJvs.map((v) => (
            <JVCard
              key={v.id}
              v={v}
              onDetails={() => setJvDetail(v)}
              onEnquire={() => {
                setEnquiry({ ...enquiryEmpty });
                setEnquireJv(v);
              }}
            />
          ))}
        </div>
      )}

      {/* Property detail + enquire modal */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.title}
        subtitle={detail?.location}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDetail(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (detail) {
                  setEnquiry({ ...enquiryEmpty });
                  setEnquireProp(detail);
                  setDetail(null);
                }
              }}
            >
              Express Interest
            </Button>
          </>
        }
      >
        {detail && (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={detail.imageUrl}
              alt={detail.title}
              className="h-56 w-full rounded-xl object-cover"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={epcTone(detail.epcRating)}>EPC {detail.epcRating}</Badge>
              <Badge tone="info">{detail.type}</Badge>
              <Badge tone="primary">{detail.ownershipPercent}% ownership</Badge>
            </div>
            <p className="text-2xl font-extrabold">{gbp(detail.price)}</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <DetailStat label="Type" value={detail.type} />
              <DetailStat label="Size" value={detail.size} />
              <DetailStat label="Yield" value={`${detail.yield}%`} accent="text-success" />
              <DetailStat label="Listed" value={detail.listedDays} />
            </div>
            <div>
              <h4 className="mb-1 text-sm font-bold">Description</h4>
              <p className="text-sm leading-relaxed text-text-muted">{detail.description}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Express Interest form (property) */}
      <Modal
        open={!!enquireProp}
        onClose={() => setEnquireProp(null)}
        title="Express Interest"
        subtitle={enquireProp?.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEnquireProp(null)}>
              Cancel
            </Button>
            <Button onClick={() => submitEnquiry("prop")}>Send Enquiry</Button>
          </>
        }
      >
        <EnquiryForm enquiry={enquiry} setEnquiry={setEnquiry} />
      </Modal>

      {/* JV detail modal */}
      <Modal
        open={!!jvDetail}
        onClose={() => setJvDetail(null)}
        title={jvDetail?.title}
        subtitle={jvDetail?.location}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setJvDetail(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (jvDetail) {
                  setEnquiry({ ...enquiryEmpty });
                  setEnquireJv(jvDetail);
                  setJvDetail(null);
                }
              }}
            >
              Enquire
            </Button>
          </>
        }
      >
        {jvDetail && (
          <div className="space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={jvDetail.imageUrl}
              alt={jvDetail.title}
              className="h-56 w-full rounded-xl object-cover"
            />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={riskTone(jvDetail.risk)}>{jvDetail.risk}</Badge>
              <Badge tone="info">{jvDetail.projectType}</Badge>
              <Badge tone="primary" className="capitalize">{jvDetail.investmentModel}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DetailStat label="Investment Needed" value={gbp(jvDetail.investmentNeeded)} />
              <DetailStat label="Total Project Cost" value={gbp(jvDetail.totalProjectCost)} />
              <DetailStat label="Expected Return" value={`${jvDetail.expectedReturn}%`} accent="text-success" />
              <DetailStat label="Timeline" value={jvDetail.timeline} />
              <DetailStat label="Partners" value={jvDetail.partners} />
              <DetailStat label="Interest" value={`${num(jvDetail.views)} views`} />
            </div>
            <div>
              <h4 className="mb-1 text-sm font-bold">About this venture</h4>
              <p className="text-sm leading-relaxed text-text-muted">{jvDetail.description}</p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-faint">
                Lead Partner
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm font-bold">
                <User className="h-4 w-4 text-primary" /> {jvDetail.leadPartnerName}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-text-muted">
                <Mail className="h-4 w-4" /> {jvDetail.leadPartnerContact}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* JV enquire form */}
      <Modal
        open={!!enquireJv}
        onClose={() => setEnquireJv(null)}
        title="Enquire"
        subtitle={enquireJv?.title}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEnquireJv(null)}>
              Cancel
            </Button>
            <Button onClick={() => submitEnquiry("jv")}>Send Enquiry</Button>
          </>
        }
      >
        <EnquiryForm enquiry={enquiry} setEnquiry={setEnquiry} />
      </Modal>

      {/* List property modal */}
      <Modal
        open={listOpen}
        onClose={() => setListOpen(false)}
        title="List Property"
        subtitle="Add a new listing to the marketplace"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setListOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitListing}>List Property</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title" className="sm:col-span-2">
            <Input
              value={listForm.title}
              onChange={(e) => setListForm({ ...listForm, title: e.target.value })}
              placeholder="e.g. Riverside Townhouse"
            />
          </Field>
          <Field label="Location" className="sm:col-span-2">
            <Input
              value={listForm.location}
              onChange={(e) => setListForm({ ...listForm, location: e.target.value })}
              placeholder="Leeds, UK"
            />
          </Field>
          <Field label="Price (£)">
            <Input
              type="number"
              value={listForm.price}
              onChange={(e) => setListForm({ ...listForm, price: e.target.value })}
              placeholder="420000"
            />
          </Field>
          <Field label="Type">
            <Select
              value={listForm.type}
              onChange={(e) => setListForm({ ...listForm, type: e.target.value })}
            >
              {["Apartment", "Studio", "Condo", "House", "Commercial"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Size">
            <Input
              value={listForm.size}
              onChange={(e) => setListForm({ ...listForm, size: e.target.value })}
              placeholder="1,200 sq ft"
            />
          </Field>
          <Field label="Yield (%)">
            <Input
              type="number"
              value={listForm.yield}
              onChange={(e) => setListForm({ ...listForm, yield: e.target.value })}
              placeholder="6.2"
            />
          </Field>
          <Field label="EPC Rating">
            <Select
              value={listForm.epcRating}
              onChange={(e) => setListForm({ ...listForm, epcRating: e.target.value })}
            >
              {["A", "B", "C", "D", "E", "F", "G"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <Textarea
              value={listForm.description}
              onChange={(e) => setListForm({ ...listForm, description: e.target.value })}
              placeholder="Tell buyers about this property..."
            />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Remove listing"
        message={`Remove "${deleteTarget?.title}" from the marketplace? This cannot be undone.`}
        confirmLabel="Remove"
        danger
      />
    </div>
  );
}

function DetailStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-text-faint">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}

function EnquiryForm({
  enquiry,
  setEnquiry,
}: {
  enquiry: { name: string; email: string; phone: string; message: string };
  setEnquiry: (v: { name: string; email: string; phone: string; message: string }) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Name">
        <Input
          value={enquiry.name}
          onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
          placeholder="Your full name"
        />
      </Field>
      <Field label="Email">
        <Input
          type="email"
          value={enquiry.email}
          onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Phone" className="sm:col-span-2">
        <Input
          value={enquiry.phone}
          onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
          placeholder="+44 7700 900000"
        />
      </Field>
      <Field label="Message" className="sm:col-span-2">
        <Textarea
          value={enquiry.message}
          onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
          placeholder="I'd like to know more about this opportunity..."
        />
      </Field>
    </div>
  );
}

function PropertyListingCard({
  l,
  saved,
  onSave,
  onView,
  onDelete,
}: {
  l: MarketplaceListing;
  saved: boolean;
  onSave: () => void;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="group flex flex-col overflow-hidden transition hover:shadow-float">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={l.imageUrl}
          alt={l.title}
          className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3">
          <Badge tone={epcTone(l.epcRating)}>EPC {l.epcRating}</Badge>
        </span>
        <div className="absolute right-3 top-3 flex gap-2">
          <button
            onClick={onSave}
            aria-label="Save"
            className={`flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur transition ${
              saved
                ? "bg-primary text-white"
                : "bg-surface/90 text-text-muted hover:bg-surface hover:text-text"
            }`}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/90 text-text-muted backdrop-blur transition hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <span className="absolute bottom-3 left-3 rounded-full bg-black/60 px-2.5 py-1 text-sm font-extrabold text-white backdrop-blur">
          {gbp(l.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold">{l.title}</h3>
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {l.location}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
          <span className="flex items-center gap-1.5 text-text-muted">
            <Building2 className="h-3.5 w-3.5" /> {l.type}
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <Ruler className="h-3.5 w-3.5" /> {l.size}
          </span>
          <span className="flex items-center gap-1.5 font-bold text-success">
            <TrendingUp className="h-3.5 w-3.5" /> {l.yield}% yield
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <Clock className="h-3.5 w-3.5" /> Listed {l.listedDays}
          </span>
        </div>

        <Button className="mt-4 w-full" onClick={onView}>
          View & Enquire
        </Button>
      </div>
    </Card>
  );
}

function JVCard({
  v,
  onDetails,
  onEnquire,
}: {
  v: JointVenture;
  onDetails: () => void;
  onEnquire: () => void;
}) {
  return (
    <Card className="group flex flex-col overflow-hidden transition hover:shadow-float">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={v.imageUrl}
          alt={v.title}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3">
          <Badge tone={riskTone(v.risk)}>{v.risk}</Badge>
        </span>
        <span className="absolute right-3 top-3">
          <Badge tone="info">{v.projectType}</Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-base font-bold">{v.title}</h3>
        <p className="mt-1 flex items-center gap-1 truncate text-xs text-text-muted">
          <MapPin className="h-3.5 w-3.5 shrink-0" /> {v.location}
        </p>

        <p className="mt-3 text-lg font-extrabold">{gbp(v.investmentNeeded)}</p>
        <p className="text-xs text-text-faint">investment needed</p>

        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
          <span className="flex items-center gap-1.5 capitalize text-text-muted">
            <Wallet className="h-3.5 w-3.5" /> {v.investmentModel}
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <CalendarClock className="h-3.5 w-3.5" /> {v.timeline}
          </span>
          <span className="flex items-center gap-1.5 font-bold text-success">
            <Target className="h-3.5 w-3.5" /> {v.expectedReturn}% return
          </span>
          <span className="flex items-center gap-1.5 text-text-muted">
            <Users className="h-3.5 w-3.5" /> {v.partners}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-text-faint">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" /> {num(v.views)} views
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" /> {num(v.inquiries)} inquiries
          </span>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onDetails}>
            Details
          </Button>
          <Button className="flex-1" onClick={onEnquire}>
            Enquire
          </Button>
        </div>
      </div>
    </Card>
  );
}
