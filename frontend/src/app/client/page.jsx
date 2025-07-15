import SidebarLayout from '@/components/sidebar/Sidebar';
import AdminDashboard from '@/app/admin/AdminDashboard';
import ClientDashboard from '@/app/client/ClientDashboard';


export default function AdminPage() {
  return (
    <SidebarLayout>
      <ClientDashboard />
    </SidebarLayout>
  );
}
