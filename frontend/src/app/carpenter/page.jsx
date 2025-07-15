import SidebarLayout from '@/components/sidebar/Sidebar';
import CarpenterDashboard from '@/app/carpenter/CarpenterDashboard';


export default function AdminPage() {
  return (
    <SidebarLayout>
      <CarpenterDashboard />
    </SidebarLayout>
  );
}
