'use client';

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import Link from 'next/link';
import { getPaymentById } from '@/services/paymenthistory.services';

const fetcherById = (id) => async () => {
  const res = await getPaymentById(id);
  return res.data.data;
};

export default function PaymentDetailPage() {
  const params = useParams();
  const id = params.id;
  const { data, isLoading, error } = useSWR(id ? `/payment/${id}` : null, id ? fetcherById(id) : null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Payment Details</h1>
        <Link
          href={`/admin/paymenthistory/${id}/edit`}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          Edit
        </Link>
      </div>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Failed to load details.</p>}
      {!isLoading && !error && data && (
        <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-gray-500">Client</div>
              <div className="font-medium">{data.client?.name} ({data.client?.email})</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Project</div>
              <div className="font-medium">{data.project?.title} — {data.project?.category}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Final Budget</div>
              <div className="font-medium">₹ {Number(data.totalPrice || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Received</div>
              <div className="font-medium">₹ {Number(data.totalReceived || 0).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Pending</div>
              <div className="font-medium">₹ {Number(data.pending || 0).toLocaleString()}</div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-sm font-semibold">Payments</div>
            <div className="overflow-hidden rounded border border-gray-200">
              <table className="min-w-full table-auto text-left">
                <thead className="bg-gray-50 text-sm text-gray-600">
                  <tr>
                    <th className="px-4 py-2">Amount</th>
                    <th className="px-4 py-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {(data.payments || []).map((it, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2">₹ {Number(it.amount || 0).toLocaleString()}</td>
                      <td className="px-4 py-2">{it.date ? new Date(it.date).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                  {(!data.payments || data.payments.length === 0) && (
                    <tr>
                      <td className="px-4 py-3" colSpan={2}>No payment entries found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/paymenthistory" className="text-sm text-gray-600 underline hover:text-gray-800">
              Back to list
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
