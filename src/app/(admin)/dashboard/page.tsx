
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
  Loader2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// =========================================================
// TYPES
// =========================================================

interface Admin {
  id: number | string;
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalBids: number;
  totalLuckyDrawEvents: number;
  totalBiddingUsers: number;
  totalPayments: number;
}

// =========================================================
// DASHBOARD PAGE
// =========================================================

export default function DashboardPage() {
  const router = useRouter();

  // =======================================================
  // SIDEBAR STATES
  // =======================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  const [biddingOpen, setBiddingOpen] =
    useState(false);

  const [luckyDrawOpen, setLuckyDrawOpen] =
    useState(false);

  // =======================================================
  // PROFILE DROPDOWN
  // =======================================================

  const [profileOpen, setProfileOpen] =
    useState(false);

  // =======================================================
  // ADMIN
  // =======================================================

  const [admin, setAdmin] =
    useState<Admin | null>(null);

  const [loadingAdmin, setLoadingAdmin] =
    useState(true);

  // =======================================================
  // DASHBOARD STATS
  // =======================================================

  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [loadingStats, setLoadingStats] =
    useState(true);

  // =======================================================
  // UNAUTHORIZED
  // =======================================================

  const [unauthorized, setUnauthorized] =
    useState(false);

  // =======================================================
  // FETCH ADMIN DETAILS
  // =======================================================

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoadingAdmin(true);

        const response = await axios.get(
          "/api/v1/admin",
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (!data) {
          throw new Error(
            "Unable to fetch admin details"
          );
        }

        setAdmin(data?.data || data);

      } catch (error: any) {
        console.error(
          "Fetch admin error:",
          error
        );

        // Token missing / invalid
        if (error.response?.status === 401) {
          setUnauthorized(true);
        }
      } finally {
        setLoadingAdmin(false);
      }
    };

    fetchAdmin();
  }, []);

  // =======================================================
  // FETCH DASHBOARD STATISTICS
  // =======================================================

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoadingStats(true);

        const response = await axios.get(
          "/api/v1/admin/dashboard",
          {
            withCredentials: true,
          }
        );

        const data = response.data;

        if (!data) {
          throw new Error(
            "Unable to fetch dashboard data"
          );
        }

        setStats(data?.data || data);

      } catch (error: any) {
        console.error(
          "Dashboard stats error:",
          error
        );

        // Token missing / invalid
        if (error.response?.status === 401) {
          setUnauthorized(true);
        }
      } finally {
        setLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/v1/admin/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      router.push("/");

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  };

  // =======================================================
  // 401 UNAUTHORIZED PAGE
  // =======================================================

  if (unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl font-bold text-red-600">
              !
            </span>
          </div>

          <h1 className="mt-6 text-7xl font-bold text-red-600">
            401
          </h1>

          <h2 className="mt-3 text-2xl font-semibold text-gray-800">
            Unauthorized
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your authentication token was not found
            or is invalid. You are not authorized
            to access this page.
          </p>

        </div>
      </div>
    );
  }

  // =======================================================
  // SIDEBAR STYLES
  // =======================================================

  const sidebarItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-300 transition hover:bg-gray-800";

  const childItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 pl-11 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white";

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`${
          sidebarOpen
            ? "w-64"
            : "w-20"
        } fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300`}
      >

        {/* =================================================
            SIDEBAR HEADER
        ================================================== */}

        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">

          {sidebarOpen && (
            <h1 className="text-xl font-bold">
              Admin Panel
            </h1>
          )}

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="rounded-lg p-2 hover:bg-gray-800"
          >
            <Menu size={22} />
          </button>

        </div>

        {/* =================================================
            SIDEBAR NAVIGATION
        ================================================== */}

        <nav className="mt-6 space-y-2 px-3">

          {/* =================================================
              DASHBOARD
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className={`${sidebarItem} ${
              sidebarOpen
                ? ""
                : "justify-center"
            }`}
          >

            <LayoutDashboard size={20} />

            {sidebarOpen && (
              <span>
                Dashboard
              </span>
            )}

          </button>

          {/* =================================================
              USER
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/users"
              )
            }
            className={`${sidebarItem} ${
              sidebarOpen
                ? ""
                : "justify-center"
            }`}
          >

            <Users size={20} />

            {sidebarOpen && (
              <span>
                User
              </span>
            )}

          </button>

          {/* =================================================
              BIDDING
          ================================================== */}

          <div>

            <button
              type="button"
              onClick={() =>
                setBiddingOpen(
                  !biddingOpen
                )
              }
              className={`${sidebarItem} ${
                sidebarOpen
                  ? ""
                  : "justify-center"
              }`}
            >

              <Gavel size={20} />

              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">
                    Bidding
                  </span>

                  {biddingOpen ? (
                    <ChevronDown
                      size={17}
                    />
                  ) : (
                    <ChevronRight
                      size={17}
                    />
                  )}
                </>
              )}

            </button>

            {/* BIDDING SUBMENU */}

            {sidebarOpen &&
              biddingOpen && (
                <div className="mt-1 space-y-1">

                  {/* Biddings */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/bidding"
                      )
                    }
                    className={childItem}
                  >

                    <Gavel size={17} />

                    Biddings

                  </button>

                  {/* Bidding Round */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/bidding-round"
                      )
                    }
                    className={childItem}
                  >

                    <Ticket size={17} />

                    Bidding Round

                  </button>

                  {/* Bidding User Payment */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/bidding-user-payment"
                      )
                    }
                    className={childItem}
                  >

                    <CreditCard size={17} />

                    Bidding User Payment

                  </button>

                  {/* Bidding Participants */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/bidding-participants"
                      )
                    }
                    className={childItem}
                  >

                    <Users size={17} />

                    Bidding Participants

                  </button>

                  {/* Bidding Participant Payment */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/bidding-participant-payment"
                      )
                    }
                    className={childItem}
                  >

                    <CreditCard
                      size={17}
                    />

                    Bidding Participant Payment

                  </button>

                </div>
              )}

          </div>

          {/* =================================================
              LUCKY DRAW
          ================================================== */}

          <div>

            <button
              type="button"
              onClick={() =>
                setLuckyDrawOpen(
                  !luckyDrawOpen
                )
              }
              className={`${sidebarItem} ${
                sidebarOpen
                  ? ""
                  : "justify-center"
              }`}
            >

              <Ticket size={20} />

              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">
                    Lucky Draw
                  </span>

                  {luckyDrawOpen ? (
                    <ChevronDown
                      size={17}
                    />
                  ) : (
                    <ChevronRight
                      size={17}
                    />
                  )}
                </>
              )}

            </button>

            {/* LUCKY DRAW SUBMENU */}

            {sidebarOpen &&
              luckyDrawOpen && (
                <div className="mt-1 space-y-1">

                  {/* Lucky Draw */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/lucky-draw"
                      )
                    }
                    className={childItem}
                  >

                    <Ticket size={17} />

                    Lucky Draw

                  </button>

                  {/* Lucky Draw Form */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/lucky-draw-form"
                      )
                    }
                    className={childItem}
                  >

                    <Ticket size={17} />

                    Lucky Draw Form

                  </button>

                  {/* Lucky Draw Winner */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/lucky-draw-winner"
                      )
                    }
                    className={childItem}
                  >

                    <Users size={17} />

                    Lucky Draw Winner

                  </button>

                  {/* Lucky Draw Participant Payment */}

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/dashboard/lucky-draw-participant-payment"
                      )
                    }
                    className={childItem}
                  >

                    <CreditCard
                      size={17}
                    />

                    Lucky Draw Participant Payment

                  </button>

                </div>
              )}

          </div>

        </nav>

        {/* =================================================
            SIDEBAR LOGOUT
        ================================================== */}

        <div className="absolute bottom-5 w-full px-3">

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-400 hover:bg-gray-800"
          >

            <LogOut size={20} />

            {sidebarOpen && (
              <span>
                Logout
              </span>
            )}

          </button>

        </div>

      </aside>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className={`${
          sidebarOpen
            ? "ml-64"
            : "ml-20"
        } min-h-screen flex-1 transition-all duration-300`}
      >

        {/* =================================================
            HEADER
        ================================================== */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">

          {/* HEADER LEFT */}

          <div>

            <h2 className="text-xl font-semibold text-gray-800">
              Dashboard
            </h2>

            <p className="text-sm text-gray-500">
              Welcome back
              {admin?.name
                ? `, ${admin.name}`
                : ""}
            </p>

          </div>

          {/* HEADER RIGHT */}

          <div className="flex items-center gap-4">

            {/* SEARCH */}

            <div className="hidden items-center rounded-lg border bg-gray-50 px-3 md:flex">

              <Search
                size={18}
                className="text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                className="w-40 bg-transparent px-2 py-2 text-sm outline-none"
              />

            </div>

            {/* NOTIFICATION */}

            <button
              type="button"
              className="relative rounded-lg p-2 hover:bg-gray-100"
            >

              <Bell size={21} />

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />

            </button>

            {/* =================================================
                ADMIN PROFILE DROPDOWN
            ================================================== */}

            <div className="relative">

              {/* PROFILE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-100"
              >

                {/* INITIAL */}

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">

                  {admin?.name
                    ? admin.name
                        .charAt(0)
                        .toUpperCase()
                    : "A"}

                </div>

                {/* ADMIN NAME */}

                <div className="hidden text-left sm:block">

                  {loadingAdmin ? (

                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                  ) : (

                    <>

                      <p className="text-sm font-medium text-gray-800">
                        {admin?.name ||
                          "Admin"}
                      </p>

                      <p className="text-xs text-gray-500">
                        {admin?.role || ""}
                      </p>

                    </>

                  )}

                </div>

                <ChevronDown
                  size={16}
                  className="text-gray-500"
                />

              </button>

              {/* PROFILE DROPDOWN */}

              {profileOpen && (

                <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white py-2 shadow-lg">

                  {/* PROFILE */}

                  <button
                    type="button"
                    onClick={() => {

                      setProfileOpen(
                        false
                      );

                      router.push(
                        "/dashboard/profile"
                      );

                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >

                    <User size={17} />

                    Profile

                  </button>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    onClick={() => {

                      setProfileOpen(
                        false
                      );

                      handleLogout();

                    }}
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

        {/* =====================================================
            DASHBOARD CONTENT
        ====================================================== */}

        <section className="p-6">

          {/* DASHBOARD TITLE */}

          <div className="mb-6">

            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Overview of your bidding and
              lucky draw system.
            </p>

          </div>

          {/* =================================================
              STATISTICS
          ================================================== */}

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* TOTAL BIDS */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="w-fit rounded-lg bg-blue-100 p-3 text-blue-600">
                <Gavel size={22} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Total Bids
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-800">

                {loadingStats ? (

                  <Loader2
                    size={22}
                    className="animate-spin"
                  />

                ) : (

                  stats?.totalBids ?? 0

                )}

              </h3>

            </div>

            {/* LUCKY DRAW EVENTS */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="w-fit rounded-lg bg-purple-100 p-3 text-purple-600">
                <Ticket size={22} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Lucky Draw Events
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-800">

                {loadingStats ? (

                  <Loader2
                    size={22}
                    className="animate-spin"
                  />

                ) : (

                  stats?.totalLuckyDrawEvents ?? 0

                )}

              </h3>

            </div>

            {/* BIDDING USERS */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="w-fit rounded-lg bg-green-100 p-3 text-green-600">
                <Users size={22} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Bidding Users
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-800">

                {loadingStats ? (

                  <Loader2
                    size={22}
                    className="animate-spin"
                  />

                ) : (

                  stats?.totalBiddingUsers ?? 0

                )}

              </h3>

            </div>

            {/* TOTAL PAYMENTS */}

            <div className="rounded-xl bg-white p-5 shadow-sm">

              <div className="w-fit rounded-lg bg-orange-100 p-3 text-orange-600">
                <CreditCard size={22} />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Total Payments
              </p>

              <h3 className="mt-1 text-2xl font-bold text-gray-800">

                {loadingStats ? (

                  <Loader2
                    size={22}
                    className="animate-spin"
                  />

                ) : (

                  stats?.totalPayments ?? 0

                )}

              </h3>

            </div>

          </div>

          {/* =================================================
              QUICK MANAGEMENT
          ================================================== */}

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            {/* BIDDING CARD */}

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                  <Gavel size={24} />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    Bidding
                  </h3>

                  <p className="text-sm text-gray-500">
                    Manage bids, rounds, users and
                    payments.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => {

                  setBiddingOpen(true);

                  router.push(
                    "/dashboard/bidding"
                  );

                }}
                className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Manage Bidding
              </button>

            </div>

            {/* LUCKY DRAW CARD */}

            <div className="rounded-xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                  <Ticket size={24} />
                </div>

                <div>

                  <h3 className="text-lg font-semibold text-gray-800">
                    Lucky Draw
                  </h3>

                  <p className="text-sm text-gray-500">
                    Manage lucky draw events, forms,
                    winners and payments.
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => {

                  setLuckyDrawOpen(true);

                  router.push(
                    "/dashboard/lucky-draw"
                  );

                }}
                className="mt-5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
              >
                Manage Lucky Draw
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

