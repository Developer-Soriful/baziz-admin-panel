"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Wallet,
  TrendingUp,
  CheckCircle2,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Calendar,
  Landmark,
  Percent,
  ShieldCheck,
  Zap,
  UserCog,
  FileText,
  Wrench,
  MessageSquare,
  Mail,
  Phone,
  BarChart3,
  Users,
  FolderOpen,
  Contact as ContactIcon,
  LineChart,
} from "lucide-react";
import { PageHeader } from "@/components/ui/stat-card";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { PillTabs } from "@/components/ui/misc";
import { SimpleBar, DonutPie } from "@/components/charts";
import { properties, ownershipEntities, type Property } from "@/lib/data";
import { gbp } from "@/lib/utils";

type Tab = "Details" | "Tenants" | "Expenses" | "More";
type MoreTab = "Maintenance" | "ROI" | "Documents" | "Contacts" | "Market Data";

const expenses = [
  { category: "Repairs", note: "Fixed leaking roof", amount: 850, date: "18 Mar 2025", color: "#ef4444" },
  { category: "Utilities", note: "Water bill", amount: 350, date: "28 Feb 2025", color: "#0ea5e9" },
  { category: "Taxes", note: "Property tax payment", amount: 1200, date: "20 Jan 2025", color: "#7c3aed" },
  { category: "Insurance", note: "Monthly insurance premium", amount: 600, date: "5 Jan 2025", color: "#f59e0b" },
  { category: "Maintenance", note: "Regular garden maintenance", amount: 450, date: "10 Dec 2024", color: "#10b981" },
];

const roiBreakdown = [
  { name: "Mortgage", value: 10800, color: "#7c3aed" },
  { name: "Tax", value: 1440, color: "#ef4444" },
  { name: "Insurance", value: 720, color: "#f59e0b" },
  { name: "Maintenance", value: 1080, color: "#10b981" },
  { name: "Management", value: 3996, color: "#0ea5e9" },
  { name: "Utilities", value: 720, color: "#ec4899" },
  { name: "Other", value: 360, color: "#8e8e93" },
];

const detailMaintenance = [
  { title: "HVAC System Service", status: "Scheduled", date: "15 May 2025", cost: 250, tone: "warning" as const },
  { title: "Plumbing Check", status: "Completed", date: "10 Feb 2025", cost: 120, tone: "success" as const },
];

const detailDocuments = [
  { name: "Lease Agreement 2024", size: "1.5 MB", date: "01 Jan 2024" },
  { name: "Insurance Policy", size: "0.8 MB", date: "12 Dec 2024" },
  { name: "Inspection Report", size: "2.4 MB", date: "15 Feb 2025" },
];

const detailContacts = [
  { name: "John Miller", role: "Lead Plumber", company: "Swift Plumbing Ltd" },
  { name: "Alice Sparks", role: "Electrician", company: "City Volt" },
];

const propertyTenants = [
  { name: "John Smith", email: "john.tenant@example.com", phone: "123-456-7890", unit: "Unit 1A", rent: 1500, dueDay: 1 },
  { name: "Sarah Johnson", email: "sarah.j@example.com", phone: "321-654-0987", unit: "Unit 2B", rent: 1200, dueDay: 5 },
];

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const property = useMemo(() => properties.find((p) => p.id === id), [id]);
  const [tab, setTab] = useState<Tab>("Details");
  const [expenseView, setExpenseView] = useState<"List" | "Report">("List");
  const [moreTab, setMoreTab] = useState<MoreTab>("ROI");

  if (!property) {
    return (
      <div className="animate-in">
        <PageHeader title="Property not found" subtitle="This property may have been removed." />
        <Link href="/properties" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to properties
        </Link>
      </div>
    );
  }

  const entity = ownershipEntities.find((o) => o.name === property.entity);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="animate-in">
      <Link href="/properties" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Properties
      </Link>

      {/* Hero */}
      <Card className="overflow-hidden">
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={property.image} alt={property.name} className="h-52 w-full object-cover sm:h-64" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold backdrop-blur">{property.type}</span>
                {entity && (
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur"
                    style={{ background: `${entity.color}cc` }}
                  >
                    Owned by: {entity.name} (60%)
                  </span>
                )}
              </div>
              <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{property.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
                <MapPin className="h-4 w-4" /> {property.address}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 3 stat cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MiniStat icon={Wallet} accent="#7c3aed" label="Value" value={gbp(property.value)} />
        <MiniStat icon={TrendingUp} accent="#10b981" label="Yield" value={`${property.yield}%`} />
        <MiniStat icon={CheckCircle2} accent="#007aff" label="Status" value={property.status} />
      </div>

      {/* Tabs */}
      <div className="mt-6 overflow-x-auto">
        <PillTabs<Tab> tabs={["Details", "Tenants", "Expenses", "More"]} value={tab} onChange={setTab} />
      </div>

      {tab === "Details" && <DetailsTab property={property} />}

      {tab === "Tenants" && (
        <div className="mt-4 space-y-3">
          {propertyTenants.map((t) => (
            <Card key={t.email} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold">{t.name}</h3>
                  <Badge tone="info">{t.unit}</Badge>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                  <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {t.email}</span>
                  <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {t.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 sm:justify-end">
                <div className="text-right">
                  <p className="text-base font-extrabold">{gbp(t.rent)}<span className="text-xs font-medium text-text-faint">/mo</span></p>
                  <p className="text-xs text-text-faint">Due day {t.dueDay}</p>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" /> Message
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === "Expenses" && (
        <div className="mt-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <PillTabs<"List" | "Report"> tabs={["List", "Report"]} value={expenseView} onChange={setExpenseView} />
            <span className="text-sm font-semibold text-text-muted">Total: <span className="font-extrabold text-text">{gbp(totalExpenses)}</span></span>
          </div>

          {expenseView === "List" ? (
            <Card className="divide-y divide-border">
              {expenses.map((e) => (
                <div key={e.category} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${e.color}1a`, color: e.color }}>
                    <Wallet className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{e.category}</p>
                    <p className="truncate text-xs text-text-muted">{e.note} · {e.date}</p>
                  </div>
                  <p className="text-sm font-extrabold">{gbp(e.amount)}</p>
                </div>
              ))}
            </Card>
          ) : (
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold">Expenses by Category</h3>
                <span className="text-sm font-bold">{gbp(totalExpenses)}</span>
              </div>
              <div className="h-64">
                <SimpleBar
                  data={expenses.map((e) => ({ name: e.category, value: e.amount, color: e.color }))}
                  formatter={(v) => gbp(v)}
                />
              </div>
            </Card>
          )}
        </div>
      )}

      {tab === "More" && (
        <div className="mt-4">
          <div className="overflow-x-auto">
            <PillTabs<MoreTab>
              tabs={["Maintenance", "ROI", "Documents", "Contacts", "Market Data"]}
              value={moreTab}
              onChange={setMoreTab}
            />
          </div>

          {moreTab === "Maintenance" && (
            <div className="mt-4 space-y-3">
              {detailMaintenance.map((m) => (
                <Card key={m.title} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/12 text-warning">
                    <Wrench className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{m.title}</p>
                    <p className="text-xs text-text-muted">{m.date}</p>
                  </div>
                  <div className="text-right">
                    <Badge tone={m.tone}>{m.status}</Badge>
                    <p className="mt-1 text-sm font-bold">{gbp(m.cost)}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {moreTab === "ROI" && (
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <div className="grid grid-cols-2 gap-3">
                <RoiCard label="Gross Yield" value="13.32%" icon={TrendingUp} accent="#10b981" />
                <RoiCard label="Cap Rate" value="6.95%" icon={Percent} accent="#007aff" />
                <RoiCard label="Cash-on-Cash" value="33.09%" icon={LineChart} accent="#7c3aed" />
                <RoiCard label="NOI" value="£20,844" icon={Wallet} accent="#f59e0b" />
              </div>
              <Card className="p-5">
                <h3 className="mb-3 text-base font-bold">Expense Breakdown</h3>
                <div className="h-48">
                  <DonutPie data={roiBreakdown} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {roiBreakdown.map((r) => (
                    <div key={r.name} className="flex items-center gap-2 text-xs">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: r.color }} />
                      <span className="font-semibold">{r.name}</span>
                      <span className="ml-auto text-text-muted">{gbp(r.value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {moreTab === "Documents" && (
            <Card className="mt-4 divide-y divide-border">
              {detailDocuments.map((d) => (
                <div key={d.name} className="flex items-center gap-3 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/12 text-info">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold">{d.name}</p>
                    <p className="text-xs text-text-muted">PDF · {d.size} · {d.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              ))}
            </Card>
          )}

          {moreTab === "Contacts" && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {detailContacts.map((c) => (
                <Card key={c.name} className="flex items-center gap-3 p-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <ContactIcon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{c.name}</p>
                    <p className="text-xs text-text-muted">{c.role} · {c.company}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {moreTab === "Market Data" && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <RoiCard label="Average Price" value="£485,000" icon={BarChart3} accent="#007aff" />
              <RoiCard label="Market Trend" value="+4.2%" icon={TrendingUp} accent="#10b981" />
              <RoiCard label="Avg Sell Time" value="28 days" icon={Calendar} accent="#f59e0b" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Details Tab ---------------- */
function DetailsTab({ property }: { property: Property }) {
  const rows = [
    { label: "% Rental Yield", value: "13.25%", icon: Percent },
    { label: "Monthly Rent", value: gbp(property.rent), icon: Wallet },
    { label: "Purchase Cost", value: gbp(property.value), icon: Landmark },
    { label: "Purchase Date", value: "1/1/2020", icon: Calendar },
    { label: "Tenure", value: "Freehold", icon: Building2 },
    { label: "Mortgage", value: gbp(1500), icon: Landmark },
    { label: "% Management Fees", value: "10%", icon: Percent },
    { label: "Beds", value: String(property.beds), icon: BedDouble },
    { label: "Baths", value: String(property.baths), icon: Bath },
    { label: "Size", value: property.size, icon: Ruler },
  ];

  const certs = [
    { name: "Gas Safety (CP12)", date: "15 Jan 2025", valid: false },
    { name: "Electrical (EICR)", date: "20 Jan 2027", valid: true },
    { name: "Smoke Alarm", date: "15 Mar 2025", valid: false },
    { name: "CO Alarm", date: "15 Mar 2025", valid: false },
  ];

  return (
    <div className="mt-4 space-y-4">
      {/* Stat rows */}
      <Card className="p-5">
        <h3 className="mb-4 text-base font-bold">Property Details</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center gap-3 rounded-xl border border-border p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <r.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-xs text-text-muted">{r.label}</p>
                <p className="text-sm font-bold">{r.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* EPC */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald/12 text-emerald"><Zap className="h-4 w-4" /></span>
            <h3 className="text-base font-bold">EPC Rating</h3>
          </div>
          <p className="text-sm text-text-muted">No EPC rating available</p>
        </Card>

        {/* Safety Certificates */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-info/12 text-info"><ShieldCheck className="h-4 w-4" /></span>
            <h3 className="text-base font-bold">Safety Certificates</h3>
          </div>
          <div className="space-y-2.5">
            {certs.map((c) => (
              <div key={c.name} className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-text-faint">{c.date}</p>
                </div>
                <Badge tone={c.valid ? "success" : "danger"}>{c.valid ? "Valid" : "Expired"}</Badge>
              </div>
            ))}
            <p className="pt-1 text-xs text-text-muted">Inspector: Mike Thompson</p>
          </div>
        </Card>

        {/* Managed By */}
        <Card className="p-5">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><UserCog className="h-4 w-4" /></span>
            <h3 className="text-base font-bold">Managed By</h3>
          </div>
          <p className="text-sm font-bold">John Smith</p>
          <p className="text-sm text-text-muted">Levin Property Management Ltd</p>
          <div className="mt-2 space-y-1 text-xs text-text-muted">
            <p className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> john.smith@levinproperties.com</p>
            <p className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> +44 20 7123 4567</p>
          </div>
        </Card>

        {/* Insurance */}
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/12 text-warning"><ShieldCheck className="h-4 w-4" /></span>
              <h3 className="text-base font-bold">Insurance</h3>
            </div>
            <Badge tone="danger">Expired</Badge>
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-text-muted">Provider</span><span className="font-semibold">State Farm</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Policy</span><span className="font-semibold">INS-2021-001</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Coverage</span><span className="font-semibold">{gbp(750000)}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Premium</span><span className="font-semibold">{gbp(1200)}/yr</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Small components ---------------- */
function MiniStat({ icon: Icon, accent, label, value }: { icon: React.ElementType; accent: string; label: string; value: string }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${accent}1a`, color: accent }}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-text-muted">{label}</p>
        <p className="text-lg font-extrabold">{value}</p>
      </div>
    </Card>
  );
}

function RoiCard({ label, value, icon: Icon, accent }: { label: string; value: string; icon: React.ElementType; accent: string }) {
  return (
    <Card className="p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${accent}1a`, color: accent }}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-xs text-text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-extrabold">{value}</p>
    </Card>
  );
}
