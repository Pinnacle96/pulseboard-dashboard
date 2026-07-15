import type {
  ActivityRecord,
  Metric,
  RevenuePoint,
  SegmentPoint,
  User
} from "../types/domain";

type JsonUser = {
  id: number;
  name: string;
  email: string;
  company: { name: string };
  address: { city: string };
};

type JsonPost = {
  id: number;
  userId: number;
  title: string;
};

const API_URL = "https://jsonplaceholder.typicode.com";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

const plans: ActivityRecord["plan"][] = ["Starter", "Growth", "Enterprise"];
const statuses: ActivityRecord["status"][] = ["Active", "Pending", "At risk"];

export async function fetchDashboardData() {
  const [users, posts] = await Promise.all([
    request<JsonUser[]>("/users"),
    request<JsonPost[]>("/posts")
  ]);

  const records: ActivityRecord[] = posts.slice(0, 30).map((post, index) => {
    const user = users.find((item) => item.id === post.userId) ?? users[0];

    return {
      id: post.id,
      customer: user.name,
      email: user.email,
      status: statuses[index % statuses.length],
      plan: plans[(post.userId + index) % plans.length],
      spend: 1200 + post.id * 137,
      joined: new Date(2026, index % 12, (index % 24) + 1).toISOString()
    };
  });

  const metrics: Metric[] = [
    { label: "Monthly revenue", value: "$128.4K", change: 12.5, tone: "brand" },
    { label: "Active customers", value: `${records.length}`, change: 8.2, tone: "teal" },
    { label: "Conversion rate", value: "7.8%", change: 2.1, tone: "amber" },
    { label: "At-risk accounts", value: "10", change: -3.4, tone: "coral" }
  ];

  const revenue: RevenuePoint[] = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(2026, index, 1).toLocaleString("en", { month: "short" }),
    revenue: 72000 + index * 5200 + (index % 3) * 4600,
    expenses: 39000 + index * 2800 + (index % 2) * 3100
  }));

  const segments: SegmentPoint[] = plans.map((plan) => ({
    name: plan,
    value: records.filter((record) => record.plan === plan).length
  }));

  return { metrics, revenue, segments, records };
}

export async function fetchProfile(): Promise<User> {
  const user = await request<JsonUser>("/users/1");

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: "Product Analytics Lead",
    location: user.address.city,
    company: user.company.name,
    avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      user.name
    )}`
  };
}
