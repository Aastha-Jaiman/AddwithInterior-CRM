import CarpenterDashboard from "@/components/Dashboard/carpenter-dashboard";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <CarpenterDashboard />
      </SidebarLayout>
    </div>
  );
}
