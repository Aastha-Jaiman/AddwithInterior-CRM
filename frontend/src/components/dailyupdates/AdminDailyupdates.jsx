"use client";
import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteDailyUpdate, getAllDailyUpdates } from "@/services/dailyupdates.services";
import { format } from "date-fns";

export default function DailyUpdatesList() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all updates from backend
  const fetchUpdates = async () => {
    try {
      const data = await getAllDailyUpdates();
      console.log("Fetched Daily Updates:", data);
      setUpdates(data.updates || []); // ✅ Correct structure
    } catch (err) {
      console.error("Error fetching daily updates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (updateId, dailyUpdateId) => {
    if (!confirm("Are you sure you want to delete this update?")) return;
    try {
      await deleteDailyUpdate(updateId, dailyUpdateId);
      console.log(`Deleted Daily Update: ${dailyUpdateId} from Update Record: ${updateId}`);
      fetchUpdates(); // Refresh list after delete
    } catch (err) {
      console.error("Error deleting daily update:", err);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  if (loading) return <div className="p-6">Loading updates...</div>;

  if (updates.length === 0)
    return <div className="p-6">No daily updates found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Daily Updates</h2>
      <div className="space-y-6">
        {updates.map((update) => (
          <div
            key={update._id}
            className="border border-gray-200 rounded-lg shadow-sm p-4"
          >
            <h3 className="text-lg font-semibold mb-1">
              Project: {update.project?.title || "Untitled Project"}
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Client: {update.project?.client || "Unknown"}
            </p>

            <div className="space-y-4">
              {update.dailyUpdates.map((du) => (
                <div
                  key={du._id}
                  className="border border-gray-100 rounded-lg p-3 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {du.type} update by {du.uploadedBy?.name || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {du.createdAt
                        ? format(new Date(du.createdAt), "dd MMM yyyy, HH:mm")
                        : ""}
                    </span>
                  </div>

                  {du.message && (
                    <p className="text-sm text-gray-700">{du.message}</p>
                  )}

                  {du.images?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {du.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`update-img-${idx}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(update._id, du._id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 text-sm"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
