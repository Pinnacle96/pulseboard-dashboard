import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table";
import { ArrowDownUp, Download, RefreshCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { fetchDashboardData } from "@/lib/api";
import type { ActivityRecord, Metric } from "@/types/domain";
import { cn } from "@/lib/cn";

const segmentColors = ["#275efe", "#0e9f8f", "#f6c85f"];

const columns: ColumnDef<ActivityRecord>[] = [
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-ink">{row.original.customer}</p>
        <p className="text-xs text-muted">{row.original.email}</p>
      </div>
    )
  },
  { accessorKey: "plan", header: "Plan" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<ActivityRecord["status"]>();
      return (
        <span
          className={cn(
            "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
            status === "Active" && "bg-emerald-50 text-emerald-700",
            status === "Pending" && "bg-amber-50 text-amber-700",
            status === "At risk" && "bg-rose-50 text-rose-700"
          )}
        >
          {status}
        </span>
      );
    }
  },
  {
    accessorKey: "spend",
    header: "Spend",
    cell: ({ getValue }) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }).format(getValue<number>())
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ getValue }) =>
      new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }).format(new Date(getValue<string>()))
  }
];

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-muted">{metric.label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold text-ink">{metric.value}</p>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-bold",
            metric.change >= 0
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          )}
        >
          {metric.change >= 0 ? "+" : ""}
          {metric.change}%
        </span>
      </div>
    </article>
  );
}

function SkeletonDashboard() {
  return (
    <div className="grid gap-6">
      <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-200" />
        ))}
      </div>
      <div className="h-96 animate-pulse rounded-lg bg-slate-200" />
    </div>
  );
}

export function DashboardPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData
  });

  const table = useReactTable({
    data: data?.records ?? [],
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const totalSpend = useMemo(
    () => data?.records.reduce((sum, record) => sum + record.spend, 0) ?? 0,
    [data?.records]
  );

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (isError || !data) {
    return (
      <section className="grid min-h-[70vh] place-items-center">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-soft">
          <h1 className="text-2xl font-bold text-ink">Dashboard unavailable</h1>
          <p className="mt-3 text-muted">
            We could not load the analytics data. Check your connection and try
            again.
          </p>
          <Button className="mt-6" onClick={() => refetch()}>
            <RefreshCcw aria-hidden="true" size={18} />
            Retry
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-ink">Business overview</h1>
          <p className="mt-2 text-muted">
            Revenue, customer activity, and account health from live API data.
          </p>
        </div>
        <Button variant="secondary">
          <Download aria-hidden="true" size={18} />
          Export
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-ink">Revenue trend</h2>
              <p className="text-sm text-muted">
                Total tracked spend: ${totalSpend.toLocaleString()}
              </p>
            </div>
            {isFetching ? (
              <span className="text-sm font-semibold text-brand">Refreshing</span>
            ) : null}
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenue} margin={{ left: 0, right: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#275efe"
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#e85d75"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Plan distribution</h2>
          <p className="text-sm text-muted">Accounts by subscription tier</p>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.segments}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={4}
                >
                  {data.segments.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={segmentColors[index % segmentColors.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid gap-2">
            {data.segments.map((segment, index) => (
              <div key={segment.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-muted">
                  <span
                    className="size-3 rounded-sm"
                    style={{
                      backgroundColor: segmentColors[index % segmentColors.length]
                    }}
                  />
                  {segment.name}
                </span>
                <span className="font-bold text-ink">{segment.value}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-bold text-ink">Customer activity</h2>
            <p className="text-sm text-muted">Sortable and filterable account list</p>
          </div>
          <label className="relative block md:w-80">
            <Search
              aria-hidden="true"
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <span className="sr-only">Filter customers</span>
            <input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder="Search customers..."
              className="min-h-11 w-full rounded-md border border-slate-200 pl-10 pr-3 text-sm shadow-sm focus:border-brand"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-slate-200">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 pr-4 font-bold text-muted">
                      <button
                        className="flex items-center gap-2 rounded-md py-1 text-left hover:text-ink"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <ArrowDownUp aria-hidden="true" size={14} />
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-4 pr-4 text-muted">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-10 text-center text-muted" colSpan={columns.length}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
