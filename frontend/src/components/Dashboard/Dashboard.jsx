"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Briefcase,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  PieChart as PieIcon,
  BarChart3,
  IndianRupee,
  ArrowRight,
  MapPin,
  UserCircle2,
  Layers3,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { getDashboardData } from "@/services/dashboard/dashboard.services";

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
      console.log('data', data)
      setError(null);
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 w-full max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 text-center">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { role, data } = dashboardData || { role: "User", data: {} };

  const getRoleColor = (r) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      salesperson: "bg-blue-100 text-blue-700 border-blue-200",
      designer: "bg-green-100 text-green-700 border-green-200",
      carpenter: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[r?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("completed")) return "bg-green-100 text-green-700";
    if (s.includes("progress") || s.includes("process")) return "bg-blue-100 text-blue-700";
    if (s.includes("pending")) return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatINR = (n) => {
    if (n === null || n === undefined) return "₹0";
    const num = typeof n === "string" ? Number(n) : n;
    if (!Number.isFinite(num)) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Chart data
  const categoryData = Object.entries(data?.projectsByCategory || {}).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
  }));

  const statusData = Object.entries(data?.projectsByStatus || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6"];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{payload[0].name}</p>
          <p className="text-sm text-gray-600">Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  // NEW: Bar color helper (status-wise)
  const getBarColor = (name) => {
    const key = String(name || "").toLowerCase();
    if (key.includes("completed")) return "#22c55e"; // green-500
    if (key.includes("progress") || key.includes("process")) return "#3b82f6"; // blue-500
    if (key.includes("pending")) return "#f59e0b"; // amber-500
    return "#94a3b8"; // slate-400 fallback
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                role
              )}`}
            >
              {role || "User"}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <KPI
            title="Total Projects"
            value={data?.totalProjects || 0}
            icon={<Briefcase className="w-6 h-6 text-indigo-600" />}
          />
          <KPI
            title="Total Clients"
            value={data?.totalClients || 0}
            icon={<Users className="w-6 h-6 text-blue-600" />}
          />
          <KPI
            title="Total Brochures"
            value={data?.totalBrochures || 0}
            icon={<Package className="w-6 h-6 text-purple-600" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Pie */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900">Projects by Category</h2>
              </div>
              <LegendPills data={categoryData} colors={COLORS} />
            </div>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <RechartsPie>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </RechartsPie>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No category data</p>
            )}
          </div>

          {/* Status Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Projects by Status</h2>
            </div>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={statusData} barCategoryGap={24}>
                  <XAxis dataKey="name" tickMargin={8} />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {statusData.map((entry, idx) => (
                      <Cell key={`cell-status-${idx}`} fill={getBarColor(entry.name)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">No status data</p>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8 overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
            <button
              onClick={() => router.push("/projects")}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
            >
              View Projects
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {data?.recentProjects?.length > 0 ? (
            <ul className="divide-y divide-gray-200 max-h-[520px] overflow-auto">
              {data.recentProjects.map((p) => {
                const img =
                  p?.projectImages && p.projectImages.length > 0 ? p.projectImages[0].url : null;
                return (
                  <li key={p._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-20 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden ring-1 ring-gray-200">
                        {img ? (
                          <img src={img} alt={p.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full grid place-content-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Link
                            href={`/projects/${p._id}`}
                            className="text-base font-semibold text-gray-900 hover:text-indigo-700"
                          >
                            {p.title}
                          </Link>
                          {p.status && (
                            <span className={`text-[11px] px-2 py-0.5 rounded-full ${getStatusColor(p.status)}`}>
                              {p.status}
                            </span>
                          )}
                          {p.category && (
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {p.category.replace(/_/g, " ")}
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <UserCircle2 className="w-4 h-4 text-gray-400" />
                            {p.client?.name || "Client N/A"}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {p.location || "Location N/A"}
                          </span>
                          {p.estimatedBudget && (
                            <span className="inline-flex items-center gap-1">
                              <IndianRupee className="w-4 h-4 text-gray-400" />
                              Est: {formatINR(p.estimatedBudget)}
                            </span>
                          )}
                          {p.finalBudget && (
                            <span className="inline-flex items-center gap-1">
                              <Layers3 className="w-4 h-4 text-gray-400" />
                              Final: {formatINR(p.finalBudget)}
                            </span>
                          )}
                        </div>

                        {p.description && (
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">{p.description}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Link
                          href={`/projects/${p._id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50 text-gray-700"
                        >
                          Open
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-10">No recent projects</p>
          )}
        </div>

        {/* Role-specific sections */}
        {role === "salesperson" && data?.quotations && (
          <Section title="Your Quotations" icon={<CheckCircle className="w-5 h-5 text-indigo-600" />}>
            {data.quotations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {data.quotations.map((q) => (
                  <li key={q._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <p className="font-medium text-gray-900">Project: {q.project?.title || "N/A"}</p>
                    <p className="text-sm text-gray-600 mt-1">Client: {q.client?.name || "N/A"}</p>
                    {q.amount && <p className="text-sm text-green-600 font-semibold mt-1">{formatINR(q.amount)}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No quotations available</p>
            )}
          </Section>
        )}

        {role === "designer" && data?.designFeedbackProjects && (
          <Section title="Design Feedback Projects" icon={<TrendingUp className="w-5 h-5 text-green-600" />}>
            {data.designFeedbackProjects.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {data.designFeedbackProjects.map((p) => (
                  <li key={p._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{p.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(p.status)}`}>{p.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{p.category?.replace(/_/g, " ")}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No design feedback available</p>
            )}
          </Section>
        )}

        {role === "carpenter" && data?.dailyUpdates && (
          <Section title="Daily Updates" icon={<Clock className="w-5 h-5 text-orange-600" />}>
            {data.dailyUpdates.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {data.dailyUpdates.map((u) => (
                  <li key={u._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{u.project?.title || "N/A"}</p>
                        <p className="text-sm text-gray-600">By: {u.uploadedBy?.name || "Unknown"}</p>
                        {u.updateText && (
                          <p className="text-sm text-gray-700 mt-2 p-3 bg-gray-50 rounded-lg">{u.updateText}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No daily updates available</p>
            )}
          </Section>
        )}
      </div>
    </div>
  );
}

function KPI({ title, value, icon, gradient }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${gradient}`}>
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] opacity-10" />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-gray-800 text-4xl font-bold">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-xl bg-white/15 grid place-content-center">{icon}</div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="p-6 border-b border-gray-200 flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function LegendPills({ data, colors }) {
  if (!data?.length) return null;
  return (
    <div className="hidden sm:flex flex-wrap gap-2">
      {data.map((d, i) => (
        <span
          key={d.name}
          className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-700 bg-white"
        >
          <span className="h-2 w-2 rounded-full" style={{ background: colors[i % colors.length] }} />
          {d.name}
        </span>
      ))}
    </div>
  );
}
