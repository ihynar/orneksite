import { NavLink } from 'react-router-dom';

const SiteNavbar = () => (
  <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
    <div className="container">
      <NavLink className="navbar-brand fw-bold text-primary" to="/">
        <i className="fas fa-couch me-2" />
        PIRIL YIKAMA
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto align-items-center gap-1">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Anasayfa
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/hakkimda">
              Hakkımızda
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/portfoy">
              Çalışmalarımız
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/galeri">
              Galeri
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/blog">
              Blog
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/iletisim">
              İletişim
            </NavLink>
          </li>
          <li className="nav-item ms-2">
            <a href="tel:+905550000000" className="btn btn-cta">
              <i className="fas fa-phone-alt me-2" />
              Hemen Ara
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

export default SiteNavbar;
