"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateLuckyDrawPage() {
  const router = useRouter();

  // ==========================================
  // FORM DATA
  // ==========================================

  const [formData, setFormData] = useState({
    name: "",
    no_of_peoples: "",
    amount: "",
    duration_Value: "",
    duration_Unit: "WEEKLY",
    upi_Id: "",
    user_id: "",
  });

  // ==========================================
  // USERS
  // ==========================================

  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ==========================================
  // QR CODE
  // ==========================================

  const [qrCode, setQrCode] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState("");

  // ==========================================
  // STATUS
  // ==========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH USERS
  // ==========================================

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setError("");

        const response = await axios.get("/api/v1/admin/users", {
          withCredentials: true,
        });

        setUsers(response.data?.data || []);
      } catch (error: any) {
        console.error("Fetch users error:", error);

        setError(
          error?.response?.data?.message ||
            "Failed to fetch users"
        );
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ==========================================
  // HANDLE QR CODE
  // ==========================================

  const handleQrChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      setError("QR Code image must be less than 5MB.");
      return;
    }

    setError("");
    setQrCode(file);

    // Preview
    const previewUrl = URL.createObjectURL(file);
    setQrPreview(previewUrl);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ========================================
    // VALIDATION
    // ========================================

    if (!formData.user_id) {
      setError("Please select a user.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter lucky draw name.");
      return;
    }

    if (!formData.no_of_peoples) {
      setError("Please enter number of people.");
      return;
    }

    if (!formData.amount) {
      setError("Please enter amount.");
      return;
    }

    if (!formData.duration_Value) {
      setError("Please enter duration.");
      return;
    }

    if (!formData.upi_Id.trim()) {
      setError("Please enter UPI ID.");
      return;
    }

    if (!qrCode) {
      setError("Please upload QR Code.");
      return;
    }

    if (Number(formData.no_of_peoples) <= 0) {
      setError(
        "Number of people must be greater than 0."
      );
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    if (Number(formData.duration_Value) <= 0) {
      setError("Duration must be greater than 0.");
      return;
    }

    // ========================================
    // CREATE FORM DATA
    // ========================================

    try {
      setLoading(true);

      const body = new FormData();

      body.append(
        "name",
        formData.name.trim()
      );

      body.append(
        "no_of_peoples",
        String(Number(formData.no_of_peoples))
      );

      body.append(
        "amount",
        String(Number(formData.amount))
      );

      body.append(
        "duration_Value",
        String(Number(formData.duration_Value))
      );

      body.append(
        "duration_Unit",
        formData.duration_Unit
      );

      body.append(
        "upi_Id",
        formData.upi_Id.trim()
      );

      // ======================================
      // SELECTED USER
      // ======================================

      body.append(
        "user_id",
        formData.user_id
      );

      // ======================================
      // QR CODE
      // ======================================

      body.append(
        "qr_Code",
        qrCode
      );

      // ========================================
      // API REQUEST
      // ========================================

      const response = await axios.post(
        "/api/v1/admin/lucky-draw/create",
        body,
        {
          withCredentials: true,
        }
      );

      const result = response.data;

      if (!result?.data) {
        throw new Error(
          result?.message ||
            "Failed to create lucky draw."
        );
      }

      // ========================================
      // SUCCESS
      // ========================================

      setSuccess(
        "Lucky draw created successfully."
      );

      // Redirect
      setTimeout(() => {
        router.push("/dashboard/lucky-draw");
      }, 1000);
    } catch (err: any) {
      console.error(
        "Create lucky draw error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // COMMON INPUT CLASS
  // ==========================================

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900";

  const selectClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 p-6">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create Lucky Draw
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Create a new lucky draw for a user.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            router.push("/admin/lucky-draw")
          }
          className="rounded-lg border border-gray-300 bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-black"
        >
          ← Back
        </button>
      </div>

      {/* =====================================
          FORM CARD
      ====================================== */}

      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Card Header */}

        <div className="border-b border-gray-200 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Lucky Draw Details
          </h2>

          <p className="mt-1 text-sm text-gray-600">
            Enter the required information below.
          </p>
        </div>

        {/* ===================================
            FORM
        ==================================== */}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 p-6">

            {/* =================================
                ERROR
            ================================== */}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {/* =================================
                SUCCESS
            ================================== */}

            {success && (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {/* =================================
                SELECT USER
            ================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Select User
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <select
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                disabled={usersLoading}
                className={selectClass}
              >
                <option
                  value=""
                  className="text-gray-500"
                >
                  {usersLoading
                    ? "Loading users..."
                    : "Select a user"}
                </option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                    className="text-gray-900"
                  >
                    {user.name} - {user.email}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-xs text-gray-500">
                Select the user who will own this
                lucky draw.
              </p>
            </div>

            {/* =================================
                ROW 1
            ================================== */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Lucky Draw Name */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Lucky Draw Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter lucky draw name"
                  className={inputClass}
                />
              </div>

              {/* Number of People */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Number of People
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="number"
                  name="no_of_peoples"
                  value={formData.no_of_peoples}
                  onChange={handleChange}
                  min="1"
                  placeholder="Enter number of people"
                  className={inputClass}
                />
              </div>
            </div>

            {/* =================================
                ROW 2
            ================================== */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Amount */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  Amount
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-700">
                    ₹
                  </span>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="1"
                    placeholder="Enter amount"
                    className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-9 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* UPI ID */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-900">
                  UPI ID
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="upi_Id"
                  value={formData.upi_Id}
                  onChange={handleChange}
                  placeholder="example@upi"
                  className={inputClass}
                />
              </div>
            </div>

            {/* =================================
                DURATION
            ================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Duration
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <input
                  type="number"
                  name="duration_Value"
                  value={formData.duration_Value}
                  onChange={handleChange}
                  min="1"
                  placeholder="Duration value"
                  className={inputClass}
                />

                <select
                  name="duration_Unit"
                  value={formData.duration_Unit}
                  onChange={handleChange}
                  className={selectClass}
                >
                  <option
                    value="WEEKLY"
                    className="text-gray-900"
                  >
                    Weekly
                  </option>

                  <option
                    value="MONTHLY"
                    className="text-gray-900"
                  >
                    Monthly
                  </option>
                </select>
              </div>
            </div>

            {/* =================================
                QR CODE
            ================================== */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-900">
                Payment QR Code
                <span className="ml-1 text-red-500">
                  *
                </span>
              </label>

              <div className="flex flex-col gap-5 md:flex-row">

                {/* Upload */}

                <div className="flex-1">
                  <label
                    htmlFor="qr_Code"
                    className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-6 transition hover:border-gray-500 hover:bg-gray-100"
                  >
                    {/* Upload Icon */}

                    <svg
                      className="mb-3 h-10 w-10 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 015.828 0L20 17m-2-2l-1.586-1.586a2 2 0 00-2.828 0L10 17m-6 3h16a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z"
                      />
                    </svg>

                    <p className="text-sm font-semibold text-gray-900">
                      Click to upload QR Code
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      PNG, JPG or JPEG — Max 5MB
                    </p>

                    <input
                      id="qr_Code"
                      type="file"
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={handleQrChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* =================================
                    QR PREVIEW
                ================================== */}

                {qrPreview && (
                  <div className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white p-4 md:w-52">
                    <div className="text-center">

                      <img
                        src={qrPreview}
                        alt="QR Code Preview"
                        className="mx-auto h-40 w-40 rounded-lg object-contain"
                      />

                      <p className="mt-2 max-w-[180px] truncate text-xs font-medium text-gray-600">
                        {qrCode?.name}
                      </p>

                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===================================
              FOOTER
          ==================================== */}

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">

            {/* Cancel */}

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/lucky-draw"
                )
              }
              disabled={loading}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Create */}

            <button
              type="submit"
              disabled={
                loading || usersLoading
              }
              className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Lucky Draw"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}