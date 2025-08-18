"use client";
import React, { useEffect, useState } from "react";
import { getDailyUpdateById } from "@/services/dailyupdates.services";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";

export default function DailyUpdateDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [updateData, setUpdateData] = useState(null); // updated
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const data = await getDailyUpdateById(id);
      console.log("Daily Update Details:", data);
      // यहां store करेंगे सिर्फ update object
      setUpdateData(data.update); // updated
    } catch (err) {
      console.error("Error loading details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetails();
  }, [id]);

  if (loading) return <div className="p-6">Loading details...</div>;
  if (!updateData) return <div className="p-6">No details found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 text-sm"
      >
        ← Back
      </button>

      {/* Project Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {updateData.project?.title || "Untitled Project"}
        </h1>
        <p className="text-gray-500">
          Client: {updateData.project?.client || "Unknown"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Project ID: {updateData.project?._id}
        </p>
        <p className="text-xs text-gray-400">
          Update Record ID: {updateData._id}
        </p>
        <p className="text-xs text-gray-400">
          Created At: {format(new Date(updateData.createdAt), "dd MMM yyyy, HH:mm")}
        </p>
      </div>

      {/* Daily Updates */}
      {(updateData.dailyUpdates || []).map((du) => (
        <div key={du._id} className="mb-6 border rounded-lg p-4 bg-gray-50 shadow">
          <div className="flex justify-between mb-2">
            <span className="font-semibold capitalize">
              {du.type} update
            </span>
            <span className="text-xs text-gray-500">
              {du.createdAt
                ? format(new Date(du.createdAt), "dd MMM yyyy, HH:mm")
                : ""}
            </span>
          </div>
          <p className="mb-2 text-sm text-gray-700">{du.message}</p>

          {/* Uploaded By */}
          <div className="mb-4 text-sm">
            <p>
              Uploaded By: <strong>{du.uploadedBy?.name || "Unknown"}</strong>
            </p>
            {du.uploadedBy?.email && (
              <p>Email: <span className="text-gray-600">{du.uploadedBy.email}</span></p>
            )}
            {du.uploadedBy?.role && (
              <p>Role: <span className="capitalize">{du.uploadedBy.role}</span></p>
            )}
          </div>

          {/* Images */}
          {du.images?.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {du.images.map((img, idx) => (
                <a key={idx} href={img.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={img.url}
                    alt={`img-${idx}`}
                    className="w-32 h-32 object-cover rounded border hover:opacity-80"
                  />
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
