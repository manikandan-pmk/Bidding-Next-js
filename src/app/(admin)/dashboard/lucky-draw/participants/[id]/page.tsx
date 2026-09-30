"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  ShieldCheck,
  Trophy,
  Save,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  age?: number;
  email?: string;
  gender?: string;
  phone_Number?: string;
  photo?: string;
  id_Proof?: string;
  is_Verified: boolean;
  is_Winned_Participant: boolean;
  is_Winned_Time?: string | null;

  draw?: {
    id: string;
    name: string;
  };
}

export default function ParticipantDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const participantId = params.id as string;

  const [participant, setParticipant] =
    useState<Participant | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    email: "",
    phone_Number: "",
    is_Verified: false,
  });

  useEffect(() => {
    if (participantId) {
      fetchParticipant();
    }
  }, [participantId]);

  const fetchParticipant = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `/api/v1/admin/lucky-draw/participants/${participantId}`,
        {
          withCredentials: true,
        }
      );

      const data = response.data?.data || response.data;

      setParticipant(data);

      setForm({
        name: data.name || "",
        age:
          data.age !== undefined && data.age !== null
            ? String(data.age)
            : "",
        gender: data.gender || "",
        email: data.email || "",
        phone_Number: data.phone_Number || "",
        is_Verified: Boolean(data.is_Verified),
      });
    } catch (error) {
      console.error("Fetch participant error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    field: keyof typeof form,
    value: string | boolean
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await axios.patch(
        `/api/lucky-draw/participants/${participantId}`,
        {
          name: form.name,
          age: form.age ? Number(form.age) : null,
          gender: form.gender,
          email: form.email,
          phone_Number: form.phone_Number,
          is_Verified: form.is_Verified,
        },
        {
          withCredentials: true,
        }
      );

      const data = response.data?.data || response.data;

      setParticipant((previous) => ({
        ...previous!,
        ...data,
        name: form.name,
        age: form.age ? Number(form.age) : undefined,
        gender: form.gender,
        email: form.email,
        phone_Number: form.phone_Number,
        is_Verified: form.is_Verified,
      }));

      alert("Participant updated successfully");
    } catch (error) {
      console.error("Update participant error:", error);

      if (axios.isAxiosError(error)) {
        alert(
          error.response?.data?.message ||
            "Failed to update participant"
        );
      } else {
        alert("Failed to update participant");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7fa]">
        <main className="p-6">
          <div className="flex min-h-[500px] items-center justify-center">
            <p className="text-sm text-[#64748b]">
              Loading participant...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!participant) {
    return (
      <div className="min-h-screen bg-[#f7f7fa]">
        <main className="p-6">
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-[#111827]">
              Participant not found
            </h2>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/lucky-draw/participants"
                )
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
            >
              <ArrowLeft size={16} />
              Back to Participants
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa]">
      <main>
        {/* Breadcrumb */}
        <div className="border-b border-[#e5e7eb] bg-white px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button
              onClick={() =>
                router.push(
                  "/dashboard/lucky-draw/participants"
                )
              }
              className="text-[#64748b] hover:text-[#2563eb]"
            >
              Participants
            </button>

            <span className="text-[#94a3b8]">/</span>

            <span className="text-[#334155]">
              {participant.name}
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="border-b border-[#e5e7eb] bg-white px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Profile Image */}
              {participant.photo ? (
                <img
                  src={participant.photo}
                  alt={participant.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#4f46e5] text-xl font-semibold text-white">
                  {participant.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[24px] font-semibold text-[#111827]">
                    {participant.name}
                  </h1>

                  {participant.is_Verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      Pending
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-[#64748b]">
                  View and manage participant information
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                router.push(
                  "/dashboard/lucky-draw/participants"
                )
              }
              className="flex h-[42px] items-center gap-2 rounded-lg border border-[#d1d5db] bg-white px-4 text-sm font-medium text-[#334155] hover:bg-[#f8fafc]"
            >
              <ArrowLeft size={16} />
              Back to Participants
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-6 p-6 xl:grid-cols-[1fr_320px]">
          {/* Participant Information */}
          <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
            {/* Card Header */}
            <div className="border-b border-[#e5e7eb] px-6 py-5">
              <h2 className="text-[18px] font-semibold text-[#111827]">
                Participant Information
              </h2>

              <p className="mt-1 text-sm text-[#64748b]">
                Edit the participant information below.
              </p>
            </div>

            {/* Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#334155]">
                    <User
                      size={16}
                      className="text-[#4f46e5]"
                    />
                    Participant Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      handleChange("name", e.target.value)
                    }
                    className="h-[46px] w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>

                {/* Participant ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#334155]">
                    Participant ID
                  </label>

                  <input
                    type="text"
                    value={participant.id}
                    disabled
                    className="h-[46px] w-full rounded-lg border border-[#dfe3eb] bg-[#f1f3f6] px-4 text-sm text-[#64748b]"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#334155]">
                    <Calendar
                      size={16}
                      className="text-[#4f46e5]"
                    />
                    Age
                  </label>

                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) =>
                      handleChange("age", e.target.value)
                    }
                    className="h-[46px] w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#334155]">
                    Gender
                  </label>

                  <select
                    value={form.gender}
                    onChange={(e) =>
                      handleChange("gender", e.target.value)
                    }
                    className="h-[46px] w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  >
                    <option value="">
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#334155]">
                    <Mail
                      size={16}
                      className="text-[#4f46e5]"
                    />
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      handleChange("email", e.target.value)
                    }
                    className="h-[46px] w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#334155]">
                    <Phone
                      size={16}
                      className="text-[#4f46e5]"
                    />
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={form.phone_Number}
                    onChange={(e) =>
                      handleChange(
                        "phone_Number",
                        e.target.value
                      )
                    }
                    className="h-[46px] w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-sm text-[#111827] outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
              <div className="border-b border-[#e5e7eb] px-5 py-5">
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Actions
                </h2>

                <p className="mt-1 text-sm text-[#64748b]">
                  Save changes made to this participant.
                </p>
              </div>

              <div className="space-y-3 p-5">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-4 text-sm font-semibold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={16} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

                <button
                  onClick={() => router.back()}
                  className="h-[44px] w-full rounded-lg border border-[#d1d5db] bg-white px-4 text-sm font-medium text-[#334155] hover:bg-[#f8fafc]"
                >
                  Cancel
                </button>

                <button
                  onClick={() =>
                    router.push(
                      "/dashboard/lucky-draw/participants"
                    )
                  }
                  className="flex h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#e2e8f0] text-sm font-medium text-[#475569] hover:bg-[#f8fafc]"
                >
                  <ArrowLeft size={16} />
                  Back to Participants
                </button>
              </div>
            </div>

            {/* Lucky Draw Information */}
            <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
              <div className="border-b border-[#e5e7eb] px-5 py-5">
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Lucky Draw
                </h2>
              </div>

              <div className="space-y-4 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
                    Draw Name
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#334155]">
                    {participant.draw?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#94a3b8]">
                    Draw ID
                  </p>

                  <p className="mt-1 break-all text-sm text-[#64748b]">
                    {participant.draw?.id || "-"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
              <div className="border-b border-[#e5e7eb] px-5 py-5">
                <h2 className="text-[18px] font-semibold text-[#111827]">
                  Status
                </h2>
              </div>

              <div className="space-y-4 p-5">
                {/* Verification */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                      <ShieldCheck
                        size={18}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#334155]">
                        Verification
                      </p>

                      <p className="text-xs text-[#94a3b8]">
                        Participant verification
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      form.is_Verified
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {form.is_Verified
                      ? "Verified"
                      : "Pending"}
                  </span>
                </div>

                {/* Winner */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-50">
                      <Trophy
                        size={18}
                        className="text-yellow-600"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-[#334155]">
                        Winner
                      </p>

                      <p className="text-xs text-[#94a3b8]">
                        Lucky draw result
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-medium ${
                      participant.is_Winned_Participant
                        ? "text-yellow-600"
                        : "text-[#94a3b8]"
                    }`}
                  >
                    {participant.is_Winned_Participant
                      ? "Winner"
                      : "Not Winner"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}