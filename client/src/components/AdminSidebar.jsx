import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const { logout, admin } = useAuth();

  return (
    <div className="admin-sidebar d-flex flex-column p-3 border-end">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <div className="fw-bold">Pırıl Panel</div>
          <small className="text-muted">{admin?.email}</small>
        </div>
        <button className="btn btn-sm btn-outline-secondary" onClick={logout}>
          Çıkış
        </button>
      </div>
      <NavLink end to="/admin" className="btn btn-outline-primary mb-2 text-start">
        <i className="fas fa-chart-pie me-2" />
        Gösterge Paneli
      </NavLink>
      <NavLink to="/admin/services" className="btn btn-outline-primary mb-2 text-start">
        <i className="fas fa-list me-2" />
        Hizmetler
      </NavLink>
      <NavLink to="/admin/projects" className="btn btn-outline-primary mb-2 text-start">
        <i className="fas fa-briefcase me-2" />
        Projeler
      </NavLink>
      <NavLink to="/admin/gallery" className="btn btn-outline-primary mb-2 text-start">
        <i className="fas fa-image me-2" />
        Galeri
      </NavLink>
      <NavLink to="/admin/posts" className="btn btn-outline-primary mb-2 text-start">
        <i className="fas fa-pen me-2" />
        Blog
      </NavLink>
      <NavLink to="/admin/contacts" className="btn btn-outline-primary mb-2 text-start">
        <i className="fas fa-inbox me-2" />
        Talepler
      </NavLink>
    </div>
  );
};

export default AdminSidebar;
