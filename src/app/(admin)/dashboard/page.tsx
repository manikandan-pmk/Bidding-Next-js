
"use client";

import {
  LayoutDashboard,
  Users,
  Gavel,
  DollarSign,
  Bell,
  Settings,
  LogOut,
  Menu,
  Search,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">
              Admin Panel
            </h1>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-gray-800"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 space-y-2 px-3">

          <a
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg bg-blue-600 px-3 py-3"
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </a>

          <a
            href="/dashboard/users"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-300 hover:bg-gray-800"
          >
            <Users size={20} />
            {sidebarOpen && <span>Users</span>}
          </a>

          <a
            href="/dashboard/auctions"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-300 hover:bg-gray-800"
          >
            <Gavel size={20} />
            {sidebarOpen && <span>Auctions</span>}
          </a>

          <a
            href="/dashboard/payments"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-300 hover:bg-gray-800"
          >
            <DollarSign size={20} />
            {sidebarOpen && <span>Payments</span>}
          </a>

          <a
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-gray-300 hover:bg-gray-800"
          >
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </a>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-5 w-full px-3">
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-400 hover:bg-gray-800">
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } min-h-screen flex-1 transition-all duration-300`}
      >

        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-6">

          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500">
              Welcome back, Admin
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* Search */}
            <div className="hidden items-center rounded-lg border bg-gray-50 px-3 md:flex">
              <Search size={18} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search..."
                className="w-40 bg-transparent px-2 py-2 text-sm outline-none"
              />
            </div>

            {/* Notification */}
            <button className="relative rounded-lg p-2 hover:bg-gray-100">
              <Bell size={21} />

              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                A
              </div>

              <div className="hidden sm:block">
                <p className="text-sm font-medium">
                  Admin
                </p>

                <p className="text-xs text-gray-500">
                  Administrator
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* Dashboard Content */}
        <section className="p-6">

          {/* Stats */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Users */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                  <Users size={22} />
                </div>

                <span className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp size={15} />
                  12.5%
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Total Users
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                1,248
              </h3>
            </div>

            {/* Auctions */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                  <Gavel size={22} />
                </div>

                <span className="text-sm text-green-600">
                  +8.2%
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Total Auctions
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                356
              </h3>
            </div>

            {/* Revenue */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-green-100 p-3 text-green-600">
                  <DollarSign size={22} />
                </div>

                <span className="text-sm text-green-600">
                  +15.4%
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Total Revenue
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                ₹2,48,500
              </h3>
            </div>

            {/* Active Bids */}
            <div className="rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-orange-100 p-3 text-orange-600">
                  <Clock size={22} />
                </div>

                <span className="text-sm text-green-600">
                  +6.8%
                </span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Active Bids
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                89
              </h3>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">

            {/* Recent Auctions */}
            <div className="rounded-xl bg-white p-6 shadow-sm lg:col-span-2">

              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Recent Auctions
                </h3>

                <button className="text-sm text-blue-600 hover:underline">
                  View All
                </button>
              </div>

              <div className="mt-5 overflow-x-auto">

                <table className="w-full text-left text-sm">

                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="pb-3">Auction</th>
                      <th className="pb-3">Seller</th>
                      <th className="pb-3">Bids</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    <tr className="border-b">
                      <td className="py-4 font-medium">
                        iPhone 15 Pro
                      </td>

                      <td className="py-4">
                        Mani
                      </td>

                      <td className="py-4">
                        24
                      </td>

                      <td className="py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Active
                        </span>
                      </td>
                    </tr>

                    <tr className="border-b">
                      <td className="py-4 font-medium">
                        MacBook Pro
                      </td>

                      <td className="py-4">
                        Kumar
                      </td>

                      <td className="py-4">
                        18
                      </td>

                      <td className="py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                          Active
                        </span>
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 font-medium">
                        Sony Camera
                      </td>

                      <td className="py-4">
                        Arun
                      </td>

                      <td className="py-4">
                        31
                      </td>

                      <td className="py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                          Completed
                        </span>
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

              <h3 className="text-lg font-semibold">
                Recent Activity
              </h3>

              <div className="mt-5 space-y-5">

                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 text-center pt-2 text-blue-600">
                    +
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      New user registered
                    </p>

                    <p className="text-xs text-gray-500">
                      5 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 text-center pt-2 text-green-600">
                    ₹
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      Payment received
                    </p>

                    <p className="text-xs text-gray-500">
                      20 minutes ago
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-full bg-purple-100 text-center pt-2 text-purple-600">
                    ⚡
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      New auction created
                    </p>

                    <p className="text-xs text-gray-500">
                      1 hour ago
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </section>
      </main>
    </div>
  );
}

