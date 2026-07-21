"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageSquare, Pencil, Home, Calendar, Wallet, CheckCircle2 } from "lucide-react";
import { Card, Badge, Button, Avatar } from "@/components/ui/primitives";
import { tenants, properties, tenantTone } from "@/lib/data";
import { gbp, colorFromString } from "@/lib/utils";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

export default function TenantDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const t = tenants.find((x) => x.id === id);
  const property = properties.find((p) => t?.property.includes(p.name)) ?? properties[0];

  if (!t) {
    return (
      <div className="animate-in">
        <Link href="/tenants" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to tenants</Link>
        <Card className="p-10 text-center"><p className="font-semibold">Tenant not found.</p></Card>
      </div>
    );
  }

  const history = ["1 Jun 2026", "1 May 2026", "1 Apr 2026"];

  return (
    <div className="animate-in">
      <Link href="/tenants" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-text-muted hover:text-primary"><ArrowLeft className="h-4 w-4" /> Back to tenants</Link>

      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={t.name} color={colorFromString(t.name)} size={64} />
            <div>
              <h1 className="text-2xl font-extrabold">{t.name}</h1>
              <p className="text-sm text-text-muted">{t.email} • {t.phone}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge tone="neutral">Unit {t.unit}</Badge>
                <Badge tone="neutral">ID: {t.id.toUpperCase()}</Badge>
                <Badge tone={tenantTone(t.status)}>{t.status}</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><MessageSquare className="h-4 w-4" /> Message</Button>
            <Button variant="outline" size="sm"><Pencil className="h-4 w-4" /> Edit</Button>
          </div>
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-2 text-base font-bold"><Wallet className="h-4 w-4 text-primary" /> Lease Details</h3>
          <div className="divide-y divide-border">
            <Row label="Rent Amount" value={`${gbp(t.rent)}/mo`} />
            <Row label="Security Deposit" value={gbp(t.deposit)} />
            <Row label="Payment Frequency" value="Monthly" />
            <Row label="Payment Due Day" value="1st of the month" />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-2 text-base font-bold"><Calendar className="h-4 w-4 text-primary" /> Important Dates</h3>
          <div className="divide-y divide-border">
            <Row label="Lease Start" value={t.leaseStart || "—"} />
            <Row label="Lease End" value={t.leaseEnd || "—"} />
            <Row label="Last Rent Review" value="31 Dec 2025" />
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold"><Home className="h-4 w-4 text-primary" /> Property</h3>
          <Link href={`/properties/${property.id}`} className="flex items-center gap-3 rounded-xl border border-border p-3 transition hover:border-primary">
            <img src={property.image} alt={property.name} className="h-14 w-14 rounded-lg object-cover" />
            <div>
              <p className="font-semibold">{property.name}</p>
              <p className="text-xs text-text-muted">{property.address}</p>
            </div>
          </Link>
        </Card>

        <Card className="p-5">
          <h3 className="mb-2 flex items-center gap-2 text-base font-bold"><CheckCircle2 className="h-4 w-4 text-success" /> Payment History</h3>
          <div className="divide-y divide-border">
            {history.map((d) => (
              <div key={d} className="flex items-center justify-between py-2.5">
                <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" /> {d}</span>
                <span className="flex items-center gap-2"><span className="text-sm font-bold">{gbp(t.rent, { decimals: true })}</span><Badge tone="success">Paid</Badge></span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href={`mailto:${t.email}`}><Button variant="secondary" size="sm"><Mail className="h-4 w-4" /> {t.email}</Button></a>
        <a href={`tel:${t.phone}`}><Button variant="secondary" size="sm"><Phone className="h-4 w-4" /> {t.phone}</Button></a>
      </div>
    </div>
  );
}
