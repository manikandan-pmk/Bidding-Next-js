"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Phone,
  Mail,
  Calendar,
  User,
} from "lucide-react";

interface Participant {
  id: string;
  name?: string;
  age?: number;
  gender?: string;
  email?: string;
  phone_Number?: string;
  photo?: string;
  is_Verified?: boolean;
}

interface LuckyDraw {
  id: string;
  name?: string;
  amount?: number;
  no_of_peoples?: number;
  duration_Value?: number;
  duration_Unit?: string;
}

interface Winner {
  Cycle: string;
  won_At: string | null;
  draw?: LuckyDraw | null;
  participant?: Participant | null;
}

export default function WinnerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const participantId = params.id as string;

  const [winner, setWinner] = useState<Winner | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (participantId) {
      fetchWinner();
    }
  }, [participantId]);

  const fetchWinner = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `/api/v1/admin/lucky-draw/winners/${participantId}`,
        {
          withCredentials: true,
        }
      );

      setWinner(response.data?.data || null);
    } catch (error) {
      console.error("Fetch winner error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f7fa] p-6">
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-10 text-center">
          <p className="text-sm text-[#64748b]">
            Loading winner...
          </p>
        </div>
      </div>
    );
  }

  if (!winner || !winner.participant) {
    return (
      <div className="min-h-screen bg-[#f7f7fa] p-6">
        <div className="rounded-xl border border-[#e5e7eb] bg-white p-10 text-center">
          <Trophy
            size={40}
            className="mx-auto text-yellow-500"
          />

          <h2 className="mt-4 text-lg font-semibold text-[#111827]">
            Winner not found
          </h2>

          <button
            onClick={() =>
              router.push("/dashboard/lucky-draw/winners")
            }
            className="mt-5 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white"
          >
            Back to Winners
          </button>
        </div>
      </div>
    );
  }

  const participant = winner.participant;
  const draw = winner.draw;

  return (
    <div className="min-h-screen bg-[#f7f7fa] p-6">

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#e2e8f0] bg-white text-[#64748b] hover:bg-[#f8fafc]"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-[24px] font-semibold text-[#111827]">
            Winner Details
          </h1>

          <p className="mt-1 text-sm text-[#64748b]">
            View lucky draw winner information.
          </p>
        </div>
      </div>

      {/* Winner Card */}
      <div className="rounded-xl border border-[#e5e7eb] bg-white">

        {/* Top Section */}
        <div className="border-b border-[#e5e7eb] p-6">
          <div className="flex items-center gap-5">

            {participant.photo ? (
              <img
                src={participant.photo}
                alt={participant.name || "Winner"}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#fff7d6] text-2xl font-semibold text-[#d99a00]">
                {participant.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-[#111827]">
                  {participant.name || "-"}
                </h2>

                <Trophy
                  size={18}
                  className="text-yellow-500"
                />
              </div>

              <p className="mt-1 text-sm text-[#94a3b8]">
                Participant ID: {participant.id}
              </p>

              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-600">
                <Trophy size={13} />
                Winner
              </span>
            </div>

          </div>
        </div>

        {/* Participant Information */}
        <div className="p-6">

          <h3 className="mb-4 text-base font-semibold text-[#111827]">
            Participant Information
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

            {/* Name */}
            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Name
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-[#334155]">
                <User size={15} />
                {participant.name || "-"}
              </div>
            </div>

            {/* Email */}
            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Email
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-[#334155]">
                <Mail size={15} />
                {participant.email || "-"}
              </div>
            </div>

            {/* Phone */}
            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Phone
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-[#334155]">
                <Phone size={15} />
                {participant.phone_Number || "-"}
              </div>
            </div>

            {/* Age */}
            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Age
              </p>

              <p className="mt-1 text-sm text-[#334155]">
                {participant.age ?? "-"}
              </p>
            </div>

            {/* Gender */}
            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Gender
              </p>

              <p className="mt-1 text-sm text-[#334155]">
                {participant.gender || "-"}
              </p>
            </div>

            {/* Verification */}
            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Verification
              </p>

              <span
                className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  participant.is_Verified
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {participant.is_Verified
                  ? "Verified"
                  : "Not Verified"}
              </span>
            </div>

          </div>
        </div>

        {/* Lucky Draw Information */}
        <div className="border-t border-[#e5e7eb] p-6">

          <h3 className="mb-4 text-base font-semibold text-[#111827]">
            Lucky Draw Information
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Lucky Draw
              </p>

              <p className="mt-1 text-sm font-medium text-[#4f46e5]">
                {draw?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Cycle
              </p>

              <p className="mt-1 text-sm text-[#334155]">
                {winner.Cycle || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Won At
              </p>

              <div className="mt-1 flex items-center gap-2 text-sm text-[#334155]">
                <Calendar size={15} />
                {formatDate(winner.won_At)}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-[#94a3b8]">
                Amount
              </p>

              <p className="mt-1 text-sm font-medium text-[#334155]">
                {draw?.amount !== undefined
                  ? `₹${draw.amount}`
                  : "-"}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}