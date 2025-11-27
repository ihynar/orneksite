"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimda", label: "Hakkımızda" },
  { href: "/portfoy", label: "Çalışmalarımız" },
  { href: "/galeri", label: "Galeri" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

const SiteNavbar = () => {
  const pathname = usePathname();
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top py-3">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" href="/">
          <i className="fas fa-couch me-2" />
          PIRIL YIKAMA
        </Link>
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
            {navItems.map((item) => (
              <li className="nav-item" key={item.href}>
                <Link className={`nav-link ${pathname === item.href ? "active" : ""}`} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
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
};

export default SiteNavbar;
