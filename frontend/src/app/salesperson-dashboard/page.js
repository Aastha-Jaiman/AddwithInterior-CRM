import SalesPersonDashboard from "@/components/Dashboard/SalesPersonDashboard";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <SidebarLayout>
      <SalesPersonDashboard />
    </SidebarLayout>
  );
}
