"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminContactsPage() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");

  const load = () =>
    api
      .get("/contacts")
      .then(({ data }) => setRequests(data))
      .catch(() => setStatus("Talepler alınamadı"));

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, newStatus) => {
    await api.put(`/contacts/${id}/status`, { status: newStatus });
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Gelen Talepler</h3>
          <p className="text-muted mb-0">Form üzerinden gelen kayıtlar</p>
        </div>
      </div>
      {status && <div className="alert alert-danger">{status}</div>}
      <div className="card shadow-sm">
        <div className="card-body">
          {!requests.length ? (
            <p className="text-muted mb-0">Henüz kayıt yok.</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Ad Soyad</th>
                    <th>Telefon</th>
                    <th>Hizmet</th>
                    <th>Mesaj</th>
                    <th>Durum</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>{r.full_name}</td>
                      <td>{r.phone}</td>
                      <td>{r.preferred_service}</td>
                      <td>{r.message}</td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary text-uppercase">{r.status}</span>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button className="btn btn-outline-secondary" onClick={() => updateStatus(r.id, "işleniyor")}>
                            İşleniyor
                          </button>
                          <button className="btn btn-outline-success" onClick={() => updateStatus(r.id, "tamamlandı")}>
                            Tamamlandı
                          </button>
                        </div>
                      </td>
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
