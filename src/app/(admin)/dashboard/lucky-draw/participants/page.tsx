"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Trophy,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import axios from "axios";

interface Participant {
  id: string;
  name: string;
  age?: number;
  email?: string;
  gender?: string;
  phone_Number?: string;
  photo?: string;
  id_Proof?: string;
  is_Verified: boolean;
  is_Winned_Participant: boolean;
  is_Winned_Time?: string | null;

  draw?: {
    id: string;
    name: string;
  };
}

export default function LuckyDrawParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchParticipants();
  }, []);

  const fetchParticipants = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/v1/admin/lucky-draw/participants",{
            withCredentials:true
        }
      );

      const result = await response.data;

      if (!response.data) {
        throw new Error(result.message || "Failed to fetch participants");
      }

      setParticipants(result.data || []);
    } catch (error) {
      console.error("Fetch participants error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredParticipants = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return participants;
    }

    return participants.filter((participant) => {
      return (
        participant.name?.toLowerCase().includes(value) ||
        participant.email?.toLowerCase().includes(value) ||
        participant.phone_Number?.toLowerCase().includes(value) ||
        participant.draw?.name?.toLowerCase().includes(value)
      );
    });
  }, [participants, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredParticipants.length / itemsPerPage)
  );

  const paginatedParticipants = filteredParticipants.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const allSelected =
    paginatedParticipants.length > 0 &&
    paginatedParticipants.every((participant) =>
      selectedIds.includes(participant.id)
    );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) =>
            !paginatedParticipants.some(
              (participant) => participant.id === id
            )
        )
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([
          ...previous,
          ...paginatedParticipants.map(
            (participant) => participant.id
          ),
        ]),
      ]);
    }
  };

  const toggleParticipant = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const deleteParticipants = async () => {
    if (selectedIds.length === 0) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${selectedIds.length} selected participant(s)?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        "/api/lucky-draw/participants",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ids: selectedIds,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to delete participants"
        );
      }

      setSelectedIds([]);
      await fetchParticipants();
    } catch (error) {
      console.error("Delete participants error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete participants"
      );
    }
  };

  const updateVerification = async (
    participant: Participant
  ) => {
    try {
      const response = await fetch(
        `/api/lucky-draw/participants/${participant.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            is_Verified: !participant.is_Verified,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update participant"
        );
      }

      setParticipants((previous) =>
        previous.map((item) =>
          item.id === participant.id
            ? {
                ...item,
                is_Verified: !item.is_Verified,
              }
            : item
        )
      );
    } catch (error) {
      console.error("Verification update error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update participant"
      );
    }
  };

  const getInitial = (name?: string) => {
    if (!name) return "?";

    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      {/* Header / Sidebar are already in your dashboard layout */}

      <main className="p-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-[#111827]">
              Draw Participants
            </h1>

            <p className="mt-1 text-sm text-[#64748b]">
              Manage and view all lucky draw participants.
            </p>
          </div>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          {/* Search + Actions */}
          <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] p-4">
            <div className="relative w-[450px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />

              <input
                type="text"
                placeholder="Search by name, email, phone or draw..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-[42px] w-full rounded-lg border border-[#dfe3eb] bg-white pl-10 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
              />
            </div>

            <button
              onClick={deleteParticipants}
              disabled={selectedIds.length === 0}
              className={`flex h-[42px] items-center gap-2 rounded-lg border px-4 text-sm font-medium transition ${
                selectedIds.length > 0
                  ? "border-red-200 text-red-500 hover:bg-red-50"
                  : "cursor-not-allowed border-red-100 text-red-300"
              }`}
            >
              <Trash2 size={16} />

              Delete

              {selectedIds.length > 0 && (
                <span>({selectedIds.length})</span>
              )}
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">
                  <th className="w-[55px] px-5 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Participant
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Email
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Phone
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Lucky Draw
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Verification
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Winner
                  </th>

                  <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center text-sm text-[#64748b]"
                    >
                      Loading participants...
                    </td>
                  </tr>
                ) : paginatedParticipants.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center"
                    >
                      <div className="text-sm font-medium text-[#475569]">
                        No participants found
                      </div>

                      <div className="mt-1 text-xs text-[#94a3b8]">
                        Try changing your search.
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedParticipants.map((participant) => (
                    <tr
                      key={participant.id}
                      className="border-b border-[#edf0f4] transition hover:bg-[#fafbff]"
                    >
                      {/* Checkbox */}
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(
                            participant.id
                          )}
                          onChange={() =>
                            toggleParticipant(participant.id)
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>

                      {/* Participant */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {participant.photo ? (
                            <img
                              src={participant.photo}
                              alt={participant.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9e7ff] text-sm font-semibold text-[#4f46e5]">
                              {getInitial(participant.name)}
                            </div>
                          )}

                          <div>
                            <p className="text-sm font-medium text-[#1e293b]">
                              {participant.name}
                            </p>

                            <p className="mt-0.5 text-xs text-[#94a3b8]">
                              ID: {participant.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-4 text-sm text-[#334155]">
                        {participant.email || "-"}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-4 text-sm text-[#334155]">
                        {participant.phone_Number || "-"}
                      </td>

                      {/* Lucky Draw */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-[#334155]">
                          {participant.draw?.name || "-"}
                        </span>
                      </td>

                      {/* Verification */}
                      <td className="px-4 py-4">
                        {participant.is_Verified ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
                            <CheckCircle size={13} />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                            <XCircle size={13} />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Winner */}
                      <td className="px-4 py-4">
                        {participant.is_Winned_Participant ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-600">
                            <Trophy size={13} />
                            Winner
                          </span>
                        ) : (
                          <span className="text-xs text-[#94a3b8]">
                            -
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            title="View participant"
                            onClick={() => {
                              window.location.href = `/dashboard/lucky-draw/participants/${participant.id}`;
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e2e8f0] text-[#64748b] transition hover:bg-[#f8fafc] hover:text-[#4f46e5]"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            title={
                              participant.is_Verified
                                ? "Unverify"
                                : "Verify"
                            }
                            onClick={() =>
                              updateVerification(participant)
                            }
                            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                              participant.is_Verified
                                ? "border border-red-200 text-red-500 hover:bg-red-50"
                                : "bg-[#4f46e5] text-white hover:bg-[#4338ca]"
                            }`}
                          >
                            {participant.is_Verified
                              ? "Unverify"
                              : "Verify"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-4 py-4">
            <p className="text-sm text-[#64748b]">
              Showing{" "}
              <span className="font-medium text-[#334155]">
                {filteredParticipants.length === 0
                  ? 0
                  : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium text-[#334155]">
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredParticipants.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-[#334155]">
                {filteredParticipants.length}
              </span>{" "}
              participants
            </p>

            <div className="flex items-center gap-2">
              {/* First */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9dee7] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#f8fafc]"
              >
                <ChevronsLeft size={16} />
              </button>

              {/* Previous */}
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(1, page - 1)
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9dee7] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#f8fafc]"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Current Page */}
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4f46e5] text-sm font-medium text-white">
                {currentPage}
              </div>

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9dee7] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#f8fafc]"
              >
                <ChevronRight size={16} />
              </button>

              {/* Last */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d9dee7] text-[#64748b] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[#f8fafc]"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}