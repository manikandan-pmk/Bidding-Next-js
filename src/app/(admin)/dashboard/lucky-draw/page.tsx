"use client";

import {
  Ticket,
  Search,
  Plus,
  X,
  ChevronLeft,
  ChevronsLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LuckyDraw {
  id: number | string;
  name?: string;
  no_of_peoples?: number;
  amount?: number | string;
  duration_Value?: number | string;
  duration_Unit?: string;
  upi_Id?: string;
  qr_Code?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function LuckyDrawPage() {
  const router = useRouter();

  const [draws, setDraws] = useState<LuckyDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // ================================
  // FETCH LUCKY DRAWS
  // ================================
  const fetchLuckyDraws = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/v1/admin/lucky-draw", {
        withCredentials: true,
      });

      const result = response.data;

      if (result?.error) {
        throw new Error(
          result?.message || "Failed to fetch lucky draws"
        );
      }

      let data: LuckyDraw[] = [];

      if (Array.isArray(result)) {
        data = result;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      } else if (Array.isArray(result?.luckyDraws)) {
        data = result.luckyDraws;
      }

      // ==========================================
      // SORT: RECENTLY CREATED FIRST
      // ==========================================
      data.sort((a, b) => {
        const dateA = a.createdAt
          ? new Date(a.createdAt).getTime()
          : 0;

        const dateB = b.createdAt
          ? new Date(b.createdAt).getTime()
          : 0;

        return dateB - dateA;
      });

      setDraws(data);
    } catch (err) {
      console.error("FETCH LUCKY DRAW ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch lucky draws"
      );

      setDraws([]);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // INITIAL FETCH
  // ================================
  useEffect(() => {
    fetchLuckyDraws();
  }, []);

  // ================================
  // SEARCH FILTER
  // ================================
  const filteredDraws = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return draws;

    return draws.filter((draw) => {
      return (
        String(draw.id)
          .toLowerCase()
          .includes(value) ||
        draw.name
          ?.toLowerCase()
          .includes(value) ||
        String(draw.duration_Unit ?? "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [draws, search]);

  // ================================
  // FORMAT DATE & TIME
  // ================================
  const formatDateTime = (date?: string) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ================================
  // FORMAT DURATION
  // ================================
  const formatDuration = (draw: LuckyDraw) => {
    if (
      draw.duration_Value === undefined ||
      draw.duration_Value === null ||
      !draw.duration_Unit
    ) {
      return "-";
    }

    const unit =
  draw.duration_Unit === "MONTHLY"
    ? draw.duration_Value === 1
      ? "Month"
      : "Months"
    : draw.duration_Value === 1
      ? "Week"
      : "Weeks";

return `${draw.duration_Value} ${unit}`;
  };

  // ================================
  // OPEN LUCKY DRAW
  // ================================
  const handleRowClick = (id: number | string) => {
    router.push(`/dashboard/lucky-draw/${id}`);
  };

  // ================================
  // PAGE
  // ================================
  return (
    <section className="p-6">
      {/* PAGE HEADER */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Lucky Draws
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and view all lucky draws.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard/lucky-draw/create")
          }
          className="flex items-center justify-center gap-2 rounded-lg bg-[#4945ff] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3835d9]"
        >
          <Plus size={18} />
          Create Lucky Draw
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="rounded-xl border border-gray-200 bg-white">
        {/* TOOLBAR */}
        <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full items-center rounded-lg border border-gray-200 bg-white px-3 md:max-w-md">
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name, ID or duration..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2.5 text-sm outline-none"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={fetchLuckyDraws}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-[#fafafa]">
              <tr className="border-b border-gray-200">
                {/* ID */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  ID
                </th>

                {/* LUCKY DRAW */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Lucky Draw
                </th>

                {/* PEOPLE */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  People
                </th>

                {/* AMOUNT */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Amount
                </th>

                {/* DURATION */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Duration
                </th>

                {/* CREATED AT */}
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created At
                </th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#4945ff]" />

                      <p className="mt-4 text-sm text-gray-500">
                        Loading lucky draws...
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* ERROR */}
              {!loading && error && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                      <X
                        size={22}
                        className="text-red-500"
                      />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-gray-800">
                      Failed to load lucky draws
                    </h3>

                    <p className="mt-1 text-sm text-red-500">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={fetchLuckyDraws}
                      className="mt-4 rounded-lg bg-[#4945ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#3835d9]"
                    >
                      Try again
                    </button>
                  </td>
                </tr>
              )}

              {/* DATA */}
              {!loading &&
                !error &&
                filteredDraws.map((draw) => (
                  <tr
                    key={draw.id}
                    onClick={() => handleRowClick(draw.id)}
                    className="cursor-pointer border-b border-gray-100 transition hover:bg-[#fafaff]"
                  >
                    {/* ID */}
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        #{draw.id}
                      </span>
                    </td>

                    {/* NAME */}
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {draw.name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Lucky Draw
                        </p>
                      </div>
                    </td>

                    {/* PEOPLE */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">
                        {draw.no_of_peoples ?? "-"}
                      </span>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-700">
                        ₹{draw.amount ?? "-"}
                      </span>
                    </td>

                    {/* DURATION */}
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-[#f0f0ff] px-2.5 py-1 text-xs font-medium text-[#4945ff]">
                        {formatDuration(draw)}
                      </span>
                    </td>

                    {/* CREATED AT */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                          {formatDateTime(draw.createdAt)}
                        </span>

                        {draw.createdAt && (
                          <span className="mt-1 text-xs text-gray-400">
                            Created
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

              {/* EMPTY */}
              {!loading &&
                !error &&
                filteredDraws.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <Ticket
                          size={22}
                          className="text-gray-400"
                        />
                      </div>

                      <h3 className="mt-4 text-sm font-semibold text-gray-800">
                        No lucky draws found
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {search
                          ? "Try changing your search."
                          : "No lucky draws are available."}
                      </p>
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between border-t px-4 py-4">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-medium text-gray-700">
              {filteredDraws.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              {draws.length}
            </span>{" "}
            lucky draws
          </p>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled
              className="rounded-lg border p-2 text-gray-300"
            >
              <ChevronsLeft size={16} />
            </button>

            <button
              type="button"
              disabled
              className="rounded-lg border p-2 text-gray-300"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              className="rounded-lg bg-[#4945ff] px-3 py-2 text-sm font-medium text-white"
            >
              1
            </button>

            <button
              type="button"
              disabled
              className="rounded-lg border p-2 text-gray-300"
            >
              <ChevronRight size={16} />
            </button>

            <button
              type="button"
              disabled
              className="rounded-lg border p-2 text-gray-300"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}