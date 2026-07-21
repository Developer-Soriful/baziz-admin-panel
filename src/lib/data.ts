// ============================================================
// PROPERTERA ADMIN — Platform-owner console mock data
// This console is for the PLATFORM OWNER (Propertera operator),
// NOT for individual landlords/tenants. It manages the whole
// platform: subscriptions, billing, all landlords & tenants,
// platform-wide oversight of the app + website, support, etc.
// ============================================================

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "primary";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=800`;

/* ============================================================
   USERS — Landlords & Tenants (platform accounts)
   ============================================================ */
export interface Landlord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  plan: "Free" | "Pro" | "Enterprise";
  status: "Active" | "Suspended" | "Pending";
  properties: number;
  tenants: number;
  monthlyRent: number;
  joined: string;
  verified: boolean;
  color: string;
}

export const landlords: Landlord[] = [
  { id: "ll_1", name: "James Anderson", email: "james@andersonlets.com", phone: "+44 7700 900101", company: "Anderson Lettings", plan: "Pro", status: "Active", properties: 14, tenants: 22, monthlyRent: 28400, joined: "12 Jan 2024", verified: true, color: "#7c3aed" },
  { id: "ll_2", name: "Priya Shah", email: "priya@shahproperties.co.uk", phone: "+44 7700 900102", company: "Shah Properties Ltd", plan: "Enterprise", status: "Active", properties: 41, tenants: 68, monthlyRent: 92600, joined: "3 Nov 2023", verified: true, color: "#0ea5e9" },
  { id: "ll_3", name: "Robert King", email: "rob.king@kingestates.com", phone: "+44 7700 900103", company: "King Estates", plan: "Pro", status: "Active", properties: 9, tenants: 12, monthlyRent: 18900, joined: "22 Feb 2024", verified: true, color: "#10b981" },
  { id: "ll_4", name: "Maria Lopez", email: "maria.lopez@gmail.com", phone: "+44 7700 900104", company: "Independent", plan: "Free", status: "Active", properties: 2, tenants: 3, monthlyRent: 3200, joined: "8 May 2024", verified: false, color: "#f59e0b" },
  { id: "ll_5", name: "David Chen", email: "d.chen@chenholdings.com", phone: "+44 7700 900105", company: "Chen Holdings", plan: "Pro", status: "Suspended", properties: 7, tenants: 10, monthlyRent: 14500, joined: "17 Dec 2023", verified: true, color: "#ec4899" },
  { id: "ll_6", name: "Sarah Mitchell", email: "sarah@buildmcr.com", phone: "+44 7700 900106", company: "Build MCR", plan: "Enterprise", status: "Active", properties: 33, tenants: 51, monthlyRent: 71200, joined: "1 Sep 2023", verified: true, color: "#6366f1" },
  { id: "ll_7", name: "Tom Bradley", email: "tom.bradley@outlook.com", phone: "+44 7700 900107", company: "Independent", plan: "Free", status: "Pending", properties: 1, tenants: 0, monthlyRent: 0, joined: "28 Jun 2026", verified: false, color: "#f43f5e" },
  { id: "ll_8", name: "Amelia Foster", email: "amelia@fosterrentals.co.uk", phone: "+44 7700 900108", company: "Foster Rentals", plan: "Pro", status: "Active", properties: 6, tenants: 8, monthlyRent: 11800, joined: "14 Mar 2024", verified: true, color: "#06b6d4" },
];

export interface Tenant {
  id: string;
  name: string;
  property: string;
  landlord: string;
  unit: string;
  status: "Active" | "Expiring" | "Overdue" | "New" | "Pending";
  rent: number;
  deposit: number;
  leaseStart: string;
  leaseEnd: string;
  email: string;
  phone: string;
  joined: string;
}

export const tenants: Tenant[] = [
  { id: "ten_1", name: "Alice Johnson", property: "Sunset Apartments, Unit 4B", landlord: "James Anderson", unit: "4B", status: "Active", rent: 1850, deposit: 2000, leaseStart: "2024-01-01", leaseEnd: "2024-12-31", email: "alice.j@example.com", phone: "+44 7700 900121", joined: "1 Jan 2024" },
  { id: "ten_2", name: "Mark Smith", property: "Oak Avenue Property, Unit 12", landlord: "Priya Shah", unit: "12", status: "Expiring", rent: 1200, deposit: 1500, leaseStart: "2023-03-01", leaseEnd: "2024-02-28", email: "mark.s@example.com", phone: "+44 7700 900456", joined: "1 Mar 2023" },
  { id: "ten_3", name: "Sarah Williams", property: "Skyline View Condos, Apt 9A", landlord: "James Anderson", unit: "9A", status: "Active", rent: 2500, deposit: 3000, leaseStart: "2024-06-01", leaseEnd: "2025-05-31", email: "sarah.w@example.com", phone: "+44 7700 900789", joined: "1 Jun 2024" },
  { id: "ten_4", name: "James Bond", property: "Lakeside Villas, No. 7", landlord: "Robert King", unit: "7", status: "Overdue", rent: 3000, deposit: 4000, leaseStart: "2023-01-01", leaseEnd: "2023-12-31", email: "james.b@example.com", phone: "+44 7700 900099", joined: "1 Jan 2023" },
  { id: "ten_5", name: "Emma Davis", property: "Harbor Terrace, Apt 2", landlord: "Maria Lopez", unit: "2", status: "Active", rent: 1650, deposit: 1800, leaseStart: "2024-04-01", leaseEnd: "2025-03-31", email: "emma.d@example.com", phone: "+44 7700 900222", joined: "1 Apr 2024" },
  { id: "ten_6", name: "Michael Brown", property: "Skyline View Condos, Apt 3C", landlord: "Sarah Mitchell", unit: "3C", status: "New", rent: 2350, deposit: 2600, leaseStart: "2026-06-01", leaseEnd: "2027-05-31", email: "michael.b@example.com", phone: "+44 7700 900333", joined: "1 Jun 2026" },
  { id: "ten_7", name: "Olivia Green", property: "City Heights, Unit 8", landlord: "Amelia Foster", unit: "8", status: "Active", rent: 1400, deposit: 1600, leaseStart: "2024-08-01", leaseEnd: "2025-07-31", email: "olivia.g@example.com", phone: "+44 7700 900444", joined: "1 Aug 2024" },
  { id: "ten_8", name: "Daniel Wright", property: "Park View, Apt 1", landlord: "Priya Shah", unit: "1", status: "Pending", rent: 1750, deposit: 2000, leaseStart: "2026-07-01", leaseEnd: "2027-06-30", email: "daniel.w@example.com", phone: "+44 7700 900555", joined: "20 Jun 2026" },
];

/* ============================================================
   SUBSCRIPTIONS & BILLING
   ============================================================ */
export interface Plan {
  id: string;
  name: string;
  price: number;
  interval: string;
  tagline: string;
  features: string[];
  propertyLimit: string;
  subscribers: number;
  active: boolean;
  popular?: boolean;
}
export const plans: Plan[] = [
  { id: "plan_free", name: "Free", price: 0, interval: "mo", tagline: "For getting started", features: ["Up to 3 properties", "Basic reports", "Tenant portal", "Community support"], propertyLimit: "3 properties", subscribers: 1240, active: true },
  { id: "plan_pro", name: "Pro", price: 19.99, interval: "mo", tagline: "For growing portfolios", features: ["Unlimited properties", "Advanced AI insights", "Tax & financial reports", "Marketplace & JV access", "Priority support"], propertyLimit: "Unlimited", subscribers: 486, active: true, popular: true },
  { id: "plan_ent", name: "Enterprise", price: 79.99, interval: "mo", tagline: "For agencies & scale", features: ["Everything in Pro", "Team & role management", "Dedicated account manager", "Custom integrations", "SLA & phone support"], propertyLimit: "Unlimited + teams", subscribers: 92, active: true },
];

export interface Subscription {
  id: string;
  customer: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  amount: number;
  status: "active" | "trialing" | "past_due" | "canceled";
  started: string;
  renews: string;
  seats: number;
}
export const subscriptions: Subscription[] = [
  { id: "sub_1", customer: "James Anderson", email: "james@andersonlets.com", plan: "Pro", amount: 19.99, status: "active", started: "12 Jan 2024", renews: "12 Jul 2026", seats: 1 },
  { id: "sub_2", customer: "Priya Shah", email: "priya@shahproperties.co.uk", plan: "Enterprise", amount: 79.99, status: "active", started: "3 Nov 2023", renews: "3 Aug 2026", seats: 8 },
  { id: "sub_3", customer: "Robert King", email: "rob.king@kingestates.com", plan: "Pro", amount: 19.99, status: "active", started: "22 Feb 2024", renews: "22 Jul 2026", seats: 1 },
  { id: "sub_4", customer: "David Chen", email: "d.chen@chenholdings.com", plan: "Pro", amount: 19.99, status: "past_due", started: "17 Dec 2023", renews: "17 Jul 2026", seats: 1 },
  { id: "sub_5", customer: "Sarah Mitchell", email: "sarah@buildmcr.com", plan: "Enterprise", amount: 79.99, status: "active", started: "1 Sep 2023", renews: "1 Aug 2026", seats: 6 },
  { id: "sub_6", customer: "Amelia Foster", email: "amelia@fosterrentals.co.uk", plan: "Pro", amount: 19.99, status: "trialing", started: "14 Jun 2026", renews: "14 Jul 2026", seats: 1 },
  { id: "sub_7", customer: "Kevin Hart", email: "kevin.h@example.com", plan: "Pro", amount: 19.99, status: "canceled", started: "2 Feb 2024", renews: "—", seats: 1 },
];

export interface Transaction {
  id: string;
  invoiceNo: string;
  customer: string;
  plan: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  method: string;
}
export const transactions: Transaction[] = [
  { id: "tx_1", invoiceNo: "INV-2026-0612", customer: "Priya Shah", plan: "Enterprise", amount: 79.99, date: "3 Jul 2026", status: "Paid", method: "Visa ···4242" },
  { id: "tx_2", invoiceNo: "INV-2026-0611", customer: "James Anderson", plan: "Pro", amount: 19.99, date: "1 Jul 2026", status: "Paid", method: "Mastercard ···8801" },
  { id: "tx_3", invoiceNo: "INV-2026-0610", customer: "David Chen", plan: "Pro", amount: 19.99, date: "1 Jul 2026", status: "Failed", method: "Visa ···1199" },
  { id: "tx_4", invoiceNo: "INV-2026-0609", customer: "Sarah Mitchell", plan: "Enterprise", amount: 79.99, date: "1 Jul 2026", status: "Paid", method: "Amex ···3007" },
  { id: "tx_5", invoiceNo: "INV-2026-0608", customer: "Robert King", plan: "Pro", amount: 19.99, date: "30 Jun 2026", status: "Paid", method: "Visa ···5521" },
  { id: "tx_6", invoiceNo: "INV-2026-0607", customer: "Kevin Hart", plan: "Pro", amount: 19.99, date: "28 Jun 2026", status: "Refunded", method: "Visa ···9002" },
  { id: "tx_7", invoiceNo: "INV-2026-0606", customer: "Amelia Foster", plan: "Pro", amount: 19.99, date: "27 Jun 2026", status: "Pending", method: "Mastercard ···4410" },
];

/* ============================================================
   SUPPORT / ENGAGEMENT
   ============================================================ */
export interface SupportTicket {
  id: string;
  subject: string;
  user: string;
  role: "Landlord" | "Tenant";
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved";
  channel: "App" | "Website" | "Email";
  date: string;
  message: string;
}
export const supportTickets: SupportTicket[] = [
  { id: "tk_1", subject: "Cannot upload lease document", user: "James Anderson", role: "Landlord", priority: "High", status: "Open", channel: "App", date: "2 Jul 2026", message: "The document upload keeps failing on the property detail screen." },
  { id: "tk_2", subject: "Rent payment not showing as paid", user: "Alice Johnson", role: "Tenant", priority: "High", status: "In Progress", channel: "Website", date: "1 Jul 2026", message: "I paid rent via card but it still shows pending in my portal." },
  { id: "tk_3", subject: "How do I upgrade to Enterprise?", user: "Robert King", role: "Landlord", priority: "Low", status: "Resolved", channel: "Email", date: "30 Jun 2026", message: "I'd like to add my team — which plan supports roles?" },
  { id: "tk_4", subject: "App crashes on maintenance tab", user: "Emma Davis", role: "Tenant", priority: "Medium", status: "Open", channel: "App", date: "29 Jun 2026", message: "Whenever I open the maintenance tab the app closes." },
  { id: "tk_5", subject: "Request invoice for June", user: "Priya Shah", role: "Landlord", priority: "Low", status: "Resolved", channel: "Website", date: "28 Jun 2026", message: "Can you send me the VAT invoice for last month?" },
];

export interface Announcement {
  id: string;
  title: string;
  body: string;
  audience: "All Users" | "Landlords" | "Tenants";
  channel: "App" | "Website" | "Email";
  status: "Draft" | "Scheduled" | "Sent";
  date: string;
}
export const announcements: Announcement[] = [
  { id: "an_1", title: "New Financial Calculators launched 🎉", body: "Pro users can now access Stamp Duty, ROI, Flip and Development appraisal calculators.", audience: "Landlords", channel: "App", status: "Sent", date: "1 Jul 2026" },
  { id: "an_2", title: "Scheduled maintenance — 6 Jul 02:00 BST", body: "Propertera will be briefly unavailable for scheduled maintenance.", audience: "All Users", channel: "Email", status: "Scheduled", date: "6 Jul 2026" },
  { id: "an_3", title: "Refer a landlord, get 1 month free", body: "Invite another landlord to Propertera and you both get a free month of Pro.", audience: "Landlords", channel: "Website", status: "Draft", date: "—" },
  { id: "an_4", title: "Rent reminders are now smarter", body: "Tenants now receive smart reminders 5 days before rent is due.", audience: "Tenants", channel: "App", status: "Sent", date: "24 Jun 2026" },
];

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  type: StatusTone;
}
export const auditLog: AuditEntry[] = [
  { id: "au_1", actor: "John Carter", action: "suspended landlord account", target: "David Chen", time: "2 Jul 2026 · 14:32", type: "danger" },
  { id: "au_2", actor: "Sofia Reyes", action: "issued refund", target: "INV-2026-0606 (£19.99)", time: "2 Jul 2026 · 11:05", type: "warning" },
  { id: "au_3", actor: "Daniel Okafor", action: "resolved support ticket", target: "TK-0003", time: "1 Jul 2026 · 16:48", type: "success" },
  { id: "au_4", actor: "Mei Lin", action: "removed marketplace listing", target: "Downtown Office Space", time: "1 Jul 2026 · 09:20", type: "info" },
  { id: "au_5", actor: "John Carter", action: "updated Pro plan pricing", target: "£19.99/mo", time: "30 Jun 2026 · 10:15", type: "primary" },
  { id: "au_6", actor: "Sofia Reyes", action: "sent announcement", target: "New Financial Calculators", time: "1 Jul 2026 · 08:00", type: "info" },
];

/* ============================================================
   PLATFORM OVERSIGHT (across all landlords)
   ============================================================ */
export interface Property {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  image: string;
  landlord: string;
  rent: number;
  value: number;
  status: "Occupied" | "Vacant";
  yield: number;
  beds: number;
  baths: number;
  size: string;
  entity: string;
  tenants: number;
}
export const properties: Property[] = [
  { id: "prop_1", name: "Sunset Apartments", type: "Apartment", address: "123 Main St, Anytown", city: "Anytown, CA", image: img("photo-1545324418-cc1a3fa10c00"), landlord: "James Anderson", rent: 1850, value: 500000, status: "Occupied", yield: 13.32, beds: 2, baths: 2, size: "1,200 sqft", entity: "Anderson Lettings", tenants: 3 },
  { id: "prop_2", name: "Oak Avenue Property", type: "Studio", address: "789 Oak Ave, Anytown", city: "Anytown, CA", image: img("photo-1512917774080-9991f1c4c750"), landlord: "Priya Shah", rent: 1200, value: 285000, status: "Vacant", yield: 9.1, beds: 1, baths: 1, size: "620 sqft", entity: "Shah Properties Ltd", tenants: 0 },
  { id: "prop_3", name: "Skyline View Condos", type: "Condo", address: "456 Market St, San Francisco", city: "San Francisco, CA", image: img("photo-1600585154340-be6199f7e009"), landlord: "James Anderson", rent: 2500, value: 720000, status: "Occupied", yield: 6.5, beds: 3, baths: 2, size: "1,450 sqft", entity: "Anderson Lettings", tenants: 2 },
  { id: "prop_4", name: "Lakeside Villas", type: "House", address: "No. 7 Lakeside Dr, Windermere", city: "Windermere, UK", image: img("photo-1580587771525-78b9dba3b914"), landlord: "Robert King", rent: 3000, value: 875000, status: "Occupied", yield: 7.8, beds: 4, baths: 3, size: "2,300 sqft", entity: "King Estates", tenants: 1 },
  { id: "prop_5", name: "Harbor Terrace", type: "Apartment", address: "22 Dockside Rd, Bristol", city: "Bristol, UK", image: img("photo-1512918728675-ed5a9ecdebfd"), landlord: "Maria Lopez", rent: 1650, value: 410000, status: "Occupied", yield: 8.4, beds: 2, baths: 1, size: "980 sqft", entity: "Independent", tenants: 2 },
  { id: "prop_6", name: "Manchester Studio", type: "Studio", address: "9 Deansgate, Manchester", city: "Manchester, UK", image: img("photo-1502672260266-1c1ef2d93688"), landlord: "Sarah Mitchell", rent: 1100, value: 240000, status: "Vacant", yield: 9.6, beds: 1, baths: 1, size: "540 sqft", entity: "Build MCR", tenants: 0 },
];

export interface Payment {
  id: string;
  label: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
  tenant: string;
  property: string;
  landlord: string;
}
export const payments: Payment[] = [
  { id: "pay_1", label: "June 2026 Rent", amount: 1850, date: "1 Jun 2026", status: "Paid", tenant: "Alice Johnson", property: "Sunset Apartments", landlord: "James Anderson" },
  { id: "pay_2", label: "June 2026 Rent", amount: 2500, date: "1 Jun 2026", status: "Paid", tenant: "Sarah Williams", property: "Skyline View Condos", landlord: "James Anderson" },
  { id: "pay_3", label: "June 2026 Rent", amount: 3000, date: "1 Jun 2026", status: "Overdue", tenant: "James Bond", property: "Lakeside Villas", landlord: "Robert King" },
  { id: "pay_4", label: "June 2026 Rent", amount: 1650, date: "1 Jun 2026", status: "Paid", tenant: "Emma Davis", property: "Harbor Terrace", landlord: "Maria Lopez" },
  { id: "pay_5", label: "May 2026 Rent", amount: 1850, date: "1 May 2026", status: "Paid", tenant: "Alice Johnson", property: "Sunset Apartments", landlord: "James Anderson" },
  { id: "pay_6", label: "May 2026 Rent", amount: 1200, date: "1 May 2026", status: "Pending", tenant: "Mark Smith", property: "Oak Avenue Property", landlord: "Priya Shah" },
  { id: "pay_7", label: "May 2026 Rent", amount: 2500, date: "1 May 2026", status: "Paid", tenant: "Sarah Williams", property: "Skyline View Condos", landlord: "James Anderson" },
  { id: "pay_8", label: "April 2026 Rent", amount: 1850, date: "1 Apr 2026", status: "Paid", tenant: "Alice Johnson", property: "Sunset Apartments", landlord: "James Anderson" },
];

export interface MaintenanceTicket {
  id: string; title: string; description: string; property: string; landlord: string; tenant: string;
  priority: "Low" | "Normal" | "High" | "Urgent" | "Emergency";
  status: "scheduled" | "active" | "completed" | "cancelled";
  cost: number; category: string; date: string;
}
export const maintenance: MaintenanceTicket[] = [
  { id: "mnt_1", title: "HVAC System Service", description: "Annual servicing of the HVAC system at 123 Main St", property: "Sunset Apartments", landlord: "James Anderson", tenant: "Alice Johnson", priority: "Normal", status: "scheduled", cost: 200, category: "Heating", date: "15/1/2026" },
  { id: "mnt_2", title: "Plumbing Inspection", description: "Monthly plumbing check at Oak Avenue Property", property: "Oak Avenue Property", landlord: "Priya Shah", tenant: "Mark Smith", priority: "Normal", status: "scheduled", cost: 100, category: "Plumbing", date: "15/1/2026" },
  { id: "mnt_3", title: "Emergency Leak Repair", description: "Tenant reported leaky kitchen sink - urgent fix required", property: "Skyline View Condos", landlord: "James Anderson", tenant: "Sarah Williams", priority: "Urgent", status: "active", cost: 350, category: "Plumbing", date: "15/6/2026" },
  { id: "mnt_4", title: "Roof Leak Repair", description: "Fixed leak in master bedroom ceiling", property: "Sunset Apartments", landlord: "James Anderson", tenant: "Alice Johnson", priority: "High", status: "completed", cost: 750, category: "Structural", date: "20/12/2025" },
  { id: "mnt_5", title: "Garbage Disposal Replacement", description: "Replaced faulty garbage disposal unit", property: "Oak Avenue Property", landlord: "Priya Shah", tenant: "Mark Smith", priority: "Normal", status: "completed", cost: 320, category: "Appliance", date: "15/12/2025" },
  { id: "mnt_6", title: "Boiler Annual Service", description: "Gas safety check and boiler service", property: "Lakeside Villas", landlord: "Robert King", tenant: "James Bond", priority: "High", status: "active", cost: 180, category: "Heating", date: "2/6/2026" },
];

export interface Inspection {
  id: string; title: string; tag: "Routine" | "Move In" | "Move Out"; description: string;
  property: string; landlord: string; inspector: string; date: string; status: "Scheduled" | "Overdue" | "Valid";
}
export const inspections: Inspection[] = [
  { id: "insp_1", title: "Quarterly Property Inspection", tag: "Routine", description: "Routine quarterly inspection of property condition", property: "Sunset Apartments", landlord: "James Anderson", inspector: "John Smith", date: "15/1/2026", status: "Scheduled" },
  { id: "insp_2", title: "Move-In Inspection", tag: "Move In", description: "Pre-tenancy inspection for new tenant", property: "Oak Avenue Property", landlord: "Priya Shah", inspector: "Sarah Jones", date: "1/2/2026", status: "Scheduled" },
  { id: "insp_3", title: "Annual Safety Inspection", tag: "Routine", description: "Overdue annual safety and compliance check", property: "Lakeside Villas", landlord: "Robert King", inspector: "Tom Brown", date: "15/12/2025", status: "Overdue" },
  { id: "insp_4", title: "Move-Out Inspection", tag: "Move Out", description: "Final inspection after tenant move-out", property: "Harbor Terrace", landlord: "Maria Lopez", inspector: "Mike Wilson", date: "28/12/2025", status: "Valid" },
];

export interface DocItem { id: string; name: string; type: string; size: string; date: string; landlord: string; property?: string; shared?: boolean; }
export const documents: DocItem[] = [
  { id: "doc_1", name: "Mortgage Agreement - Mountain View", type: "Mortgage", size: "3.2 MB", date: "1 Apr 2023", landlord: "James Anderson" },
  { id: "doc_2", name: "Lease Agreement - Unit 4B", type: "Leases", size: "1.1 MB", date: "5 Jan 2024", landlord: "James Anderson" },
  { id: "doc_3", name: "Insurance Policy 2024", type: "Insurance", size: "812 KB", date: "12 Mar 2024", landlord: "Priya Shah" },
  { id: "doc_4", name: "Inspection Report Q1", type: "Inspections", size: "2.4 MB", date: "20 Feb 2024", landlord: "Robert King" },
  { id: "doc_5", name: "EPC Certificate - Harbor Terrace", type: "Other", size: "640 KB", date: "3 May 2024", landlord: "Maria Lopez" },
];

export interface MarketplaceListing {
  id: string; title: string; location: string; price: number; type: string; size: string; yield: number;
  listedDays: string; description: string; imageUrl: string; epcRating: string; ownershipPercent: number;
  seller?: string; flagged?: boolean;
}
export const marketplace: MarketplaceListing[] = [
  { id: "mkt_1", title: "Sunset Apartments", location: "Anytown, CA", price: 285000, type: "Apartment", size: "1,200 sq ft", yield: 6.2, listedDays: "12d", description: "Modern flat in excellent condition with high rental demand.", imageUrl: img("photo-1522708323590-d24dbb6b0267"), epcRating: "A", ownershipPercent: 50, seller: "James Anderson", flagged: false },
  { id: "mkt_2", title: "Downtown Office Space", location: "Metropolis, NY", price: 1250000, type: "Commercial", size: "4,500 sq ft", yield: 8.5, listedDays: "3d", description: "Prime commercial real estate in the heart of the business district.", imageUrl: img("photo-1497366216548-37526070297c"), epcRating: "B", ownershipPercent: 100, seller: "Priya Shah", flagged: true },
  { id: "mkt_3", title: "Riverside Townhouse", location: "Leeds, UK", price: 420000, type: "House", size: "1,850 sq ft", yield: 5.4, listedDays: "8d", description: "Contemporary townhouse with river views and private parking.", imageUrl: img("photo-1568605114967-8130f3a36994"), epcRating: "A", ownershipPercent: 100, seller: "Sarah Mitchell", flagged: false },
];
export interface JointVenture {
  id: string; title: string; projectType: string; investmentModel: string; risk: string; location: string;
  description: string; investmentNeeded: number; expectedReturn: number; timeline: string; partners: string;
  views: number; inquiries: number; daysOnMarket: string; totalProjectCost: number; imageUrl: string;
  leadPartnerName: string; leadPartnerContact: string;
}
export const jointVentures: JointVenture[] = [
  { id: "jv1", title: "Central Manchester Development Project", projectType: "Development", investmentModel: "equity based", risk: "MEDIUM Risk", location: "Manchester City Centre", description: "Premium residential development in the heart of Manchester city centre.", investmentNeeded: 1500000, expectedReturn: 25, timeline: "24 months", partners: "2 partners needed", views: 24, inquiries: 6, daysOnMarket: "5 days on market", totalProjectCost: 2500000, imageUrl: img("photo-1486406146926-c627a92ad1ab"), leadPartnerName: "Sarah Mitchell", leadPartnerContact: "sarah.mitchell@buildmcr.com" },
  { id: "jv2", title: "Victorian HMO Refurbishment Portfolio", projectType: "Refurbishment", investmentModel: "profit sharing", risk: "LOW Risk", location: "Sheffield, South Yorkshire", description: "Acquisition and comprehensive retrofitting of three Victorian terraced houses.", investmentNeeded: 350000, expectedReturn: 18, timeline: "8 months", partners: "3 partners needed", views: 42, inquiries: 12, daysOnMarket: "12 days on market", totalProjectCost: 650000, imageUrl: img("photo-1512917774080-9991f1c4c750"), leadPartnerName: "James Carter", leadPartnerContact: "j.carter@shefproperties.co.uk" },
];

export interface Complaint {
  id: string; tenant: string; property: string; landlord: string; category: string; title: string;
  description: string; urgency: "Low" | "Medium" | "High"; status: "Open" | "In Review" | "Resolved"; date: string;
}
export const complaints: Complaint[] = [
  { id: "c1", tenant: "Alice Johnson", property: "Sunset Apartments, Unit 4B", landlord: "James Anderson", category: "Property Condition", title: "Mould in Bathroom Ceiling", description: "There is visible mould growing on the bathroom ceiling near the extractor fan.", urgency: "High", status: "In Review", date: "12 May 2026" },
  { id: "c2", tenant: "James Bond", property: "Lakeside Villas, No. 7", landlord: "Robert King", category: "Noise", title: "Persistent Late-Night Noise", description: "Neighbouring unit plays loud music past midnight on weekdays.", urgency: "Medium", status: "Open", date: "3 Jun 2026" },
  { id: "c3", tenant: "Emma Davis", property: "Harbor Terrace, Apt 2", landlord: "Maria Lopez", category: "Billing", title: "Incorrect Service Charge", description: "The service charge on my last statement appears higher than agreed.", urgency: "Low", status: "Resolved", date: "18 Apr 2026" },
];

/* Kept for compatibility with any legacy pages (not in primary nav) */
export interface OwnershipEntity { id: string; name: string; type: string; description: string; properties: number; taxRef: string; color: string; }
export const ownershipEntities: OwnershipEntity[] = [
  { id: "own_1", name: "Personal Portfolio", type: "Personal", description: "Properties owned personally", properties: 3, taxRef: "GB123456789", color: "#7c3aed" },
  { id: "own_2", name: "ABC Property Ltd", type: "Limited Company", description: "Commercial property holdings", properties: 3, taxRef: "GB987654321", color: "#10b981" },
];
export interface Project { id: string; title: string; description: string; address: string; type: string; priority: "low" | "medium" | "high" | "urgent"; status: "planning" | "in-progress" | "on-hold" | "completed"; budget: number; spent: number; contingency: number; startDate: string; endDate: string; progress: number; tasksCount: number; expensesCount: number; }
export const projects: Project[] = [
  { id: "proj_1", title: "Kitchen Renovation - Oak Street", description: "Complete kitchen remodel including new cabinets, countertops, and appliances", address: "123 Oak Street, Manchester", type: "renovation", priority: "high", status: "in-progress", budget: 25000, spent: 13500, contingency: 2500, startDate: "15 Jan 2026", endDate: "15 Mar 2026", progress: 50, tasksCount: 2, expensesCount: 3 },
  { id: "proj_2", title: "Bathroom Upgrade - Pine Avenue", description: "Modern bathroom installation with walk-in shower", address: "456 Pine Avenue, Liverpool", type: "renovation", priority: "medium", status: "planning", budget: 12000, spent: 0, contingency: 1200, startDate: "1 Mar 2026", endDate: "15 Apr 2026", progress: 0, tasksCount: 1, expensesCount: 0 },
];
export interface Contact { id: string; company: string; badge: string; person: string; phone: string; email: string; notes: string; added: string; }
export const contacts: Contact[] = [
  { id: "cont_1", company: "Swift Plumbing Ltd", badge: "Plumber", person: "John Swift", phone: "555-123-4567", email: "john@swiftplumbing.com", notes: "Good for emergency calls", added: "15/1/2025" },
  { id: "cont_2", company: "Bright Spark Electrical", badge: "Electrician", person: "Sarah Johnson", phone: "555-987-6543", email: "sarah@brightspark.com", notes: "Specializes in rewiring", added: "22/9/2022" },
];
export interface TaskItem { id: string; title: string; property: string; priority: "High" | "Medium" | "Low" | "Completed"; due: string; bucket: "Today" | "Upcoming" | "Completed"; done: boolean; }
export const tasks: TaskItem[] = [
  { id: "task_1", title: "Review flagged marketplace listing", property: "Downtown Office Space", priority: "High", due: "10:00 AM", bucket: "Today", done: false },
  { id: "task_2", title: "Follow up on past-due subscription", property: "David Chen", priority: "Medium", due: "02:00 PM", bucket: "Today", done: false },
  { id: "task_3", title: "Approve Enterprise onboarding", property: "Build MCR", priority: "Low", due: "Tomorrow", bucket: "Upcoming", done: false },
];

/* ============================================================
   PLATFORM DASHBOARD KPIs & CHARTS
   ============================================================ */
export const mrrByMonth = [
  { month: "Jan", mrr: 6800, newMrr: 900 },
  { month: "Feb", mrr: 7400, newMrr: 1100 },
  { month: "Mar", mrr: 8100, newMrr: 1300 },
  { month: "Apr", mrr: 8600, newMrr: 950 },
  { month: "May", mrr: 9400, newMrr: 1200 },
  { month: "Jun", mrr: 10250, newMrr: 1400 },
];
export const signupsByMonth = [
  { month: "Jan", landlords: 42, tenants: 118 },
  { month: "Feb", landlords: 55, tenants: 143 },
  { month: "Mar", landlords: 61, tenants: 170 },
  { month: "Apr", landlords: 48, tenants: 155 },
  { month: "May", landlords: 72, tenants: 198 },
  { month: "Jun", landlords: 84, tenants: 221 },
];
export const planDistribution = [
  { name: "Free", value: 1240, color: "#8e8e93" },
  { name: "Pro", value: 486, color: "#008577" },
  { name: "Enterprise", value: 92, color: "#7c3aed" },
];
export const subStatusData = [
  { name: "Active", value: 512, color: "#34c759" },
  { name: "Trialing", value: 41, color: "#007aff" },
  { name: "Past Due", value: 18, color: "#ff9500" },
  { name: "Canceled", value: 7, color: "#ff3b30" },
];
export const propertyPins = [
  { name: "Anderson Lettings", lat: 51.5074, lng: -0.1278, status: "Occupied" },
  { name: "Foster Rentals", lat: 51.4995, lng: -0.1248, status: "Occupied" },
  { name: "Build MCR", lat: 53.4808, lng: -2.2426, status: "Vacant" },
  { name: "King Estates", lat: 54.3781, lng: -2.9382, status: "Occupied" },
];
export const recentActivity = [
  { id: "a1", who: "Tom Bradley", action: "signed up as a landlord (Free)", amount: "New", time: "20m ago", tone: "info" as StatusTone },
  { id: "a2", who: "Priya Shah", action: "renewed Enterprise subscription", amount: "£79.99", time: "2h ago", tone: "success" as StatusTone },
  { id: "a3", who: "David Chen", action: "payment failed — subscription past due", amount: "£19.99", time: "5h ago", tone: "danger" as StatusTone },
  { id: "a4", who: "Alice Johnson", action: "opened a support ticket", amount: "High", time: "1d ago", tone: "warning" as StatusTone },
  { id: "a5", who: "Amelia Foster", action: "started a Pro trial", amount: "Trial", time: "1d ago", tone: "info" as StatusTone },
];

/* ============================================================
   PLATFORM ADMIN ROLES & PERMISSIONS
   ============================================================ */
export interface Role { id: string; name: string; color: string; description: string; isSystem: boolean; permissions: string[]; }
export interface PermissionDef { key: string; label: string; category: string; sensitive?: boolean; }

export const permissionDefs: PermissionDef[] = [
  { key: "user_view", label: "View users", category: "Users" },
  { key: "landlord_manage", label: "Manage landlords", category: "Users" },
  { key: "tenant_manage", label: "Manage tenants", category: "Users" },
  { key: "sub_view", label: "View subscriptions", category: "Subscriptions" },
  { key: "sub_manage", label: "Manage subscriptions", category: "Subscriptions" },
  { key: "plan_manage", label: "Manage plans", category: "Subscriptions" },
  { key: "billing_view", label: "View transactions", category: "Billing", sensitive: true },
  { key: "billing_refund", label: "Issue refunds", category: "Billing", sensitive: true },
  { key: "prop_view", label: "View all properties", category: "Platform" },
  { key: "pay_view", label: "View all payments", category: "Platform" },
  { key: "maint_view", label: "View maintenance", category: "Platform" },
  { key: "insp_view", label: "View inspections", category: "Platform" },
  { key: "doc_view", label: "View documents", category: "Platform" },
  { key: "mkt_moderate", label: "Moderate marketplace", category: "Platform" },
  { key: "support_view", label: "View support tickets", category: "Support" },
  { key: "support_respond", label: "Respond to tickets", category: "Support" },
  { key: "complaint_view", label: "View complaints", category: "Support" },
  { key: "comms_send", label: "Send announcements", category: "Communications" },
  { key: "team_manage", label: "Manage admin team", category: "Administration" },
  { key: "audit_view", label: "View audit log", category: "Administration" },
  { key: "settings_manage", label: "Manage platform settings", category: "Administration" },
];
const ALL = permissionDefs.map((p) => p.key);
const VIEW_ONLY = ["user_view", "sub_view", "billing_view", "prop_view", "pay_view", "maint_view", "insp_view", "doc_view", "support_view", "complaint_view", "audit_view"];

export const roles: Role[] = [
  { id: "superadmin", name: "Super Admin", color: "#7c3aed", description: "Full platform control including billing, team and settings.", isSystem: true, permissions: ALL },
  { id: "finance", name: "Finance Manager", color: "#10b981", description: "Subscriptions, plans, transactions, refunds and revenue.", isSystem: true, permissions: ["user_view", "sub_view", "sub_manage", "plan_manage", "billing_view", "billing_refund", "prop_view", "pay_view", "audit_view"] },
  { id: "support", name: "Support Agent", color: "#007aff", description: "Assist users, manage support tickets and complaints.", isSystem: true, permissions: ["user_view", "tenant_manage", "support_view", "support_respond", "complaint_view", "comms_send"] },
  { id: "moderator", name: "Content Moderator", color: "#f59e0b", description: "Moderate marketplace listings, properties and announcements.", isSystem: true, permissions: ["user_view", "prop_view", "doc_view", "mkt_moderate", "comms_send"] },
  { id: "analyst", name: "Analyst", color: "#8e8e93", description: "Read-only access across the whole platform for reporting.", isSystem: true, permissions: VIEW_ONLY },
];

export interface TeamMember { id: string; name: string; email: string; roleId: string; status: "active" | "pending"; properties: string; }
export const teamMembers: TeamMember[] = [
  { id: "tm_1", name: "John Carter", email: "superadmin@propertera.com", roleId: "superadmin", status: "active", properties: "Platform owner" },
  { id: "tm_2", name: "Sofia Reyes", email: "finance@propertera.com", roleId: "finance", status: "active", properties: "Billing & revenue" },
  { id: "tm_3", name: "Daniel Okafor", email: "support@propertera.com", roleId: "support", status: "active", properties: "Support desk" },
  { id: "tm_4", name: "Mei Lin", email: "moderator@propertera.com", roleId: "moderator", status: "active", properties: "Moderation" },
  { id: "tm_5", name: "Alex Morgan", email: "analyst@propertera.com", roleId: "analyst", status: "pending", properties: "Reporting" },
];

/* ============================================================
   Tone helpers
   ============================================================ */
export function paymentTone(status: Payment["status"]): StatusTone { return status === "Paid" ? "success" : status === "Pending" ? "warning" : "danger"; }
export function tenantTone(status: Tenant["status"]): StatusTone {
  switch (status) { case "Active": return "success"; case "Expiring": return "warning"; case "Overdue": return "danger"; case "New": return "info"; default: return "neutral"; }
}
export function maintTone(status: MaintenanceTicket["status"]): StatusTone {
  switch (status) { case "completed": return "success"; case "active": return "info"; case "scheduled": return "warning"; default: return "danger"; }
}
export function inspectionTone(status: Inspection["status"]): StatusTone { return status === "Valid" ? "success" : status === "Scheduled" ? "primary" : "danger"; }
export function priorityTone(p: string): StatusTone { const v = p.toLowerCase(); if (["high", "urgent", "emergency"].includes(v)) return "danger"; if (["medium", "normal"].includes(v)) return "warning"; if (v === "completed") return "success"; if (v === "low") return "info"; return "neutral"; }
export function projectStatusTone(s: Project["status"]): StatusTone { switch (s) { case "completed": return "success"; case "in-progress": return "info"; case "on-hold": return "warning"; default: return "neutral"; } }
export function complaintTone(s: Complaint["status"]): StatusTone { return s === "Resolved" ? "success" : s === "In Review" ? "info" : "warning"; }
export function landlordTone(s: Landlord["status"]): StatusTone { return s === "Active" ? "success" : s === "Suspended" ? "danger" : "warning"; }
export function planTone(p: string): StatusTone { return p === "Enterprise" ? "primary" : p === "Pro" ? "success" : "neutral"; }
export function subTone(s: Subscription["status"]): StatusTone { switch (s) { case "active": return "success"; case "trialing": return "info"; case "past_due": return "warning"; default: return "danger"; } }
export function txnTone(s: Transaction["status"]): StatusTone { switch (s) { case "Paid": return "success"; case "Pending": return "warning"; case "Failed": return "danger"; default: return "neutral"; } }
export function ticketTone(s: SupportTicket["status"]): StatusTone { return s === "Resolved" ? "success" : s === "In Progress" ? "info" : "warning"; }
export function announceTone(s: Announcement["status"]): StatusTone { return s === "Sent" ? "success" : s === "Scheduled" ? "info" : "neutral"; }
