'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Search, Filter, Plus, ChevronDown, ChevronRight, Calendar, DollarSign, User, Briefcase } from 'lucide-react';
import { getAllPayments } from '@/services/paymenthistory.services';
import { useRouter } from 'next/navigation';


const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const fmtINR = (n) => inr.format(n);

const StatusBadge = ({ status, amount }) => {
  const isFullyPaid = amount === 0;
  const isPartiallyPaid = amount > 0;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isFullyPaid
          ? 'bg-green-100 text-green-800'
          : isPartiallyPaid
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-red-100 text-red-800'
        }`}
    >
      {isFullyPaid ? 'Paid' : isPartiallyPaid ? 'Partial' : 'Pending'}
    </span>
  );
};

export default function PaymentsPage() {
   const router = useRouter();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [query, setQuery] = useState('');
  const [clientId, setClientId] = useState('all');
  const [projectId, setProjectId] = useState('all');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    let off = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getAllPayments();
        const data = res?.data?.data ?? [];
        console.log("res", res)
        if (!off) setRows(data);
      } catch (e) {
        if (!off) setErr(e?.message || 'Failed to load');
      } finally {
        if (!off) setLoading(false);
      }
    })();
    return () => {
      off = true;
    };
  }, []);



  const clients = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => r.client?._id && m.set(r.client._id, r.client.name));
    return Array.from(m).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const projects = useMemo(() => {
    const m = new Map();
    rows.forEach((r) => r.project?._id && m.set(r.project._id, r.project.title));
    return Array.from(m).map(([value, label]) => ({ value, label }));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (clientId !== 'all' && r.client?._id !== clientId) return false;
      if (projectId !== 'all') {
        if (projectId === 'no-project' && r.project !== null) return false;
        if (projectId !== 'no-project' && r.project?._id !== projectId) return false;
      }
      if (!q) return true;
      const hay = [
        r.client?.name,
        r.client?.email,
        r.project?.title,
        r.project?.category,
        r._id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [rows, query, clientId, projectId]);

  const stats = useMemo(() => {
    const totalAmount = filtered.reduce((sum, r) => sum + r.totalPrice, 0);
    const totalReceived = filtered.reduce((sum, r) => sum + r.totalReceived, 0);
    const totalPending = filtered.reduce((sum, r) => sum + r.pending, 0);
    return { totalAmount, totalReceived, totalPending };
  }, [filtered]);

  const handleAddPayment = () => {
    router.push('/admin/paymenthistory/add');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 bg-gray-200 rounded w-48"></div>
            <div className="h-10 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center py-8">
          <div className="text-red-500 text-lg font-medium mb-2">Error Loading Payments</div>
          <div className="text-gray-500">{err}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Payment History</h1>
            <p className="text-sm text-gray-500 mt-1">{filtered.length} payment records</p>
          </div>
          <button
            onClick={handleAddPayment}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Payment
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                <p className="text-lg font-semibold text-gray-900">{fmtINR(stats.totalAmount)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Received</p>
                <p className="text-lg font-semibold text-gray-900">{fmtINR(stats.totalReceived)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Pending</p>
                <p className="text-lg font-semibold text-gray-900">{fmtINR(stats.totalPending)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients, projects..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Clients</option>
              {clients.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="all">All Projects</option>
              <option value="no-project">No Project</option>
              {projects.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg font-medium mb-2">No payments found</div>
            <div className="text-gray-400">Try adjusting your search or filters</div>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client & Project
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Received
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pending
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((record) => (
                <React.Fragment key={record._id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {record.client?.name || 'Unknown Client'}
                        </div>
                        <div className="text-sm text-gray-500">{record.client?.email || '-'}</div>
                        {record.project && (
                          <div className="text-sm text-blue-600 mt-1">
                            {record.project.title} · {record.project.category}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {fmtINR(record.totalPrice)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-green-600 font-medium">
                      {fmtINR(record.totalReceived)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-orange-600 font-medium">
                      {fmtINR(record.pending)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={record.pending === 0 ? 'paid' : 'pending'} amount={record.pending} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(record.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setOpenId(openId === record._id ? null : record._id)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        {openId === record._id ? (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Hide
                          </>
                        ) : (
                          <>
                            <ChevronRight className="h-4 w-4 mr-1" />
                            Details
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {openId === record._id && (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 bg-gray-50">
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Payment History</h4>
                          {(record.payments ?? []).length > 0 ? (
                            <div className="space-y-2">
                              {record.payments
                                .slice()
                                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .map((payment) => (
                                  <div
                                    key={payment._id}
                                    className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="flex items-center">
                                      <div className="p-1.5 bg-green-100 rounded-full mr-3">
                                        <DollarSign className="h-3 w-3 text-green-600" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {fmtINR(payment.amount)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {new Date(payment.date).toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-xs text-gray-400 font-mono">
                                      ID: {payment._id}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500 text-sm">
                              No payment records found
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}