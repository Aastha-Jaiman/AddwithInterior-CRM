import Dashboard from "@/components/Dashboard/Dashboard";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <SidebarLayout>
      <Dashboard />
    </SidebarLayout>
  );
}
