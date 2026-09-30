"use client";

import {
  Gavel,
  Ticket,
  Users,
  CreditCard,
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
  // ADMIN
  // =======================================================

  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // =======================================================
  // DASHBOARD STATS
  // =======================================================

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // =======================================================
  // UNAUTHORIZED
  // =======================================================

  const [unauthorized, setUnauthorized] = useState(false);

  // =======================================================
  // FETCH ADMIN DETAILS
  // =======================================================

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoadingAdmin(true);

        const response = await axios.get("/api/v1/admin", {
          withCredentials: true,
        });

        const data = response.data;

        if (!data) {
          throw new Error("Unable to fetch admin details");
        }

        setAdmin(data?.data || data);
      } catch (error: any) {
        console.error("Fetch admin error:", error);

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
          throw new Error("Unable to fetch dashboard data");
        }

        setStats(data?.data || data);
      } catch (error: any) {
        console.error("Dashboard stats error:", error);

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
  // 401 UNAUTHORIZED PAGE
  // =======================================================

  if (unauthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-lg">
          {/* ICON */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl font-bold text-red-600">
              !
            </span>
          </div>

          {/* STATUS */}
          <h1 className="mt-6 text-7xl font-bold text-red-600">
            401
          </h1>

          <h2 className="mt-3 text-2xl font-semibold text-gray-800">
            Unauthorized
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Your authentication token was not found or is
            invalid. You are not authorized to access this
            page.
          </p>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-lg bg-[#4945ff] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3835d9]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <section className="p-6">
      {/* =================================================
          DASHBOARD TITLE
      ================================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Overview of your bidding and lucky draw system.
        </p>
      </div>

      {/* =================================================
          WELCOME ADMIN
      ================================================== */}

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-4">
          {/* ADMIN AVATAR */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-semibold text-white">
            {admin?.name
              ? admin.name.charAt(0).toUpperCase()
              : "A"}
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Welcome back
            </p>

            {loadingAdmin ? (
              <div className="mt-1 flex items-center gap-2">
                <Loader2
                  size={18}
                  className="animate-spin text-gray-500"
                />

                <span className="text-sm text-gray-500">
                  Loading admin...
                </span>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800">
                  {admin?.name || "Admin"}
                </h2>

                <p className="text-sm text-gray-500">
                  {admin?.email || ""}
                </p>
              </>
            )}
          </div>
        </div>
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
                Manage bids, rounds, users and payments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/bidding")
            }
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
                Manage lucky draw events, forms, winners
                and payments.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/lucky-draw")
            }
            className="mt-5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700"
          >
            Manage Lucky Draw
          </button>
        </div>
      </div>
    </section>
  );
}