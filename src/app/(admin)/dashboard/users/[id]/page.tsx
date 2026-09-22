
"use client";

import {
  ArrowLeft,
  Check,
  Copy,
  Edit3,
  KeyRound,
  Loader2,
  Mail,
  MoreHorizontal,
  Save,
  ShieldCheck,
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
  id: number;
  name: string;
  email: string;
  password: string;
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

  const [error, setError] = useState("");

  const [saving, setSaving] = useState(false);

  const [copied, setCopied] = useState(false);

  // =======================================================
  // FORM
  // =======================================================

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // =======================================================
  // FETCH USER
  // =======================================================

  const fetchUser = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `/api/v1/admin/users/${id}`,
        {
          withCredentials: true,
        }
      );

      const result = response.data;

      if (result?.error) {
        throw new Error(
          result?.message || "Failed to fetch user"
        );
      }

      const data: UserData =
        result?.data ||
        result?.user ||
        result;

      if (!data) {
        throw new Error("User data not found");
      }

      setUser(data);

      setForm({
        name: data.name ?? "",
        email: data.email ?? "",
        password: data.password ?? "",
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
  // SAVE
  // =======================================================

  const handleSave = async () => {
    if (!id) return;

    try {
      setSaving(true);

      const response = await fetch(
        `/api/v1/admin/users/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to update user"
        );
      }

      await fetchUser();

      alert("User updated successfully");
    } catch (error) {
      console.error("UPDATE USER ERROR:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  };

  // =======================================================
  // COPY USER ID
  // =======================================================

  const copyUserId = async () => {
    if (!user?.id) return;

    await navigator.clipboard.writeText(String(user.id));

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
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

            <p className="mt-4 text-sm font-medium text-gray-600">
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
          onClick={() =>
            router.push("/dashboard/users")
          }
          className="group flex items-center gap-2 text-sm font-medium text-blue-600"
        >
          <ArrowLeft
            size={17}
            className="transition-transform group-hover:-translate-x-1"
          />

          Back to Users
        </button>

        <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-red-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <X className="text-red-500" size={24} />
          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            User not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "Unable to load this user."}
          </p>

          <button
            onClick={() =>
              router.push("/dashboard/users")
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  // =======================================================
  // AVATAR
  // =======================================================

  const initials =
    form.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("") || "U";

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900">

      {/* =================================================
          TOP HEADER
      ================================================= */}

      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-[1500px] px-6 md:px-10">

          {/* BREADCRUMB */}

          <div className="flex h-12 items-center gap-2 text-xs text-gray-400">

            <button
              onClick={() =>
                router.push("/dashboard/users")
              }
              className="hover:text-blue-600"
            >
              Users
            </button>

            <span>/</span>

            <span className="text-gray-600">
              {form.name || "User"}
            </span>

          </div>

          {/* MAIN HEADER */}

          <div className="flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              {/* AVATAR */}

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white shadow-sm shadow-blue-200">
                {initials}
              </div>

              {/* USER TITLE */}

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
                  Manage user account and profile information
                </p>

              </div>

            </div>

            {/* HEADER ACTIONS */}

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/users")
                }
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
              >
                <MoreHorizontal size={19} />
              </button>

            </div>

          </div>

        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="mx-auto max-w-[1500px] px-6 py-8 md:px-10">

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">

            {/* PROFILE CARD */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              {/* CARD HEADER */}

              <div className="border-b border-gray-100 px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <User
                      size={19}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Profile Information
                    </h2>

                    <p className="text-xs text-gray-500">
                      Basic information about this user
                    </p>
                  </div>

                </div>

              </div>

              {/* FORM */}

              <div className="p-6">

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                  {/* NAME */}

                  <FormField
                    label="Full Name"
                    icon={
                      <User size={16} />
                    }
                  >
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
                  </FormField>

                  {/* EMAIL */}

                  <FormField
                    label="Email Address"
                    icon={
                      <Mail size={16} />
                    }
                  >
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
                  </FormField>

                </div>

              </div>

            </section>

            {/* SECURITY CARD */}

            <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

              <div className="border-b border-gray-100 px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <ShieldCheck
                      size={19}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-semibold text-gray-900">
                      Security
                    </h2>

                    <p className="text-xs text-gray-500">
                      Manage account authentication details
                    </p>
                  </div>

                </div>

              </div>

              <div className="p-6">

                <FormField
                  label="Password"
                  icon={
                    <KeyRound size={16} />
                  }
                >
                  <div className="relative">

                    <input
                      type="text"
                      value={form.password}
                      onChange={(e) =>
                        handleChange(
                          "password",
                          e.target.value
                        )
                      }
                      placeholder="Enter password"
                      className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 pr-12 text-sm font-medium text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
                    />

                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <KeyRound size={17} />
                    </div>

                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Password value is loaded from the API.
                  </p>
                </FormField>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="space-y-6">

            {/* SAVE CARD */}

            <div className="sticky top-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-5">

                <h3 className="font-semibold text-gray-900">
                  Actions
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Save changes made to this user.
                </p>

              </div>

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
                    Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={17} />
                    Save Changes
                  </>
                )}
              </button>

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

            {/* ACCOUNT CARD */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <Edit3
                    size={17}
                    className="text-blue-600"
                  />
                </div>

                <h3 className="font-semibold text-gray-900">
                  Account Details
                </h3>

              </div>

              <div className="space-y-4">

                {/* ID */}

                <div>

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    User ID
                  </p>

                  <div className="mt-1.5 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5">

                    <span className="text-sm font-medium text-gray-700">
                      {user.id}
                    </span>

                    <button
                      type="button"
                      onClick={copyUserId}
                      className="text-gray-400 transition hover:text-blue-600"
                    >
                      {copied ? (
                        <Check
                          size={15}
                          className="text-emerald-500"
                        />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>

                  </div>

                </div>

                {/* EMAIL */}

                <div>

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Email
                  </p>

                  <p className="mt-1.5 break-all text-sm font-medium text-gray-700">
                    {user.email}
                  </p>

                </div>

                {/* STATUS */}

                <div>

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Status
                  </p>

                  <div className="mt-1.5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>
    </div>
  );
}

// =========================================================
// FORM FIELD
// =========================================================

function FormField({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>

      <div className="mb-2 flex items-center gap-1.5">

        {icon && (
          <span className="text-blue-600">
            {icon}
          </span>
        )}

        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>

      </div>

      {children}

    </div>
  );
}

