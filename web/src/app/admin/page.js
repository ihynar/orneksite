"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/metrics")
      .then(({ data }) => setMetrics(data))
      .catch(() => setError("Panel verileri alınamadı"));
  }, []);

  const cards = [
    { label: "Hizmet", value: metrics?.counts?.services, icon: "fa-list" },
    { label: "Proje", value: metrics?.counts?.projects, icon: "fa-briefcase" },
    { label: "Galeri", value: metrics?.counts?.gallery, icon: "fa-image" },
    { label: "Blog", value: metrics?.counts?.posts, icon: "fa-pen" },
    { label: "Bekleyen Talep", value: metrics?.counts?.pendingRequests, icon: "fa-inbox" },
  ];

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Gösterge Paneli</h2>
          <p className="text-muted mb-0">Genel görünüm ve son talepler</p>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row">
        {cards.map((c) => (
          <div className="col-md-4 mb-3" key={c.label}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex align-items-center gap-3">
                <div className="icon-circle bg-primary text-white">
                  <i className={`fas ${c.icon}`} />
                </div>
                <div>
                  <div className="text-muted text-uppercase small">{c.label}</div>
                  <div className="fs-3 fw-bold">{c.value ?? "-"}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <strong>Son Talepler</strong>
          <span className="text-muted small">İlk 5 kayıt</span>
        </div>
        <div className="card-body">
          {!metrics?.recentRequests?.length ? (
            <p className="text-muted mb-0">Kayıt bulunamadı.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Ad Soyad</th>
                    <th>Hizmet</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.recentRequests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.full_name}</td>
                      <td>{r.preferred_service || "-"}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary">{r.status}</span>
                      </td>
                      <td>{new Date(r.created_at).toLocaleString("tr-TR")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
