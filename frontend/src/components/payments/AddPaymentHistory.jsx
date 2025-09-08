'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getAllClientsByAdmin } from '@/services/client.services';
import { addPayment } from '@/services/paymenthistory.services';
import { getAllProjects } from '@/services/project.services';

export default function AddPaymentPage() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientQuery, setClientQuery] = useState('');
  const [clientId, setClientId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [clientDetails, setClientDetails] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch clients and projects
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const clData = await getAllClientsByAdmin();
        const prData = await getAllProjects();

        console.log('clData:', clData);
        console.log('prData:', prData);

        setClients(clData?.client || []); // 👈 correct key
        setProjects(prData?.data?.projects || []); // 👈 correct key
      } catch (e) {
        setErr(e?.message || 'Failed to load clients/projects');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtered clients for search
  const filteredClients = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    return !q
      ? clients
      : clients.filter((c) =>
          (`${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q))
        );
  }, [clientQuery, clients]);

  // Load client details when clientId changes
  useEffect(() => {
    if (!clientId) {
      setClientDetails(null);
      return;
    }
    const cl = clients.find((c) => c._id === clientId);
    setClientDetails(cl || null);
  }, [clientId, clients]);

  // Load project details when projectId changes
  useEffect(() => {
    if (!projectId) {
      setProjectDetails(null);
      return;
    }
    const pr = projects.find((p) => p._id === projectId);
    setProjectDetails(pr || null);
  }, [projectId, projects]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setSuccess(null);
    try {
      await addPayment({
        clientId,
        projectId,
        amount: Number(amount),
        message,
      });
      setSuccess('Payment added successfully!');
      setAmount('');
      setMessage('');
      setClientId('');
      setProjectId('');
      setClientQuery('');
      setClientDetails(null);
      setProjectDetails(null);
    } catch (error) {
      setErr(error?.message || 'Failed to add payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Add Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Client</label>
          <input
            type="text"
            placeholder="Search client by name/email/phone"
            value={clientQuery}
            onChange={(e) => setClientQuery(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded"
          />
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Client</option>
            {filteredClients.length > 0 ? (
              filteredClients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))
            ) : (
              <option disabled>No clients found</option>
            )}
          </select>

          {clientDetails && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm space-y-1">
              <div><strong>Name:</strong> {clientDetails.name}</div>
              <div><strong>Email:</strong> {clientDetails.email}</div>
              <div><strong>Phone:</strong> {clientDetails.phone || '-'}</div>
              <div><strong>Company:</strong> {clientDetails.companyName || '-'}</div>
              <div><strong>Aadhar:</strong> {clientDetails.aadharCardNumber || '-'}</div>
              {clientDetails.profile?.url && (
                <img
                  src={clientDetails.profile.url}
                  alt="Profile"
                  className="w-16 h-16 mt-2 rounded-full border"
                />
              )}
            </div>
          )}
        </div>

        {/* Project selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select Project</option>
            {projects.length > 0 ? (
              projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title} ({p.category})
                </option>
              ))
            ) : (
              <option disabled>No projects found</option>
            )}
          </select>

          {projectDetails && (
            <div className="mt-3 p-3 bg-gray-50 rounded text-sm space-y-1">
              <div><strong>Title:</strong> {projectDetails.title}</div>
              <div><strong>Category:</strong> {projectDetails.category}</div>
              <div><strong>Status:</strong> {projectDetails.status}</div>
              <div><strong>Location:</strong> {projectDetails.location}</div>
              <div><strong>Final Budget:</strong> ₹{projectDetails.finalBudget || '-'}</div>
              <div><strong>Client:</strong> {projectDetails.client?.name} ({projectDetails.client?.email})</div>
            </div>
          )}
        </div>

        {/* Payment details */}
        <div>
          <label className="block text-sm font-medium mb-2">Amount Received</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            placeholder="Optional note about payment"
          />
        </div>

        {/* Actions */}
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Adding Payment...' : 'Add Payment'}
        </button>
        {err && <div className="text-red-500 mt-2">{err}</div>}
        {success && <div className="text-green-500 mt-2">{success}</div>}
      </form>
    </div>
  );
}
