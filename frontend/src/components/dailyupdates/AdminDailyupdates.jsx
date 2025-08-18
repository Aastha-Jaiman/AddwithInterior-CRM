"use client";
import React, { useEffect, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { getAllDailyUpdates } from "@/services/dailyupdates.services";
import { format, isSameDay } from "date-fns";
import { useRouter } from "next/navigation";

const filterUpdates = (updates, search, selectedDate) => {
  let filtered = updates;

  // Date Filter
  if (selectedDate) {
    filtered = filtered
      .map((u) => ({
        ...u,
        dailyUpdates: u.dailyUpdates.filter((du) =>
          du.createdAt
            ? isSameDay(new Date(du.createdAt), new Date(selectedDate))
            : false
        ),
      }))
      .filter((u) => u.dailyUpdates.length > 0);
  }

  // Search Filter
  if (search.trim()) {
    const s = search.toLowerCase();
    filtered = filtered.filter((u) => {
      const projectTitle =
        typeof u.project?.title === "object"
          ? JSON.stringify(u.project?.title)
          : u.project?.title || "";
      const clientName =
        typeof u.project?.client === "object"
          ? u.project?.client?.name || u.project?.client?.email || JSON.stringify(u.project?.client)
          : u.project?.client || "";

      return (
        projectTitle.toLowerCase().includes(s) ||
        clientName.toLowerCase().includes(s)
      );
    });
  }

  return filtered;
};

export default function DailyUpdatesList() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const data = await getAllDailyUpdates();
      setUpdates(data.updates || []);
    } catch (err) {
      console.error("Error fetching daily updates:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const visibleUpdates = filterUpdates(updates, search, selectedDate);

  const totalItems = visibleUpdates.reduce(
    (sum, u) => sum + u.dailyUpdates.length,
    0
  );
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Pagination logic
  const paginatedData = [];
  let itemCount = 0;
  for (const update of visibleUpdates) {
    const dailyUpdatesPaginated = [];
    for (const du of update.dailyUpdates) {
      if (
        itemCount >= (currentPage - 1) * itemsPerPage &&
        itemCount < currentPage * itemsPerPage
      ) {
        dailyUpdatesPaginated.push(du);
      }
      itemCount++;
    }
    if (dailyUpdatesPaginated.length > 0) {
      paginatedData.push({ ...update, dailyUpdates: dailyUpdatesPaginated });
    }
  }

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading updates...
      </div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        📅 All Daily Updates
      </h2>

      {/* Search + Date Filter */}
      <div className="mb-5 flex flex-col md:flex-row items-center gap-3">
        <div className="relative w-full md:w-1/2">
          <Search
            size={18}
            className="absolute left-3 top-2.5 text-gray-400"
          />
          <input
            type="text"
            className="pl-10 pr-3 py-2 w-full rounded-lg bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            placeholder="Search by project name or client name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <input
          type="date"
          className="px-3 py-2 rounded-lg bg-gray-50 focus:bg-white border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow-sm border border-gray-100 bg-white">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Updated By</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Images</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {totalItems > 0 ? (
              paginatedData.map((update) =>
                update.dailyUpdates.map((du) => (
                  <tr
                    key={du._id}
                    className="hover:bg-blue-50 transition border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {typeof update.project?.title === "object"
                        ? JSON.stringify(update.project?.title)
                        : update.project?.title || "Untitled"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {typeof update.project?.client === "object"
                        ? update.project?.client?.name || update.project?.client?.email || JSON.stringify(update.project?.client)
                        : update.project?.client || "Unknown"}
                    </td>
                    <td className="px-4 py-3 capitalize">{du.type}</td>
                    <td className="px-4 py-3">{du.message || "-"}</td>
                    <td className="px-4 py-3">
                      {typeof du.uploadedBy === "object"
                        ? du.uploadedBy?.name || du.uploadedBy?.email || JSON.stringify(du.uploadedBy)
                        : du.uploadedBy || "Unknown"}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {du.createdAt
                        ? format(new Date(du.createdAt), "dd MMM yyyy, HH:mm")
                        : ""}
                    </td>
                    {/* <td className="px-4 py-3">
                      {du.images?.length > 0 ? (
                        <div className="flex gap-2">
                          {du.images.map((img, i) => (
                            <a
                              key={i}
                              href={img.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <img
                                src={img.url}
                                alt={`img-${i}`}
                                className="w-12 h-12 object-cover rounded-md shadow-sm hover:scale-105 transition"
                              />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No Images</span>
                      )}
                    </td> */}

                    <td className="px-4 py-3">
                      {du.images?.length > 0 ? (
                        <span className="text-gray-700 font-medium">
                          {du.images.length} image{du.images.length > 1 ? "s" : ""} uploaded
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No Images</span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          router.push(`/admin/daily-updates/${update._id}`)
                        }
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium hover:bg-blue-200 transition"
                      >
                        <ExternalLink size={12} className="inline-block mr-1" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No daily updates found for selected date.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex justify-center items-center gap-2 mt-5">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Prev
          </button>
          <span className="text-gray-600 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
