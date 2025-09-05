// 'use client';

// import { addPayment } from '@/services/paymenthistory.services';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';
// import { mutate } from 'swr';

// export default function AddPaymentPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     clientId: '',
//     projectId: '',
//     totalPrice: '',
//     amount: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState(null);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setErr(null);
//     setLoading(true);
//     try {
//       await addPayment({
//         clientId: form.clientId,
//         projectId: form.projectId,
//         totalPrice: Number(form.totalPrice),
//         amount: Number(form.amount),
//       });
//       await mutate('/payment/all');
//       router.push('/admin/paymenthistory/');
//     } catch (e) {
//       setErr(e?.response?.data?.message || 'Failed to add payment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mx-auto max-w-2xl px-4 py-6 lg:px-8">
//       <h1 className="mb-6 text-xl font-semibold">Add Payment</h1>
//       <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
//         <div className="grid gap-4 sm:grid-cols-2">
//           <div>
//             <label className="mb-1 block text-sm font-medium">Client ID</label>
//             <input
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
//               placeholder="client ObjectId"
//               value={form.clientId}
//               onChange={(e) => setForm({ ...form, clientId: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-medium">Project ID</label>
//             <input
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
//               placeholder="project ObjectId"
//               value={form.projectId}
//               onChange={(e) => setForm({ ...form, projectId: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-medium">Final Budget (totalPrice)</label>
//             <input
//               type="number"
//               min={0}
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
//               value={form.totalPrice}
//               onChange={(e) => setForm({ ...form, totalPrice: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label className="mb-1 block text-sm font-medium">First Received (amount)</label>
//             <input
//               type="number"
//               min={1}
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
//               value={form.amount}
//               onChange={(e) => setForm({ ...form, amount: e.target.value })}
//               required
//             />
//           </div>
//         </div>

//         {err && <p className="text-sm text-red-600">{err}</p>}

//         <div className="flex items-center gap-3">
//           <button
//             type="submit"
//             disabled={loading}
//             className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
//           >
//             {loading ? 'Saving...' : 'Save Payment'}
//           </button>
//           <button
//             type="button"
//             onClick={() => router.back()}
//             className="text-sm text-gray-600 underline hover:text-gray-800"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


'use client';
import { addPayment } from '@/services/paymenthistory.services';
import { searchAllForDropdown, getAllProjects } from '@/services/project.services'; // ensure correct path
import { useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import useSWR, { mutate } from 'swr';

const fetchDropdown = async () => {
  // Try combined dropdown API first; fall back to projects list if needed
  try {
    const res = await searchAllForDropdown();
    // Expecting { clients: [...], projects: [...] } or flat arrays; normalize
    const data = res?.data?.data || res?.data || {};
    const clients = data.clients || data.clientsList || data?.map?.(x => x.client)?.filter(Boolean) || [];
    const projects = data.projects || data.projectsList || [];
    return { clients, projects };
  } catch (e) {
    // Fallback: load projects only
    const resP = await getAllProjects();
    const projects = resP?.data?.data || [];
    return { clients: [], projects };
  }
};

export default function AddPaymentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    clientId: '',
    projectId: '',
    totalPrice: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const { data: dropdown, isLoading: loadingDD, error: errorDD } = useSWR('/project/search-dropdown+projects', fetchDropdown, {
    revalidateOnFocus: true,
  });

  const clients = useMemo(() => dropdown?.clients || [], [dropdown]);
  const projects = useMemo(() => dropdown?.projects || [], [dropdown]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const isValid =
    form.clientId &&
    form.projectId &&
    Number(form.totalPrice) > 0 &&
    Number(form.amount) > 0 &&
    Number(form.amount) <= Number(form.totalPrice);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!isValid) {
      setErr('Please fill all fields correctly');
      return;
    }
    setLoading(true);
    try {
      await addPayment({
        clientId: form.clientId,
        projectId: form.projectId,
        totalPrice: Number(form.totalPrice),
        amount: Number(form.amount),
      });
      await mutate('/payment/all');
      router.push('/admin/paymenthistory/');
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">Add Payment</h1>

      {loadingDD && <div className="text-sm text-gray-500">Loading dropdowns…</div>}
      {errorDD && <div className="text-sm text-red-600">Failed to load dropdowns.</div>}

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Client</span>
            <select
              name="clientId"
              value={form.clientId}
              onChange={onChange}
              disabled={loadingDD || loading || clients.length === 0}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select client</option>
              {clients.map((c) => (
                <option key={c.id || c._id} value={c.id || c._id}>
                  {c.name || c.fullName || c.email || 'Client'}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">Project</span>
            <select
              name="projectId"
              value={form.projectId}
              onChange={onChange}
              disabled={loadingDD || loading || projects.length === 0}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select project</option>
              {projects
                // Optional: filter projects by selected client if API includes clientId on project
                .filter((p) => !form.clientId || p.clientId === form.clientId || p.client?._id === form.clientId || p.client === form.clientId)
                .map((p) => (
                  <option key={p.id || p._id} value={p.id || p._id}>
                    {p.title || p.name} {p.category ? `• ${p.category}` : ''}
                  </option>
                ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Final Budget (₹)</span>
              <input
                type="number"
                name="totalPrice"
                min="0"
                step="1"
                value={form.totalPrice}
                onChange={onChange}
                className="border rounded px-3 py-2"
                placeholder="e.g. 100000"
                required
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium">Amount Received (₹)</span>
              <input
                type="number"
                name="amount"
                min="0"
                step="1"
                value={form.amount}
                onChange={onChange}
                className="border rounded px-3 py-2"
                placeholder="e.g. 25000"
                required
              />
            </label>
          </div>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}

        <button
          type="submit"
          disabled={!isValid || loading}
          className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Add Payment'}
        </button>
      </form>
    </div>
  );
}
