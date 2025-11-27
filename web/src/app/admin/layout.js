"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({ children }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) return null;

  return (
    <div className="admin-shell d-flex min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1 p-4 bg-light">{children}</div>
    </div>
  );
}
