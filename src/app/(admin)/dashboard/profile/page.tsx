
"use client";

import {
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  Hash,
  Loader2,
  LogOut,
  Pencil,
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


// =========================================================
// PROFILE PAGE
// =========================================================

export default function ProfilePage() {
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [loggingOut, setLoggingOut] =
    useState(false);


  // =======================================================
  // FETCH ADMIN DETAILS
  // =======================================================

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        setLoading(true);
        setError("");

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
          "Fetch profile error:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Unable to load profile"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);


  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await axios.post(
        "/api/v1/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      router.push("/login");

    } catch (error) {
      console.error(
        "Logout error:",
        error
      );

    } finally {
      setLoggingOut(false);
    }
  };


  // =======================================================
  // INITIAL
  // =======================================================

  const adminInitial = admin?.name
    ? admin.name.charAt(0).toUpperCase()
    : "A";


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">

        <div className="flex items-center gap-3 rounded-lg bg-white px-6 py-4 shadow-sm">

          <Loader2
            size={22}
            className="animate-spin text-blue-600"
          />

          <span className="text-sm text-gray-600">
            Loading profile...
          </span>

        </div>

      </div>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">

        <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            !
          </div>

          <h2 className="mt-4 text-lg font-semibold text-gray-800">
            Unable to load profile
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }


  // =======================================================
  // PROFILE
  // =======================================================

  return (
    <div className="min-h-screen bg-gray-100">


      {/* =================================================
          HEADER
      ================================================== */}

      <header className="flex h-16 items-center justify-between border-b bg-white px-6">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <h1 className="text-xl font-semibold text-gray-800">
              Profile
            </h1>

            <p className="text-sm text-gray-500">
              Manage your administrator profile
            </p>

          </div>

        </div>


        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loggingOut ? (
            <Loader2
              size={17}
              className="animate-spin"
            />
          ) : (
            <LogOut size={17} />
          )}

          Logout

        </button>

      </header>


      {/* =================================================
          CONTENT
      ================================================== */}

      <main className="mx-auto max-w-5xl p-6">


        {/* =================================================
            PROFILE CARD
        ================================================== */}

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">


          {/* PROFILE HEADER */}

          <div className="bg-gray-900 px-6 py-8">

            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {/* INITIAL ONLY - NO IMAGE */}

              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white ring-4 ring-gray-800">
                {adminInitial}
              </div>


              <div className="text-center sm:text-left">

                <h2 className="text-2xl font-bold text-white">
                  {admin?.name || "Admin"}
                </h2>

                <p className="mt-1 text-sm text-gray-300">
                  {admin?.email || ""}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-gray-200">
                  <ShieldCheck size={14} />

                  {admin?.role || "Administrator"}
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              PROFILE DETAILS
          ================================================== */}

          <div className="p-6">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="text-lg font-semibold text-gray-800">
                  Account Information
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Your administrator account details.
                </p>

              </div>


              {/* EDIT BUTTON */}

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/profile/edit"
                  )
                }
                className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >

                <Pencil size={16} />

                Edit

              </button>

            </div>


            {/* DETAILS GRID */}

            <div className="mt-6 grid gap-5 md:grid-cols-2">


              {/* NAME */}

              <div className="rounded-lg border bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                    <User size={19} />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Full Name
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {admin?.name || "-"}
                    </p>

                  </div>

                </div>

              </div>


              {/* EMAIL */}

              <div className="rounded-lg border bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-green-100 p-2 text-green-600">
                    <Mail size={19} />
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Email
                    </p>

                    <p className="mt-1 break-all font-medium text-gray-800">
                      {admin?.email || "-"}
                    </p>

                  </div>

                </div>

              </div>


              {/* ROLE */}

              <div className="rounded-lg border bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                    <ShieldCheck size={19} />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Role
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {admin?.role || "-"}
                    </p>

                  </div>

                </div>

              </div>


              {/* ADMIN ID */}

              <div className="rounded-lg border bg-gray-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                    <Hash size={19} />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Admin ID
                    </p>

                    <p className="mt-1 font-medium text-gray-800">
                      {admin?.id || "-"}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                ACCOUNT STATUS
            ================================================== */}

            <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">

              <div className="flex items-center gap-3">

                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <div>

                  <p className="text-sm font-semibold text-green-800">
                    Account Active
                  </p>

                  <p className="mt-0.5 text-xs text-green-700">
                    Your administrator account is currently active.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

