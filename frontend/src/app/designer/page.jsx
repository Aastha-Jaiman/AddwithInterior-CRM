import SidebarLayout from '@/components/sidebar/Sidebar';
import AdminDashboard from '@/app/admin/AdminDashboard';
import DesignerDashboard from '@/app/designer/DesignerDashboard';


export default function AdminPage() {
  return (
    <SidebarLayout>
      <DesignerDashboard />
    </SidebarLayout>
  );
}
