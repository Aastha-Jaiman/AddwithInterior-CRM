import SidebarLayout from '@/components/sidebar/Sidebar';
import AdminDashboard from './AdminDashboard';



export default function AdminPage() {
  return (
    <SidebarLayout>
      <AdminDashboard />
    </SidebarLayout>
  );
}
