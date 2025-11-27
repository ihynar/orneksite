import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => (
  <div className="admin-shell d-flex min-vh-100">
    <AdminSidebar />
    <div className="flex-grow-1 p-4 bg-light">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
