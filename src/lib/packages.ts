// Internally, "Unlimited" is represented as a very large number rather than
// a separate nullable field — this keeps every existing "count < quota"
// check working unchanged. formatQuota() below is what turns this back
// into the word "Unlimited" wherever it's displayed.
export const UNLIMITED_QUOTA = 999999;

export function formatQuota(quota: number): string {
  return quota >= UNLIMITED_QUOTA ? "Unlimited" : String(quota);
}

export interface Package {
  name: string;
  quota: number;
  price: string;
}

export const EXPORTER_PACKAGES: Package[] = [
  { name: "Free", quota: 2, price: "KES 0" },
  { name: "Growth", quota: 20, price: "KES 3,500/month" },
  { name: "Scale", quota: 60, price: "KES 8,000/month" },
  { name: "Enterprise", quota: 100, price: "KES 12,000/month" },
  { name: "Unlimited", quota: UNLIMITED_QUOTA, price: "KES 18,000/month" },
];

export const DEALER_PACKAGES: Package[] = [
  { name: "Free", quota: 2, price: "KES 0" },
  { name: "Unlimited (Monthly)", quota: UNLIMITED_QUOTA, price: "KES 2,500/month" },
  { name: "Unlimited (Yearly)", quota: UNLIMITED_QUOTA, price: "KES 25,000/year" },
];
