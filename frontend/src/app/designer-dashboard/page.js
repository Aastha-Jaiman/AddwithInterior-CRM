import Designerdashboard from "@/components/Dashboard/Designer-dashboard";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

export default function page() {
  return (
    <div>
      <SidebarLayout>
        <Designerdashboard />
      </SidebarLayout>
    </div>
  );
}
