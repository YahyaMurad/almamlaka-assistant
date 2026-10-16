"use client";

import { useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import DocumentsPanel from "./DocumentsPanel";
import StatsPanel from "./StatsPanel";

export default function AdminShell() {
  const [activeTab, setActiveTab] = useState("documents");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AdminHeader />
      <div className="flex min-h-0 flex-1">
        <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />
        {activeTab === "documents" && <DocumentsPanel />}
        {activeTab === "stats" && <StatsPanel />}
      </div>
    </div>
  );
}
