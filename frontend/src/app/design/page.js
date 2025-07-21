import DesignerPanel from "@/components/Design/DesignPanel";
import SidebarLayout from "@/components/sidebar/Sidebar";
import React from "react";

const page = () => {
  return (
    <SidebarLayout>
      <DesignerPanel />
    </SidebarLayout>
  );
};

export default page;
