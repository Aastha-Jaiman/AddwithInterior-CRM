'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { DollarSign, Calendar, User, Briefcase } from 'lucide-react';
import { deletePayment, getPaymentById } from '@/services/paymenthistory.services';

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const fmtINR = (n) => inr.format(n);

export default function PaymentDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getPaymentById(id);
        setData(res?.data?.data || null);
      } catch (e) {
        setErr(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDeletePayment = async (paymentId) => {
  if (!confirm("Are you sure you want to delete this payment?")) {
    return;
  }
  try {
    setLoading(true);
    await deletePayment(paymentId);
    // Refresh payment data after deletion
    const res = await getPaymentById(id);
    setData(res?.data?.data || null);
    setErr(null);
  } catch (error) {
    setErr(error?.message || "Failed to delete payment");
  } finally {
    setLoading(false);
  }
};


  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 text-lg font-medium">Loading...</div>
    );
  if (err)
    return (
      <div className="p-8 text-center text-red-600 font-semibold">{err}</div>
    );
  if (!data)
    return (
      <div className="p-8 text-center text-gray-600 font-medium">No payment history found.</div>
    );

  return (
    <div className="max-w-full my-6 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-6 border-b border-gray-300 pb-3">
        Payment Details
      </h2>

      {/* Client & Project Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="flex items-center space-x-3">
          <User className="text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Client</p>
            <p className="text-lg text-gray-900">{data.client?.name || '-'}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Briefcase className="text-green-600" />
          <div>
            <p className="text-sm font-semibold text-gray-700">Project</p>
            <p className="text-lg text-gray-900">{data.project?.title || '-'}</p>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid grid-cols-3 gap-6 text-center mb-8">
        <div className="py-4 px-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-700">Total Amount</p>
          <p className="text-lg font-semibold text-blue-900">{fmtINR(data.totalPrice)}</p>
        </div>
        <div className="py-4 px-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs font-medium text-green-700">Received</p>
          <p className="text-lg font-semibold text-green-900">{fmtINR(data.totalReceived)}</p>
        </div>
        <div className="py-4 px-3 bg-orange-50 rounded-lg border border-orange-200">   
          <p className="text-xs font-medium text-orange-700">Pending</p>
          <p className="text-lg font-semibold text-orange-900">{fmtINR(data.pending)}</p>
        </div>
      </div>

      {/* Last Updated */}
      <div className="flex items-center text-gray-500 mb-8 text-sm font-medium">
        <Calendar className="mr-2" />
        Last updated: {new Date(data.updatedAt).toLocaleString()}
      </div>

      {/* Payments History */}
      <h3 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
        Payment History
      </h3>

      <div className="space-y-4">
{data.payments && data.payments.length > 0 ? (
  data.payments
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((p) => (
      <div
        key={p._id}
        className="flex flex-col bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-green-600" />
            <p className="font-semibold text-gray-800">{fmtINR(p.amount)}</p>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-xs text-gray-500 font-mono whitespace-nowrap">
              {new Date(p.date).toLocaleString()}
            </p>
            <button
              onClick={() => handleDeletePayment(p._id)}
              className="text-red-600 hover:text-red-800 text-xs font-semibold px-2 py-1 rounded border border-red-600 hover:bg-red-100 transition"
              type="button"
              aria-label="Delete Payment"
            >
              Delete
            </button>
          </div>
        </div>
        <p className="mt-1 text-gray-600 text-sm">Msg: {p.message || '-'}</p>
        <p className="mt-1 text-gray-400 text-xs font-mono">ID: {p._id}</p>
      </div>
    ))
) : (
  <p className="text-center text-gray-400 font-medium">No payment records found.</p>
)}

      </div>
    </div>
  );
}
