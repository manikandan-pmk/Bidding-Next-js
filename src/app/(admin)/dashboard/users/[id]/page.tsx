"use client";

import {
  ArrowLeft,
  Loader2,
  Mail,
  Save,
  User,
  X,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

// =========================================================
// TYPES
// =========================================================

interface UserData {
  id: number | string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  data?: UserData;
  user?: UserData;
  error?: boolean;
  message?: string;
}

// =========================================================
// PAGE
// =========================================================

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id;

  // =======================================================
  // STATE
  // =======================================================

  const [user, setUser] = useState<UserData | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =======================================================
  // FORM
  // =======================================================

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  // =======================================================
  // FETCH USER
  // =======================================================

  const fetchUser = async () => {
    if (!id) {
      setError("User ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get<ApiResponse>(
        `/api/v1/admin/users/${id}`,
        {
          withCredentials: true,
        }
      );

      const result = response.data;

      if (result?.error) {
        throw new Error(result.message || "Failed to fetch user");
      }

      const data: UserData =
        result?.data ||
        result?.user ||
        (result as UserData);

      if (!data || !data.id) {
        throw new Error("User data not found");
      }

      // Only use editable user information
      const cleanUser: UserData = {
        id: data.id,
        name: data.name ?? "",
        email: data.email ?? "",
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      setUser(cleanUser);

      setForm({
        name: cleanUser.name,
        email: cleanUser.email,
      });
    } catch (error) {
      console.error("FETCH USER ERROR:", error);

      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch user"
        );
      } else {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch user"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // INITIAL FETCH
  // =======================================================

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  // =======================================================
  // FORM CHANGE
  // =======================================================

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =======================================================
  // SAVE / UPDATE
  // =======================================================

  const handleSave = async () => {
    if (!id) return;

    if (!form.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!form.email.trim()) {
      alert("Email is required");
      return;
    }

    try {
      setSaving(true);

      const response = await axios.put(
        `/api/v1/admin/users/${id}`,
        {
          name: form.name.trim(),
          email: form.email.trim(),
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data;

      if (result?.error) {
        throw new Error(
          result?.message || "Failed to update user"
        );
      }

      await fetchUser();

      alert("User updated successfully");
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            error.message ||
            "Failed to update user"
        );
      } else {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to update user"
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
              <Loader2
                size={24}
                className="animate-spin text-blue-600"
              />
            </div>

            <p className="mt-4 text-sm font-semibold text-gray-700">
              Loading user...
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Fetching user information
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] px-6 py-8">
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className="group flex items-center gap-2 text-sm font-semibold text-blue-600"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />

          Back to Users
        </button>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <X
              className="text-red-500"
              size={24}
            />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            User not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Unable to load this user."}
          </p>

          <button
            onClick={() =>
              router.push("/dashboard/users")
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1500px] px-6 md:px-10">

          {/* BREADCRUMB */}

          <div className="flex h-12 items-center gap-2 text-xs text-gray-400">
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/users")
              }
              className="transition hover:text-blue-600"
            >
              Users
            </button>

            <span>/</span>

            <span className="text-gray-600">
              {form.name || "User"}
            </span>
          </div>

          {/* HEADER */}

          <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              {/* AVATAR */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm shadow-blue-200">
                {form.name
                  ?.split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((word) =>
                    word[0]?.toUpperCase()
                  )
                  .join("") || "U"}
              </div>

              {/* USER NAME */}

              <div>
                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    {form.name || "User"}
                  </h1>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>

                </div>

                <p className="mt-1 text-sm text-gray-500">
                  View and manage user information
                </p>
              </div>
            </div>

            {/* BACK BUTTON */}

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/users")
              }
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              <ArrowLeft size={16} />
              Back to Users
            </button>

          </div>
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-[1500px] px-6 py-8 md:px-10">

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* =================================================
              LEFT - ONLY USER FORM
          ================================================= */}

          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* NAME */}

              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-blue-600">
                    <User size={16} />
                  </span>

                  <label className="text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                </div>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Enter full name"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              {/* EMAIL */}

              <div>
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-blue-600">
                    <Mail size={16} />
                  </span>

                  <label className="text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                </div>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }
                  placeholder="Enter email address"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                />
              </div>

            </div>
          </section>

          {/* =================================================
              RIGHT - ACTIONS
          ================================================= */}

          <aside>
            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-5">
                <h3 className="font-semibold text-gray-900">
                  Actions
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Save changes made to this user.
                </p>
              </div>

              {/* SAVE */}

              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={17} />

                    Save Changes
                  </>
                )}
              </button>

              {/* CANCEL */}

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/users")
                }
                className="mt-2 h-11 w-full rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}