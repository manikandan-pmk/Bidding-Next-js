"use client";

import {
  ArrowLeft,
  CalendarDays,
  Clock,
  IndianRupee,
  Save,
  Ticket,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface LuckyDraw {
  id: string;
  name?: string;
  no_of_peoples?: number;
  amount?: number | string;
  duration_Value?: number | string;
  duration_Unit?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  name: string;
  no_of_peoples: string;
  amount: string;
  duration_Value: string;
  duration_Unit: string;
}

export default function LuckyDrawDetailsPage() {
  const router = useRouter();
  const params = useParams();

  const id = params?.id as string;

  const [draw, setDraw] = useState<LuckyDraw | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    no_of_peoples: "",
    amount: "",
    duration_Value: "",
    duration_Unit: "MONTHLY",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH DRAW DETAILS
  // ==========================================
  const fetchLuckyDraw = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!id) {
        throw new Error("Lucky draw ID not found");
      }

      const response = await axios.get(
        `/api/v1/admin/lucky-draw/${id}`,
        {
          withCredentials: true,
        }
      );

      const result = response.data;

      if (result?.error) {
        throw new Error(
          result?.message || "Failed to fetch lucky draw"
        );
      }

      const data: LuckyDraw = result?.data;

      if (!data) {
        throw new Error("Lucky draw details not found");
      }

      setDraw(data);

      // ==========================================
      // SET FORM VALUES
      // ==========================================
      setFormData({
        name: data.name || "",
        no_of_peoples:
          data.no_of_peoples !== undefined
            ? String(data.no_of_peoples)
            : "",
        amount:
          data.amount !== undefined
            ? String(data.amount)
            : "",
        duration_Value:
          data.duration_Value !== undefined
            ? String(data.duration_Value)
            : "",
        duration_Unit:
          data.duration_Unit || "MONTHLY",
      });
    } catch (err: any) {
      console.error("FETCH DRAW ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to fetch lucky draw"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL FETCH
  // ==========================================
  useEffect(() => {
    if (id) {
      fetchLuckyDraw();
    }
  }, [id]);

  // ==========================================
  // INPUT CHANGE
  // ==========================================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  // ==========================================
  // SAVE CHANGES
  // ==========================================
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      if (!formData.name.trim()) {
        setError("Lucky draw name is required");
        return;
      }

      if (!formData.no_of_peoples) {
        setError("Number of people is required");
        return;
      }

      if (!formData.amount) {
        setError("Amount is required");
        return;
      }

      if (!formData.duration_Value) {
        setError("Duration value is required");
        return;
      }

      const payload = {
        name: formData.name.trim(),
        no_of_peoples: Number(formData.no_of_peoples),
        amount: Number(formData.amount),
        duration_Value: Number(formData.duration_Value),
        duration_Unit: formData.duration_Unit,
      };

      const response = await axios.patch(
        `/api/v1/admin/lucky-draw/${id}`,
        payload,
        {
          withCredentials: true,
        }
      );

      const result = response.data;

      if (result?.error) {
        throw new Error(
          result?.message || "Failed to update lucky draw"
        );
      }

      setSuccess(
        result?.message ||
          "Lucky draw updated successfully"
      );

      // Refresh latest data
      await fetchLuckyDraw();
    } catch (err: any) {
      console.error("UPDATE DRAW ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to update lucky draw"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CANCEL
  // ==========================================
  const handleCancel = () => {
    if (!draw) return;

    setFormData({
      name: draw.name || "",
      no_of_peoples:
        draw.no_of_peoples !== undefined
          ? String(draw.no_of_peoples)
          : "",
      amount:
        draw.amount !== undefined
          ? String(draw.amount)
          : "",
      duration_Value:
        draw.duration_Value !== undefined
          ? String(draw.duration_Value)
          : "",
      duration_Unit:
        draw.duration_Unit || "MONTHLY",
    });

    setError("");
    setSuccess("");
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDateTime = (date?: string) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "-";
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <section className="min-h-screen bg-[#f7f9fc] p-6">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#4945ff]" />

            <p className="mt-4 text-sm text-gray-500">
              Loading lucky draw...
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ERROR / NOT FOUND
  // ==========================================
  if (!draw) {
    return (
      <section className="min-h-screen bg-[#f7f9fc] p-6">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Lucky draw not found
            </h2>

            <p className="mt-2 text-sm text-red-500">
              {error || "Unable to fetch lucky draw details"}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/lucky-draw")
              }
              className="mt-5 rounded-lg bg-[#4945ff] px-5 py-2.5 text-sm font-medium text-white"
            >
              Back to Lucky Draws
            </button>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <section className="min-h-screen bg-[#f7f9fc]">
      {/* ======================================
          BREADCRUMB
      ====================================== */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm">
            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/lucky-draw")
              }
              className="text-gray-500 hover:text-[#4945ff]"
            >
              Lucky Draws
            </button>

            <span className="text-gray-400">/</span>

            <span className="text-gray-700">
              {draw.name || `Lucky Draw #${draw.id}`}
            </span>
          </div>
        </div>
      </div>

      {/* ======================================
          PAGE HEADER
      ====================================== */}
      <div className="border-b border-gray-200 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4945ff] text-white">
              <Ticket size={27} />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {draw.name || "Lucky Draw"}
                </h1>

                <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-500">
                View and manage lucky draw information
              </p>
            </div>
          </div>

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() =>
              router.push("/dashboard/lucky-draw")
            }
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
            Back to Lucky Draws
          </button>
        </div>
      </div>

      {/* ======================================
          CONTENT
      ====================================== */}
      <div className="mx-auto max-w-7xl p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* ==================================
              LEFT SIDE - FORM
          ================================== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* HEADER */}
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Lucky Draw Information
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Edit the lucky draw information below.
              </p>
            </div>

            {/* FORM */}
            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              {/* NAME */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Ticket
                    size={16}
                    className="text-[#4945ff]"
                  />
                  Lucky Draw Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter lucky draw name"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                />
              </div>

              {/* ID - READ ONLY */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Lucky Draw ID
                </label>

                <input
                  type="text"
                  value={draw.id}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </div>

              {/* PEOPLE */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Users
                    size={16}
                    className="text-[#4945ff]"
                  />
                  Number of People
                </label>

                <input
                  type="number"
                  name="no_of_peoples"
                  value={formData.no_of_peoples}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter number of people"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                />
              </div>

              {/* AMOUNT */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <IndianRupee
                    size={16}
                    className="text-[#4945ff]"
                  />
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  placeholder="Enter amount"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                />
              </div>

              {/* DURATION VALUE */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Clock
                    size={16}
                    className="text-[#4945ff]"
                  />
                  Duration Value
                </label>

                <input
                  type="number"
                  name="duration_Value"
                  value={formData.duration_Value}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter duration"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                />
              </div>

              {/* DURATION UNIT */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Duration Unit
                </label>

                <select
                  name="duration_Unit"
                  value={formData.duration_Unit}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#4945ff] focus:ring-2 focus:ring-[#4945ff]/10"
                >
                  <option value="WEEKLY">
                    Weekly
                  </option>

                  <option value="MONTHLY">
                    Monthly
                  </option>
                </select>
              </div>

              {/* CREATED AT */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CalendarDays
                    size={16}
                    className="text-[#4945ff]"
                  />
                  Created At
                </label>

                <input
                  type="text"
                  value={formatDateTime(draw.createdAt)}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </div>

              {/* UPDATED AT */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CalendarDays
                    size={16}
                    className="text-[#4945ff]"
                  />
                  Last Updated
                </label>

                <input
                  type="text"
                  value={formatDateTime(draw.updatedAt)}
                  readOnly
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* ==================================
              RIGHT SIDE - ACTIONS
          ================================== */}
          <div className="h-fit rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Save changes made to this lucky draw.
              </p>

              {/* ERROR */}
              {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* SAVE */}
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2166f3] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1557dc] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={17} />

                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

              {/* CANCEL */}
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="mt-3 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              {/* BACK */}
              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/lucky-draw")
                }
                disabled={saving}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                <ArrowLeft size={16} />
                Back to Lucky Draws
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}