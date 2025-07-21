import CarpenterDashboard from "@/components/Dashboard/carpenter-dashboard";
// import DesignerDashboard from "@/components/Dashboard/Designer-dashboard";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <CarpenterDashboard />
        {/* <DesignerDashboard /> */}
      </SidebarLayout>
    </div>
  );
}
