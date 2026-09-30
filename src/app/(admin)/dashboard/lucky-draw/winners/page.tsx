"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Trophy,
  Search,
  Phone,
  Mail,
  Calendar,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Participant {
  id: string;
  name?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone_Number?: string;
  photo?: string;
  is_Verified?: boolean;
}

interface LuckyDraw {
  id: string;
  name?: string;
}

interface Winner {
    id:string
  Cycle: string;
  won_At: string | null;

  draw?: LuckyDraw | null;

  participant?: Participant | null;

  createdAt?: string;
  updatedAt?: string;
}

export default function WinnersPage() {
  const router = useRouter();

  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "/api/v1/admin/lucky-draw/winners",
        {
          withCredentials: true,
        }
      );

      setWinners(response.data?.data || []);
    } catch (error) {
      console.error("Fetch winners error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWinners = winners.filter((winner) => {
    const value = search.toLowerCase().trim();

    if (!value) return true;

    const participant = winner.participant;
    const draw = winner.draw;

    return (
      winner.Cycle?.toLowerCase().includes(value) ||
      participant?.name?.toLowerCase().includes(value) ||
      participant?.email?.toLowerCase().includes(value) ||
      participant?.phone_Number?.toLowerCase().includes(value) ||
      draw?.name?.toLowerCase().includes(value)
    );
  });

  const getInitial = (name?: string) => {
    if (!name) return "?";

    return name.charAt(0).toUpperCase();
  };

  const formatWinnerDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewParticipant = (winnerId?: string) => {
    if (!winnerId) return;

    router.push(
      `/dashboard/lucky-draw/winners/${winnerId}`
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <main className="p-6">

        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[24px] font-semibold text-[#111827]">
                Winners
              </h1>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                <Trophy size={13} />
                Lucky Draw Winners
              </span>
            </div>

            <p className="mt-1 text-sm text-[#64748b]">
              View all lucky draw winners.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">

          {/* Search */}
          <div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] p-4">

            <div className="relative w-[450px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]"
              />

              <input
                type="text"
                placeholder="Search by name, email, phone, cycle or draw..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                className="h-[42px] w-full rounded-lg border border-[#dfe3eb] bg-white pl-10 pr-4 text-sm text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
              />
            </div>

            <div className="rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700">
              {filteredWinners.length} Winner
              {filteredWinners.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">

              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#fafafa]">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Winner
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
                    Cycle
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Won At
                  </th>

                  <th className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wide text-[#64748b]">
                    Status
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
                      Loading winners...
                    </td>
                  </tr>
                ) : filteredWinners.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-50">
                        <Trophy
                          size={22}
                          className="text-yellow-500"
                        />
                      </div>

                      <div className="mt-3 text-sm font-medium text-[#475569]">
                        No winners found
                      </div>

                      <div className="mt-1 text-xs text-[#94a3b8]">
                        Winners will appear here after a lucky draw.
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWinners.map((winner) => {

                    const participant = winner.participant;

                    return (
                      <tr
                        key={`${winner.Cycle}-${participant?.id}`}
                        onClick={() =>
                          handleViewParticipant(winner?.id)
                        }
                        className="cursor-pointer border-b border-[#edf0f4] transition hover:bg-[#fafbff]"
                      >

                        {/* Winner */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            {participant?.photo ? (
                              <img
                                src={participant.photo}
                                alt={participant.name || "Winner"}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7d6] text-sm font-semibold text-[#d99a00]">
                                {getInitial(participant?.name)}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-[#1e293b]">
                                  {participant?.name || "-"}
                                </p>

                                <Trophy
                                  size={14}
                                  className="text-yellow-500"
                                />
                              </div>

                              <p className="mt-0.5 text-xs text-[#94a3b8]">
                                ID: {winner?.id || "-"}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#334155]">
                            <Mail
                              size={14}
                              className="text-[#94a3b8]"
                            />

                            {participant?.email || "-"}
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#334155]">
                            <Phone
                              size={14}
                              className="text-[#94a3b8]"
                            />

                            {participant?.phone_Number || "-"}
                          </div>
                        </td>

                        {/* Lucky Draw */}
                        <td className="px-4 py-4">
                          <span className="rounded-md bg-[#eef2ff] px-2.5 py-1 text-xs font-medium text-[#4f46e5]">
                            {winner.draw?.name || "-"}
                          </span>
                        </td>

                        {/* Cycle */}
                        <td className="px-4 py-4">
                          <span className="rounded-md bg-[#f1f5f9] px-2.5 py-1 text-xs font-medium text-[#475569]">
                            {winner.Cycle || "-"}
                          </span>
                        </td>

                        {/* Won At */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#475569]">
                            <Calendar
                              size={14}
                              className="text-[#94a3b8]"
                            />

                            {formatWinnerDate(winner.won_At)}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-2.5 py-1 text-xs font-medium text-yellow-600">
                            <Trophy size={13} />
                            Winner
                          </span>
                        </td>

                       
                    

                      </tr>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-[#e5e7eb] px-4 py-4">
            <p className="text-sm text-[#64748b]">
              Showing{" "}
              <span className="font-medium text-[#334155]">
                {filteredWinners.length}
              </span>{" "}
              winner
              {filteredWinners.length !== 1 ? "s" : ""}
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}