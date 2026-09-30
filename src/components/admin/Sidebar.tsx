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
} from "lucide-react";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [biddingOpen, setBiddingOpen] = useState(
    pathname.startsWith("/dashboard/bidding")
  );

  const [luckyDrawOpen, setLuckyDrawOpen] = useState(
    pathname.startsWith("/dashboard/lucky-draw")
  );

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

  const sidebarItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-3 text-gray-300 transition hover:bg-gray-800";

  const childItem =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 pl-11 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white";

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } fixed left-0 top-0 z-40 h-screen bg-gray-900 text-white transition-all duration-300`}
    >
      {/* LOGO / TOGGLE */}
      <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
        {sidebarOpen && (
          <h1 className="text-xl font-bold">
            Admin Panel
          </h1>
        )}

        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-gray-800"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* MENU */}
      <nav className="mt-6 space-y-2 px-3">

        {/* DASHBOARD */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className={`${sidebarItem} ${
            sidebarOpen ? "" : "justify-center"
          } ${
            pathname === "/dashboard"
              ? "bg-gray-800 text-white"
              : ""
          }`}
        >
          <LayoutDashboard size={20} />

          {sidebarOpen && (
            <span>Dashboard</span>
          )}
        </button>

        {/* USERS */}
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className={`${sidebarItem} ${
            sidebarOpen ? "" : "justify-center"
          } ${
            pathname.startsWith("/dashboard/users")
              ? "bg-gray-800 text-white"
              : ""
          }`}
        >
          <Users size={20} />

          {sidebarOpen && (
            <span>Users</span>
          )}
        </button>

        {/* BIDDING */}
        <div>
          <button
            type="button"
            onClick={() => setBiddingOpen(!biddingOpen)}
            className={`${sidebarItem} ${
              sidebarOpen ? "" : "justify-center"
            } ${
              pathname.startsWith("/dashboard/bidding")
                ? "bg-gray-800 text-white"
                : ""
            }`}
          >
            <Gavel size={20} />

            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">
                  Bidding
                </span>

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
                onClick={() =>
                  router.push("/dashboard/bidding")
                }
                className={`${childItem} ${
                  pathname === "/dashboard/bidding"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
              >
                <Gavel size={17} />
                Biddings
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push("/dashboard/bidding-round")
                }
                className={`${childItem} ${
                  pathname === "/dashboard/bidding-round"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
              >
                <Ticket size={17} />
                Bidding Round
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/bidding-user-payment"
                  )
                }
                className={`${childItem} ${
                  pathname ===
                  "/dashboard/bidding-user-payment"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
              >
                <CreditCard size={17} />
                Bidding User Payment
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/bidding-participants"
                  )
                }
                className={`${childItem} ${
                  pathname ===
                  "/dashboard/bidding-participants"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
              >
                <Users size={17} />
                Bidding Participants
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/bidding-participant-payment"
                  )
                }
                className={`${childItem} ${
                  pathname ===
                  "/dashboard/bidding-participant-payment"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
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
            onClick={() =>
              setLuckyDrawOpen(!luckyDrawOpen)
            }
            className={`${sidebarItem} ${
              sidebarOpen
                ? "bg-gray-800 text-white"
                : "justify-center"
            }`}
          >
            <Ticket size={20} />

            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">
                  Lucky Draw
                </span>

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
                onClick={() =>
                  router.push(
                    "/dashboard/lucky-draw"
                  )
                }
                className={`${childItem} ${
                  pathname ===
                  "/dashboard/lucky-draw"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
              >
                <Ticket size={17} />
                Lucky Draw
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/lucky-draw/participants"
                  )
                }
                className={`${childItem} ${
                  pathname ===
                  "/dashboard/lucky-draw/participants"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
              >
                <Ticket size={17} />
                Draw Participants
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/lucky-draw-winner"
                  )
                }
                className={`${childItem} ${
                  pathname ===
                  "/dashboard/lucky-draw-winner"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
              >
                <Users size={17} />
                Lucky Draw Winner
              </button>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/dashboard/lucky-draw-participant-payment"
                  )
                }
                className={`${childItem} ${
                  pathname ===
                  "/dashboard/lucky-draw-participant-payment"
                    ? "bg-gray-800 text-white"
                    : ""
                }`}
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

          {sidebarOpen && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}