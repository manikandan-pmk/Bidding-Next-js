"use client";

import {
  LayoutDashboard,
  Gavel,
  Ticket,
  Users,
  CreditCard,
  ChevronDown,
  ChevronRight,
  Menu,
  LogOut,
  User,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// =========================================================
// TYPES
// =========================================================

interface UserData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =========================================================
// PAGE
// =========================================================

export default function UsersPage() {
  const router = useRouter();

  // =======================================================
  // SIDEBAR
  // =======================================================

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [biddingOpen, setBiddingOpen] = useState(false);
  const [luckyDrawOpen, setLuckyDrawOpen] = useState(false);

  // =======================================================
  // PROFILE
  // =======================================================

  const [profileOpen, setProfileOpen] = useState(false);

  // =======================================================
  // USERS
  // =======================================================

  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =======================================================
  // SEARCH
  // =======================================================

  const [search, setSearch] = useState("");

  // =======================================================
  // SELECTED USERS
  // =======================================================

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  // =======================================================
  // DELETE MODAL
  // =======================================================

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deleteIds, setDeleteIds] = useState<number[]>([]);

  const [deleteLoading, setDeleteLoading] = useState(false);

  // =======================================================
  // FETCH USERS
  // =======================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("/api/v1/admin/users", {
        withCredentials: true,
      });

      const result = await response.data;

      if (result?.error) {
        throw new Error(result?.message || "Failed to fetch users");
      }

      let data: UserData[] = [];

      if (Array.isArray(result)) {
        data = result;
      } else if (Array.isArray(result?.data)) {
        data = result.data;
      } else if (Array.isArray(result?.users)) {
        data = result.users;
      }

      setUsers(data);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to fetch users",
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // INITIAL FETCH
  // =======================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =======================================================
  // SEARCH
  // =======================================================

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase().trim();

    if (!value) {
      return true;
    }

    return (
      user.name?.toLowerCase().includes(value) ||
      user.email?.toLowerCase().includes(value) ||
      user.phone?.toLowerCase().includes(value)
    );
  });

  // =======================================================
  // SELECT ALL
  // =======================================================

  const allSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selectedUsers.includes(user.id));

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedUsers((previous) =>
        previous.filter((id) => !filteredUsers.some((user) => user.id === id)),
      );
    } else {
      setSelectedUsers((previous) => {
        const ids = filteredUsers.map((user) => user.id);

        return Array.from(new Set([...previous, ...ids]));
      });
    }
  };

  // =======================================================
  // SELECT SINGLE USER
  // =======================================================

  const handleSelectUser = (id: number) => {
    setSelectedUsers((previous) =>
      previous.includes(id)
        ? previous.filter((userId) => userId !== id)
        : [...previous, id],
    );
  };

  // =======================================================
  // OPEN DELETE MODAL
  // =======================================================

  const openDeleteModal = (ids: number[]) => {
    if (ids.length === 0) {
      return;
    }

    setDeleteIds(ids);
    setDeleteModalOpen(true);
  };

  // =======================================================
  // CLOSE DELETE MODAL
  // =======================================================

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteModalOpen(false);
    setDeleteIds([]);
  };

  // =======================================================
  // CONFIRM DELETE
  // =======================================================

  const handleDelete = async () => {
    if (deleteIds.length === 0) {
      return;
    }

    try {
      setDeleteLoading(true);

      /*
       * Delete each selected user through API.
       *
       * Single selection:
       * DELETE /api/v1/admin/users/1
       *
       * Multiple selection:
       * DELETE /api/v1/admin/users/1
       * DELETE /api/v1/admin/users/2
       * DELETE /api/v1/admin/users/3
       */

      for (const id of deleteIds) {
        const response = await axios.post(`/api/v1/admin/users/${id}`);

        const result = await response.data();

        if (result?.error) {
          throw new Error(result?.message || "Failed to fetch users");
        }
      }

      // Remove deleted IDs from selection
      setSelectedUsers((previous) =>
        previous.filter((id) => !deleteIds.includes(id)),
      );

      // Close modal
      setDeleteModalOpen(false);
      setDeleteIds([]);

      // Reload users from API
      await fetchUsers();
    } catch (error) {
      console.error("DELETE USER ERROR:", error);

      alert(error instanceof Error ? error.message : "Failed to delete user");
    } finally {
      setDeleteLoading(false);
    }
  };

  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      router.push("/");
    }
  };

  // =======================================================
  // SIDEBAR STYLES
  // =======================================================

  const sidebarItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-300 transition hover:bg-gray-800";

  const childItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 pl-11 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white";

  // =======================================================
  // ROW CLICK
  // =======================================================

  const handleRowClick = (id: number) => {
    router.push(`/dashboard/users/${id}`);
  };

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="flex min-h-screen bg-[#f6f6f9]">
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300`}
      >
        {/* HEADER */}

        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-800"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* NAVIGATION */}

        <nav className="mt-6 space-y-2 px-3">
          {/* DASHBOARD */}

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className={`${sidebarItem} ${sidebarOpen ? "" : "justify-center"}`}
          >
            <LayoutDashboard size={20} />

            {sidebarOpen && <span>Dashboard</span>}
          </button>

          {/* USERS */}

          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className={`${sidebarItem} ${
              sidebarOpen ? "bg-gray-800 text-white" : "justify-center"
            }`}
          >
            <Users size={20} />

            {sidebarOpen && <span>Users</span>}
          </button>

          {/* BIDDING */}

          <div>
            <button
              type="button"
              onClick={() => setBiddingOpen(!biddingOpen)}
              className={`${sidebarItem} ${
                sidebarOpen ? "" : "justify-center"
              }`}
            >
              <Gavel size={20} />

              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">Bidding</span>

                  {biddingOpen ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </>
              )}
            </button>

            {sidebarOpen && biddingOpen && (
              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/bidding")}
                  className={childItem}
                >
                  <Gavel size={17} />
                  Biddings
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/bidding-round")}
                  className={childItem}
                >
                  <Ticket size={17} />
                  Bidding Round
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/bidding-user-payment")}
                  className={childItem}
                >
                  <CreditCard size={17} />
                  Bidding User Payment
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/bidding-participants")}
                  className={childItem}
                >
                  <Users size={17} />
                  Bidding Participants
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard/bidding-participant-payment")
                  }
                  className={childItem}
                >
                  <CreditCard size={17} />
                  Bidding Participant Payment
                </button>
              </div>
            )}
          </div>

          {/* LUCKY DRAW */}

          <div>
            <button
              type="button"
              onClick={() => setLuckyDrawOpen(!luckyDrawOpen)}
              className={`${sidebarItem} ${
                sidebarOpen ? "" : "justify-center"
              }`}
            >
              <Ticket size={20} />

              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">Lucky Draw</span>

                  {luckyDrawOpen ? (
                    <ChevronDown size={17} />
                  ) : (
                    <ChevronRight size={17} />
                  )}
                </>
              )}
            </button>

            {sidebarOpen && luckyDrawOpen && (
              <div className="mt-1 space-y-1">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard/lucky-draw")}
                  className={childItem}
                >
                  <Ticket size={17} />
                  Lucky Draw
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/lucky-draw-form")}
                  className={childItem}
                >
                  <Ticket size={17} />
                  Lucky Draw Form
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/dashboard/lucky-draw-winner")}
                  className={childItem}
                >
                  <Users size={17} />
                  Lucky Draw Winner
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/dashboard/lucky-draw-participant-payment")
                  }
                  className={childItem}
                >
                  <CreditCard size={17} />
                  Lucky Draw Participant Payment
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* LOGOUT */}

        <div className="absolute bottom-5 w-full px-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-400 hover:bg-gray-800"
          >
            <LogOut size={20} />

            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } min-h-screen flex-1 transition-all duration-300`}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">
          {/* LEFT */}

          <div>
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>

            <p className="text-sm text-gray-500">Manage your users</p>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-4">
            {/* SEARCH */}

            <div className="hidden items-center rounded-lg border bg-gray-50 px-3 md:flex">
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-40 bg-transparent px-2 py-2 text-sm outline-none"
              />
            </div>

            {/* NOTIFICATION */}

            <button
              type="button"
              className="relative rounded-lg p-2 hover:bg-gray-100"
            >
              <Bell size={21} />

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* PROFILE */}

            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-100"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                  A
                </div>

                <div className="hidden text-left sm:block">
                  <p className="text-sm font-medium text-gray-800">Admin</p>

                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                <ChevronDown size={16} className="text-gray-500" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white py-2 shadow-lg">
                  <button
                    type="button"
                    onClick={() => router.push("/dashboard/profile")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={17} />
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <section className="p-6">
          {/* PAGE TITLE */}

          <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Users</h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage and view all registered users.
              </p>
            </div>

            {/* CREATE */}

            <button
              type="button"
              onClick={() => router.push("/dashboard/users/create")}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#4945ff] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#3835d9]"
            >
              <Plus size={18} />
              Create new user
            </button>
          </div>

          {/* =================================================
              TABLE CARD
          ================================================= */}

          <div className="rounded-xl border border-gray-200 bg-white">
            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
              {/* SEARCH */}

              <div className="flex w-full items-center rounded-lg border border-gray-200 bg-white px-3 md:max-w-md">
                <Search size={18} className="text-gray-400" />

                <input
                  type="text"
                  placeholder="Search by name, email or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm outline-none"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* RIGHT */}

              <div className="flex items-center gap-2">
                {/* SELECTED COUNT */}

                {selectedUsers.length > 0 && (
                  <span className="rounded-lg bg-[#f0f0ff] px-3 py-2.5 text-sm font-medium text-[#4945ff]">
                    {selectedUsers.length} selected
                  </span>
                )}

                {/* DELETE */}

                <button
                  type="button"
                  disabled={selectedUsers.length === 0}
                  onClick={() => openDeleteModal(selectedUsers)}
                  className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>
            </div>

            {/* =================================================
                SELECTED BAR
            ================================================= */}

            {selectedUsers.length > 0 && (
              <div className="flex items-center justify-between border-b bg-[#f7f7ff] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#4945ff] text-white">
                    <Users size={15} />
                  </div>

                  <p className="text-sm font-medium text-gray-700">
                    {selectedUsers.length} user
                    {selectedUsers.length > 1 ? "s" : ""} selected
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUsers([])}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Clear selection
                </button>
              </div>
            )}

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                {/* TABLE HEADER */}

                <thead className="bg-[#fafafa]">
                  <tr className="border-b border-gray-200">
                    {/* SELECT ALL */}

                    <th className="w-14 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                        disabled={filteredUsers.length === 0}
                        className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#4945ff]"
                      />
                    </th>

                    {/* NAME */}

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </th>

                    {/* EMAIL */}

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Email
                    </th>

                    {/* PHONE */}

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone
                    </th>

                    {/* ROLE */}

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    {/* STATUS */}

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>

                    {/* UPDATED */}

                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Updated
                    </th>
                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>
                  {/* LOADING */}

                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#4945ff]" />

                          <p className="mt-4 text-sm text-gray-500">
                            Loading users...
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* ERROR */}

                  {!loading && error && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                          <X size={22} className="text-red-500" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-800">
                          Failed to load users
                        </h3>

                        <p className="mt-1 text-sm text-red-500">{error}</p>

                        <button
                          type="button"
                          onClick={fetchUsers}
                          className="mt-4 rounded-lg bg-[#4945ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#3835d9]"
                        >
                          Try again
                        </button>
                      </td>
                    </tr>
                  )}

                  {/* USERS */}

                  {!loading &&
                    !error &&
                    filteredUsers.map((user) => {
                      const isSelected = selectedUsers.includes(user.id);

                      return (
                        <tr
                          key={user.id}
                          className={`border-b border-gray-100 transition ${
                            isSelected ? "bg-[#f5f5ff]" : "hover:bg-[#fafaff]"
                          }`}
                        >
                          {/* CHECKBOX */}

                          <td
                            className="px-4 py-4"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleSelectUser(user.id)}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#4945ff]"
                            />
                          </td>

                          {/* NAME */}

                          <td
                            className="cursor-pointer px-4 py-4"
                            onClick={() => handleRowClick(user.id)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8e7ff] text-sm font-semibold text-[#4945ff]">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>

                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {user.name || "-"}
                                </p>

                                <p className="text-xs text-gray-400">
                                  ID: {user.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* EMAIL */}

                          <td
                            className="cursor-pointer px-4 py-4"
                            onClick={() => handleRowClick(user.id)}
                          >
                            <span className="text-sm text-gray-600">
                              {user.email || "-"}
                            </span>
                          </td>

                          {/* PHONE */}

                          <td
                            className="cursor-pointer px-4 py-4"
                            onClick={() => handleRowClick(user.id)}
                          >
                            <span className="text-sm text-gray-600">
                              {user.phone || "-"}
                            </span>
                          </td>

                          {/* ROLE */}

                          <td
                            className="cursor-pointer px-4 py-4"
                            onClick={() => handleRowClick(user.id)}
                          >
                            <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                              {user.role || "User"}
                            </span>
                          </td>

                          {/* STATUS */}

                          <td
                            className="cursor-pointer px-4 py-4"
                            onClick={() => handleRowClick(user.id)}
                          >
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  user.status === "Active"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }`}
                              />

                              {user.status || "Inactive"}
                            </span>
                          </td>

                          {/* UPDATED */}

                          <td
                            className="cursor-pointer px-4 py-4"
                            onClick={() => handleRowClick(user.id)}
                          >
                            <span className="text-sm text-gray-500">
                              {user.updatedAt
                                ? new Date(user.updatedAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    },
                                  )
                                : "-"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                  {/* EMPTY */}

                  {!loading && !error && filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                          <Users size={22} className="text-gray-400" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-800">
                          No users found
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {search
                            ? "Try changing your search."
                            : "No users are available."}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* =================================================
                PAGINATION
            ================================================= */}

            <div className="flex items-center justify-between border-t px-4 py-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-700">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {users.length}
                </span>{" "}
                users
              </p>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="rounded-lg border p-2 text-gray-300"
                >
                  <ChevronsLeft size={16} />
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-lg border p-2 text-gray-300"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  className="rounded-lg bg-[#4945ff] px-3 py-2 text-sm font-medium text-white"
                >
                  1
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-lg border p-2 text-gray-300"
                >
                  <ChevronRight size={16} />
                </button>

                <button
                  type="button"
                  disabled
                  className="rounded-lg border p-2 text-gray-300"
                >
                  <ChevronsRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            {/* HEADER */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Delete user
                {deleteIds.length > 1 ? "s" : ""}
              </h2>

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* CONTENT */}

            <div className="px-6 py-6">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <Trash2 size={22} className="text-red-600" />
              </div>

              <h3 className="mt-4 text-center text-base font-semibold text-gray-800">
                {deleteIds.length === 1
                  ? "Delete this user?"
                  : `Delete ${deleteIds.length} users?`}
              </h3>

              <p className="mt-2 text-center text-sm leading-6 text-gray-500">
                {deleteIds.length === 1
                  ? "Are you sure you want to delete this user?"
                  : `Are you sure you want to delete these ${deleteIds.length} users?`}
                <br />
                This action cannot be undone.
              </p>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
                className="flex min-w-[90px] items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
