"use client";

import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  title?: string;
  description?: string;
  search?: string;
  setSearch?: (value: string) => void;
}

export default function Header({
  title = "Dashboard",
  description = "Manage your admin dashboard",
  search = "",
  setSearch,
}: HeaderProps) {
  const router = useRouter();

  const [profileOpen, setProfileOpen] =
    useState(false);

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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">

      {/* TITLE */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          {title}
        </h2>

        <p className="text-sm text-gray-500">
          {description}
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* SEARCH */}
        {setSearch && (
          <div className="hidden items-center rounded-lg border bg-gray-50 px-3 md:flex">
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-40 bg-transparent px-2 py-2 text-sm outline-none"
            />
          </div>
        )}

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
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
              A
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-gray-800">
                Admin
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>

            <ChevronDown
              size={16}
              className="text-gray-500"
            />
          </button>

          {/* DROPDOWN */}
          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-48 rounded-lg border bg-white py-2 shadow-lg">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/profile"
                  )
                }
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
  );
}