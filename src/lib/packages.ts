export const UNLIMITED_QUOTA = 999999;

export function formatQuota(quota: number): string {
  return quota >= UNLIMITED_QUOTA ? "Unlimited" : String(quota);
}

export type BillingInterval = "free" | "monthly" | "yearly";

export interface Package {
  name: string;
  quota: number;
  price: string;
  interval: BillingInterval;
}

export const EXPORTER_PACKAGES: Package[] = [
  { name: "Free", quota: 2, price: "KES 0", interval: "free" },
  { name: "Growth", quota: 20, price: "KES 3,500/month", interval: "monthly" },
  { name: "Scale", quota: 60, price: "KES 8,000/month", interval: "monthly" },
  { name: "Enterprise", quota: 100, price: "KES 12,000/month", interval: "monthly" },
  { name: "Unlimited", quota: UNLIMITED_QUOTA, price: "KES 18,000/month", interval: "monthly" },
];

export const DEALER_PACKAGES: Package[] = [
  { name: "Free", quota: 2, price: "KES 0", interval: "free" },
  { name: "Unlimited (Monthly)", quota: UNLIMITED_QUOTA, price: "KES 2,500/month", interval: "monthly" },
  { name: "Unlimited (Yearly)", quota: UNLIMITED_QUOTA, price: "KES 25,000/year", interval: "yearly" },
];

export function computeRenewalDate(interval: BillingInterval): string | null {
  if (interval === "free") return null;
  const date = new Date();
  if (interval === "monthly") date.setMonth(date.getMonth() + 1);
  if (interval === "yearly") date.setFullYear(date.getFullYear() + 1);
  return date.toISOString();
}