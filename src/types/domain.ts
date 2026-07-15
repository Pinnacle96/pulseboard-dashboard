export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  location: string;
  company: string;
  avatarUrl: string;
};

export type Metric = {
  label: string;
  value: string;
  change: number;
  tone: "brand" | "teal" | "amber" | "coral";
};

export type RevenuePoint = {
  month: string;
  revenue: number;
  expenses: number;
};

export type SegmentPoint = {
  name: string;
  value: number;
};

export type ActivityRecord = {
  id: number;
  customer: string;
  email: string;
  status: "Active" | "Pending" | "At risk";
  plan: "Starter" | "Growth" | "Enterprise";
  spend: number;
  joined: string;
};
