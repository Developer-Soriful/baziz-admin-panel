import {
  LayoutDashboard,
  Building2,
  Users,
  Home,
  CreditCard,
  Wrench,
  ClipboardCheck,
  FileText,
  Store,
  Receipt,
  BadgePoundSterling,
  Layers,
  LifeBuoy,
  MessageSquareWarning,
  Megaphone,
  ShieldCheck,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}
export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "User Management",
    items: [
      { label: "Landlords", href: "/landlords", icon: Building2, permission: "user_view" },
      { label: "Tenants", href: "/tenants", icon: Users, permission: "user_view" },
    ],
  },
  {
    title: "Subscriptions & Billing",
    items: [
      { label: "Subscriptions", href: "/subscriptions", icon: BadgePoundSterling, permission: "sub_view" },
      { label: "Plans", href: "/plans", icon: Layers, permission: "sub_view" },
      { label: "Transactions", href: "/transactions", icon: Receipt, permission: "billing_view" },
    ],
  },
  {
    title: "Platform Oversight",
    items: [
      { label: "Properties", href: "/properties", icon: Home, permission: "prop_view" },
      { label: "Payments", href: "/payments", icon: CreditCard, permission: "pay_view" },
      { label: "Maintenance", href: "/maintenance", icon: Wrench, permission: "maint_view" },
      { label: "Inspections", href: "/inspections", icon: ClipboardCheck, permission: "insp_view" },
      { label: "Marketplace", href: "/marketplace", icon: Store, permission: "mkt_moderate" },
      { label: "Documents", href: "/documents", icon: FileText, permission: "doc_view" },
    ],
  },
  {
    title: "Engagement",
    items: [
      { label: "Support Tickets", href: "/support", icon: LifeBuoy, permission: "support_view" },
      { label: "Complaints", href: "/complaints", icon: MessageSquareWarning, permission: "complaint_view" },
      { label: "Announcements", href: "/announcements", icon: Megaphone, permission: "comms_send" },
    ],
  },
  {
    title: "Administration",
    items: [
      { label: "Team & Roles", href: "/team", icon: ShieldCheck, permission: "team_manage" },
      { label: "Audit Log", href: "/audit-log", icon: ScrollText, permission: "audit_view" },
    ],
  },
];

export const bottomNav: NavItem[] = [
  { label: "Settings", href: "/settings", icon: Settings, permission: "settings_manage" },
];
