'use client';

import { useParams, useRouter } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import { useState } from 'react';
import { getPaymentById, updatePayment } from '@/services/paymenthistory.services';

const fetcherById = (id) => async () => {
  const res = await getPaymentById(id);
  return res.data.data;
};

export default function EditPaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, error } = useSWR(id ? `/payment/${id}` : null, id ? fetcherById(id) : null);

  const [amount, setAmount] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return;
    try {
      await updatePayment(id, { amount: value });
      await mutate('/payment/all');
      await mutate(`/payment/${id}`);
      router.push(`/payments/${id}`);
    } catch (e) {
      // Handle error as needed
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
      <h1 className="mb-6 text-xl font-semibold">Edit Payment</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-600">Failed to load payment.</p>}
      {!isLoading && !error && data && (
        <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase text-gray-500">Client</div>
              <div className="font-medium">{data.client?.name}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Project</div>
              <div className="font-medium">{data.project?.title}</div>
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
              <label className="mb-1 block text-sm font-medium">Add Amount</label>
              <input
                type="number"
                min={1}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                placeholder="Enter amount to add"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Update Payment
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm text-gray-600 underline hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
