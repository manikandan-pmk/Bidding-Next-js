"use client";

import { useState } from "react";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  return (
    <div className="min-h-screen bg-[#f6f6f9]">

      {/* SIDEBAR */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN */}
      <main
        className={`${
          sidebarOpen ? "ml-64" : "ml-20"
        } min-h-screen transition-all duration-300`}
      >

        {/* HEADER */}
        <Header />

        {/* PAGE CONTENT */}
        {children}

      </main>
    </div>
  );
}