import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";
import AdminDashboard from "../../components/Dashboard/AdminDashboard";
import DesignerDashboard from "@/components/Dashboard/Designer-dashboard";

export default function page() {
  return (
    <div>
      <SidebarLayout>
        {/* <AdminDashboard /> */}
        {/* <DesignerDashboard /> */}
      </SidebarLayout>
    </div>
  );
}
