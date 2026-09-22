"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AdminAuthPage() {
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const endpoint = isRegister
        ? "/api/v1/admin/auth/register"
        : "/api/v1/admin/auth/login";

      const body = isRegister
        ? {
            name,
            email,
            password,
          }
        : {
            email,
            password,
          };

      const res = await axios.post(endpoint, body);

      const data = res.data;

      console.log(data);

      // Success
      if (data.error) {
        throw new Error(data.message || data.error || "Something went wrong");
      }

      // REGISTER SUCCESS
      if (isRegister) {
        setSuccess("Registration successful. Please sign in.");

        // Clear register fields
        setName("");
        setEmail("");
        setPassword("");

        // Switch to login
        setIsRegister(false);

        return;
      }

      // LOGIN SUCCESS
      router.push("/dashboard");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsRegister(!isRegister);

    setError("");
    setSuccess("");

    setName("");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-blue-400 rounded-3xl p-8 shadow-2xl shadow-blue-500/25 border border-blue-500">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 border border-white/25 text-white font-bold text-xl mb-3 shadow-sm">
            A
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? "Create Account" : "Admin Portal"}
          </h1>

          <p className="text-sm text-blue-100 mt-1">
            {isRegister
              ? "Create your admin account"
              : "Sign in to manage api.domain.com"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-500/20 border border-red-200/40 text-white text-sm text-center">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 p-3 rounded-xl bg-green-500/20 border border-green-200/40 text-white text-sm text-center">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name - Register only */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-3 rounded-xl bg-white border border-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white transition shadow-sm"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@domain.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white transition shadow-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-blue-100 uppercase tracking-wider mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white border border-transparent text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white transition shadow-sm"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold shadow-lg shadow-black/20 disabled:opacity-50 transition"
          >
            {loading
              ? isRegister
                ? "Creating Account..."
                : "Verifying..."
              : isRegister
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        {/* Switch Login/Register */}
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-100">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
          </p>

          <button
            type="button"
            onClick={switchMode}
            className="mt-1 text-white font-semibold hover:underline"
          >
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}
