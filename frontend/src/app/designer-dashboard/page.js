import DesignerDashboard from "@/components/Dashboard/Designer-dashboard";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <DesignerDashboard />
      </SidebarLayout>
    </div>
  );
}
