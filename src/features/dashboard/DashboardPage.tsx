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
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type PaginationState,
  type SortingState
} from "@tanstack/react-table";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCcw,
  Search
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { fetchDashboardData } from "../../lib/api";
import type { ActivityRecord, Metric } from "../../types/domain";
import { cn } from "../../lib/cn";

const segmentColors = ["#275efe", "#0e9f8f", "#f6c85f"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));

function StatusBadge({ status }: { status: ActivityRecord["status"] }) {
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
      return <StatusBadge status={status} />;
    }
  },
  {
    accessorKey: "spend",
    header: "Spend",
    cell: ({ getValue }) => formatCurrency(getValue<number>())
  },
  {
    accessorKey: "joined",
    header: "Joined",
    cell: ({ getValue }) => formatDate(getValue<string>())
  }
];

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <p className="text-sm font-semibold text-muted">{metric.label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-2xl font-bold leading-none text-ink">{metric.value}</p>
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
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 8
  });
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData
  });

  const table = useReactTable({
    data: data?.records ?? [],
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
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
    <section className="grid gap-5 sm:gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center lg:hidden">
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

      <div className="hidden items-center justify-between gap-4 lg:flex">
        <p className="text-sm text-muted">
          Revenue, customer activity, and account health from live API data.
        </p>
        <Button variant="secondary">
          <Download aria-hidden="true" size={18} />
          Export
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.revenue}
                margin={{ top: 8, right: 8, bottom: 0, left: -20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12 }} width={58} />
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

        <article className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-lg font-bold text-ink">Plan distribution</h2>
          <p className="text-sm text-muted">Accounts by subscription tier</p>
          <div className="mt-5 h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.segments}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="48%"
                  outerRadius="72%"
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

      <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
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
              onChange={(event) => {
                setGlobalFilter(event.target.value);
                table.setPageIndex(0);
              }}
              placeholder="Search customers..."
              className="min-h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-ink shadow-sm focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
          </label>
        </div>

        <div className="grid gap-3 md:hidden">
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <article
                key={row.id}
                className="rounded-lg border border-slate-200 bg-canvas p-4 dark:border-slate-700 dark:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-ink">
                      {row.original.customer}
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted">
                      {row.original.email}
                    </p>
                  </div>
                  <StatusBadge status={row.original.status} />
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Plan
                    </dt>
                    <dd className="mt-1 font-bold text-ink">{row.original.plan}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Spend
                    </dt>
                    <dd className="mt-1 font-bold text-ink">
                      {formatCurrency(row.original.spend)}
                    </dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Joined
                    </dt>
                    <dd className="mt-1 font-bold text-ink">
                      {formatDate(row.original.joined)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-muted dark:border-slate-700">
              No data available
            </div>
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
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

        <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Showing{" "}
            <span className="font-semibold text-ink">
              {table.getRowModel().rows.length === 0
                ? 0
                : pagination.pageIndex * pagination.pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-ink">
              {Math.min(
                (pagination.pageIndex + 1) * pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-ink">
              {table.getFilteredRowModel().rows.length}
            </span>{" "}
            customers
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <label className="flex items-center gap-2 text-sm font-medium text-muted">
              Rows
              <select
                value={pagination.pageSize}
                onChange={(event) => {
                  table.setPageSize(Number(event.target.value));
                }}
                className="min-h-10 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-ink shadow-sm focus:border-brand dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                {[8, 12, 20].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-center justify-between gap-2 sm:justify-start">
              <Button
                variant="ghost"
                className="size-10 p-0"
                aria-label="Previous page"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft aria-hidden="true" size={18} />
              </Button>
              <span className="min-w-24 text-center text-sm font-semibold text-ink">
                Page {pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </span>
              <Button
                variant="ghost"
                className="size-10 p-0"
                aria-label="Next page"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight aria-hidden="true" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
