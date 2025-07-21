import AdminDashboard from "@/components/Dashboard/AdminDashboard";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <AdminDashboard />
      </SidebarLayout>
    </div>
  );
}
