"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const items = [
  { href: "/admin", label: "Gösterge Paneli", icon: "fa-chart-pie", exact: true },
  { href: "/admin/services", label: "Hizmetler", icon: "fa-list" },
  { href: "/admin/projects", label: "Projeler", icon: "fa-briefcase" },
  { href: "/admin/gallery", label: "Galeri", icon: "fa-image" },
  { href: "/admin/posts", label: "Blog", icon: "fa-pen" },
  { href: "/admin/contacts", label: "Talepler", icon: "fa-inbox" },
];

const AdminSidebar = () => {
  const pathname = usePathname();
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
      {items.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`btn mb-2 text-start ${active ? "active" : ""}`}
          >
            <i className={`fas ${item.icon} me-2`} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
