"use client";

import { getMyProjectPaymentHistory } from "@/services/paymenthistory.services";
import React, { useEffect, useState } from "react";

const ClientPaymentHistory = () => {
  const [projects, setProjects] = useState([]);
  const [overallTotals, setOverallTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMyProjectPaymentHistory();
        console.log('data', data)
        setProjects(data.data || []);
        setOverallTotals(data.overallTotals || {});
      } catch (err) {
        console.error(err);
        setError("Failed to fetch payment history");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-12 animate-pulse font-medium">
        Loading payment history...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 font-semibold mt-12">{error}</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 rounded-lg shadow-md font-sans">
      <h2 className="text-4xl font-bold mb-8 text-gray-800 tracking-wide border-b border-gray-300 pb-3">
        Client Payment History
      </h2>

      <section className="flex justify-around bg-white shadow-sm rounded-md p-6 mb-10">
        <div className="text-center">
          <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">
            Total Spent
          </p>
          <p className="text-2xl font-bold text-green-700">
            ₹{overallTotals.totalSpent || 0}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs uppercase text-gray-500 tracking-wider mb-1">
            Pending Amount
          </p>
          <p className="text-2xl font-bold text-yellow-600">
            ₹{overallTotals.pending || 0}
          </p>
        </div>
      </section>

      {projects.length === 0 ? (
        <p className="text-center text-gray-600 italic">
          No projects with payment history available.
        </p>
      ) : (
        projects.map((project, idx) => (
          <article
            key={idx}
            className="mb-10 rounded-md border border-gray-300 bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <header className="flex justify-between items-center border-b border-gray-200 px-6 py-4 bg-gray-100 rounded-t-md">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {project.projectTitle || `Project ${idx + 1}`}
                </h3>
                {project.category && (
                  <span className="inline-block mt-1 px-3 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                    {project.category}
                  </span>
                )}
              </div>
              <div className="flex space-x-6 text-gray-700 font-medium">
                <div>
                  <p className="text-xs uppercase text-gray-400">Total Price</p>
                  <p className="text-lg">₹{project.totalPrice || 0}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Total Spent</p>
                  <p className="text-lg text-green-700">
                    ₹{project.totalSpent || 0}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-gray-400">Pending</p>
                  <p className="text-lg text-yellow-600">
                    ₹{project.pending || 0}
                  </p>
                </div>
              </div>
            </header>

            <section className="px-6 py-5">
              <h4 className="text-lg font-semibold mb-4 text-gray-800 border-b border-gray-300 pb-2">
                Payment History
              </h4>

              {project.payments && project.payments.length > 0 ? (
                <table className="w-full text-left text-sm border-collapse">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="p-3 border border-gray-300">Amount (₹)</th>
                      <th className="p-3 border border-gray-300">Date</th>
                      <th className="p-3 border border-gray-300">Message</th>
                      <th className="p-3 border border-gray-300">Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.payments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="odd:bg-white even:bg-gray-50 hover:bg-indigo-50 transition-colors"
                      >
                        <td className="p-3 border border-gray-300 font-semibold text-green-800">
                          ₹{payment.amount || 0}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {new Date(payment.date).toLocaleString()}
                        </td>
                        <td className="p-3 border border-gray-300 italic text-gray-600">
                          {payment.message || "-"}
                        </td>
                        <td className="p-3 border border-gray-300 italic text-gray-600">
                          {payment.file ? (
                            <a href={payment.file} download target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                              Download
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="italic text-gray-500">
                  No payments recorded for this project.
                </p>
              )}
            </section>
          </article>
        ))
      )}
    </div>
  );
};

export default ClientPaymentHistory;
