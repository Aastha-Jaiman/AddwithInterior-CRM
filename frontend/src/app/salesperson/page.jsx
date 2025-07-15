import SidebarLayout from '@/components/sidebar/Sidebar';
import AdminDashboard from '@/app/admin/AdminDashboard';
import SalesPersonDashboard from '@/app/salesperson/SalesPersonDashboard';


export default function AdminPage() {
  return (
    <SidebarLayout>
      <SalesPersonDashboard />
    </SidebarLayout>
  );
}
