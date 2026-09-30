"use client";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Save,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================
  // HANDLE INPUT
  // =====================================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================
  // CREATE USER
  // =====================================
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Basic validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/v1/user/auth/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );

      const result = response.data;

      if (result?.error) {
        throw new Error(
          result?.message || "Failed to create user"
        );
      }

      setSuccess("User created successfully.");

      // Redirect after successful creation
      setTimeout(() => {
        router.push("/dashboard/users");
      }, 800);
    } catch (err: any) {
      console.error("CREATE USER ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create user";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-6">
      {/* =====================================
          PAGE HEADER
      ====================================== */}
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className="rounded-lg border border-gray-200 bg-white p-2.5 text-gray-600 transition hover:bg-gray-50"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Create New User
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add a new user to your application.
          </p>
        </div>
      </div>

      {/* =====================================
          FORM CARD
      ====================================== */}
      <div className="max-w-3xl rounded-xl border border-gray-200 bg-white">
        {/* CARD HEADER */}
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-800">
            User Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the user's basic account details.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">
            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm font-medium text-red-600">
                  {error}
                </p>
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-600">
                  {success}
                </p>
              </div>
            )}

            {/* NAME */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter user name"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                  disabled={loading}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
                <span className="ml-1 text-red-500">*</span>
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 text-xs text-gray-400">
                Password must be at least 6 characters.
              </p>
            </div>
          </div>

          {/* =====================================
              FORM FOOTER
          ====================================== */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={() => router.push("/dashboard/users")}
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#4945ff] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#3835d9] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}