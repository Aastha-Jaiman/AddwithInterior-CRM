"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getAdminDashboard } from "@/services/dashboard/admin.dashboard.services";
import { Users, Briefcase, FileText, DollarSign, TrendingUp, TrendingDown, RefreshCw, ArrowRight, Package } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function formatNumber(n) {
  if (n === undefined || n === null) return "0";
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return "0";
  return Intl.NumberFormat("en-IN").format(num);
}

function formatCurrency(n) {
  if (n === undefined || n === null) return "₹0";
  const num = typeof n === "string" ? Number(n) : n;
  if (!Number.isFinite(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

function percent(part, total) {
  if (!total || total <= 0) return 0;
  return Math.round((part / total) * 100);
}

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard(signal) {
    try {
      setLoading(true);
      setError("");
      const res = await getAdminDashboard();
      if (!res?.success) throw new Error("Failed to load dashboard");
      setData(res.data);
      setRole(res.role || "");
    } catch (e) {
      setError(e?.message || "Unable to fetch dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal);
    return () => controller.abort();
  }, []);

  const statusChartData = useMemo(() => {
    if (!data?.projectsByStatus) return [];
    return Object.entries(data.projectsByStatus).map(([name, value]) => ({ name, value }));
  }, [data?.projectsByStatus]);

  const categoryChartData = useMemo(() => {
    if (!data?.projectsByCategory) return [];
    return Object.entries(data.projectsByCategory).map(([name, value]) => ({ 
      name: name.replace(/_/g, " "), 
      value 
    }));
  }, [data?.projectsByCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            {role && <span className="inline-block mt-1 text-sm text-gray-600">{role}</span>}
          </div>
          <button
            onClick={() => loadDashboard()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? "..." : formatNumber(data?.totalClients)}
                </p>
              </div>
              <Users className="w-10 h-10 text-blue-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? "..." : formatNumber(data?.totalProjects)}
                </p>
              </div>
              <Briefcase className="w-10 h-10 text-indigo-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quotations</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? "..." : formatNumber(data?.totalQuotations)}
                </p>
              </div>
              <FileText className="w-10 h-10 text-orange-500 opacity-80" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Brochures</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {loading ? "..." : formatNumber(data?.totalBrochures)}
                  {!loading && data?.newBrochures != null && (
                    <span className="text-sm font-normal text-gray-500 ml-1">({data.newBrochures})</span>
                  )}
                </p>
              </div>
              <Package className="w-10 h-10 text-purple-500 opacity-80" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Status</h3>
            {loading ? (
              <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
            ) : statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={statusChartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No data</p>
            )}
          </div>

          <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects by Category</h3>
            {loading ? (
              <div className="h-64 animate-pulse bg-gray-100 rounded-lg" />
            ) : categoryChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-12">No data</p>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-6">
          <div className="flex items-center justify-between p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <Link href="/admin/projects" className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-2 p-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 animate-pulse bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : (!data.recentProjects || data.recentProjects.length === 0) ? (
            <p className="text-gray-500 text-center py-8">No recent projects</p>
          ) : (
            <div className="divide-y divide-gray-200">
              {data.recentProjects.slice(0, 5).map((p) => {
                const img = p.projectImages?.[0]?.url;
                return (
                  <div key={p._id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                        {img ? (
                          <img src={img} alt={p.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">
                            No Img
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">{p.title}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                            {p.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {p.location || "N/A"} · {p.category?.replace(/_/g, " ") || "No category"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Est: {formatCurrency(p.estimatedBudget || 0)}
                          {p.finalBudget && ` · Final: ${formatCurrency(p.finalBudget)}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
