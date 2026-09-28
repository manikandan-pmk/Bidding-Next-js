"use client";

import {
  LayoutDashboard,
  Gavel,
  Ticket,
  Users,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  User,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
  Pencil,
  Eye,
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

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [biddingOpen, setBiddingOpen] = useState(false);
  const [luckyDrawOpen, setLuckyDrawOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);

  const [draws, setDraws] = useState<LuckyDraw[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchLuckyDraws = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/v1/admin/lucky-draw", {
        withCredentials: true,
      });

      const result = response.data;

      if (result?.error) {
        throw new Error(result?.message || "Failed to fetch lucky draws");
      }

      let data: LuckyDraw[] = [];

      if (Array.isArray(result)) {
        data = result;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      } else if (Array.isArray(result?.luckyDraws)) {
        data = result.luckyDraws;
      }

      setDraws(data);
    } catch (err) {
      console.error("FETCH LUCKY DRAW ERROR:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch lucky draws"
      );
      setDraws([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLuckyDraws();
  }, []);

  const filteredDraws = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return draws;

    return draws.filter((draw) => {
      return (
        String(draw.id).toLowerCase().includes(value) ||
        draw.name?.toLowerCase().includes(value) ||
        String(draw.duration_Unit ?? "")
          .toLowerCase()
          .includes(value) ||
        String(draw.upi_Id ?? "")
          .toLowerCase()
          .includes(value)
      );
    });
  }, [draws, search]);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("LOGOUT ERROR:", err);
    } finally {
      router.push("/");
    }
  };

  const sidebarItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-300 transition hover:bg-gray-800";

  const childItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 pl-11 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white";

  const formatDate = (date?: string) => {
    if (!date) return "-";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "-";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDuration = (draw: LuckyDraw) => {
    if (
      draw.duration_Value === undefined ||
      draw.duration_Value === null ||
      !draw.duration_Unit
    ) {
      return "-";
    }

    return `${draw.duration_Value} ${String(draw.duration_Unit).toLowerCase()}`;
  };

  return (
    <div className="flex min-h-screen bg-[#f6f6f9]">
      {/* SIDEBAR */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">Admin Panel</h1>
          )}

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-800"
          >
            <Menu size={22} />
          </button>
        </div>

        <nav className="mt-6 space-y-2 px-3">
          {/* DASHBOARD */}
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className={`${sidebarItem} ${sidebarOpen ? "" : "justify-center"}`}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>

          {/* USERS */}
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className={`${sidebarItem} ${sidebarOpen ? "" : "justify-center"}`}
          >
            <Users size={20} />
            {sidebarOpen && <span>Users</span>}
          </button>

          {/* BIDDING */}
          <div>
            <button
              type="button"
              onClick={() => setBiddingOpen(!biddingOpen)}
              className={`${sidebarItem} ${
                sidebarOpen ? "" : "justify-center"
              }`}
            >
              <Gavel size={20} />

              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">Bidding</span>
                  {biddingOpen ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </>
              )}
            </button>

            {sidebarOpen && biddingOpen && (
              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/bidding")}
                  className={childItem}
                >
                  <Gavel size={17} />
                  Biddings
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/bidding-round")}
                  className={childItem}
                >
                  <Ticket size={17} />
                  Bidding Round
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard/bidding-user-payment")
                  }
                  className={childItem}
                >
                  <CreditCard size={17} />
                  Bidding User Payment
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard/bidding-participants")
                  }
                  className={childItem}
                >
                  <Users size={17} />
                  Bidding Participants
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard/bidding-participant-payment")
                  }
                  className={childItem}
                >
                  <CreditCard size={17} />
                  Bidding Participant Payment
                </button>
              </div>
            )}
          </div>

          {/* LUCKY DRAW */}
          <div>
            <button
              type="button"
              onClick={() => setLuckyDrawOpen(!luckyDrawOpen)}
              className={`${sidebarItem} ${
                sidebarOpen ? "bg-gray-800 text-white" : "justify-center"
              }`}
            >
              <Ticket size={20} />

              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">Lucky Draw</span>

                  {luckyDrawOpen ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </>
              )}
            </button>

            {sidebarOpen && luckyDrawOpen && (
              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/lucky-draw")}
                  className={`${childItem} bg-gray-800 text-white`}
                >
                  <Ticket size={17} />
                  Lucky Draw
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/lucky-draw-form")}
                  className={childItem}
                >
                  <Ticket size={17} />
                  Lucky Draw Form
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/lucky-draw-winner")}
                  className={childItem}
                >
                  <Users size={17} />
                  Lucky Draw Winner
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/dashboard/lucky-draw-participant-payment"
                    )
                  }
                  className={childItem}
                >
                  <CreditCard size={17} />
                  Lucky Draw Participant Payment
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* LOGOUT */}
        <div className="absolute bottom-5 w-full px-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-400 hover:bg-gray-800"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } min-h-screen flex-1 transition-all duration-300`}
      >
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Lucky Draw
            </h2>
            <p className="text-sm text-gray-500">
              Manage all lucky draws
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center rounded-lg border bg-gray-50 px-3 md:flex">
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 bg-transparent px-2 py-2 text-sm outline-none"
              />
            </div>

            <button
              type="button"
              className="relative rounded-lg p-2 hover:bg-gray-100"
            >
              <Bell size={21} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                  A
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-gray-800">Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white py-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/profile")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={17} />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <section className="p-6">
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
              onClick={() => router.push("/dashboard/lucky-draw-form")}
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
                <Search size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by name, ID, duration or UPI..."
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
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px]">
                <thead className="bg-[#fafafa]">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Lucky Draw
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      People
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Duration
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      UPI ID
                    </th>

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Created
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* LOADING */}
                  {loading && (
                    <tr>
                      <td colSpan={8} className="px-6 py-16 text-center">
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
                      <td colSpan={8} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                          <X size={22} className="text-red-500" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-800">
                          Failed to load lucky draws
                        </h3>

                        <p className="mt-1 text-sm text-red-500">{error}</p>

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
                        className="border-b border-gray-100 transition hover:bg-[#fafaff]"
                      >
                        <td className="px-4 py-4">
                          <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                            #{draw.id}
                          </span>
                        </td>

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

                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {draw.no_of_peoples ?? "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm font-medium text-gray-700">
                            ₹{draw.amount ?? "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="rounded-md bg-[#f0f0ff] px-2.5 py-1 text-xs font-medium text-[#4945ff]">
                            {formatDuration(draw)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-600">
                            {draw.upi_Id || "-"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span className="text-sm text-gray-500">
                            {formatDate(draw.createdAt)}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              title="View"
                              onClick={() =>
                                router.push(
                                  `/dashboard/lucky-draw/${draw.id}`
                                )
                              }
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-[#4945ff]"
                            >
                              <Eye size={17} />
                            </button>

                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                router.push(
                                  `/dashboard/lucky-draw-form?id=${draw.id}`
                                )
                              }
                              className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50 hover:text-[#4945ff]"
                            >
                              <Pencil size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                  {/* EMPTY */}
                  {!loading &&
                    !error &&
                    filteredDraws.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <Ticket size={22} className="text-gray-400" />
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
      </main>
    </div>
  );
}
