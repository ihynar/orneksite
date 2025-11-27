"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const emptyForm = { title: "", description: "", price: "" };

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");

  const load = () =>
    api
      .get("/services")
      .then(({ data }) => setServices(data))
      .catch(() => setStatus("Hizmetler alınamadı"));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, { ...form, price: Number(form.price) || null });
      } else {
        await api.post("/services", { ...form, price: Number(form.price) || null });
      }
      setForm(emptyForm);
      setEditingId(null);
      load();
    } catch (err) {
      setStatus(err.response?.data?.message || "Kaydedilemedi");
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      title: service.title,
      description: service.description,
      price: service.price || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Silinsin mi?")) return;
    await api.delete(`/services/${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Hizmetler</h3>
          <p className="text-muted mb-0">Listeyi güncelleyin, fiyat ekleyin.</p>
        </div>
      </div>

      {status && <div className="alert alert-danger">{status}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-3">{editingId ? "Hizmeti Güncelle" : "Yeni Hizmet"}</h5>
              <form onSubmit={handleSubmit} className="d-grid gap-3">
                <div>
                  <label className="form-label">Başlık</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Açıklama</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Fiyat (TL)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary" type="submit">
                    Kaydet
                  </button>
                  {editingId && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                      }}
                    >
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-3">Kayıtlı Hizmetler</h5>
              {!services.length ? (
                <p className="text-muted mb-0">Henüz kayıt yok.</p>
              ) : (
                <ul className="list-group">
                  {services.map((s) => (
                    <li className="list-group-item d-flex justify-content-between align-items-start" key={s.id}>
                      <div>
                        <div className="fw-bold">{s.title}</div>
                        <div className="text-muted small">{s.description}</div>
                        {s.price ? <div className="small text-primary fw-semibold">{s.price} TL</div> : null}
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" onClick={() => handleEdit(s)}>
                          Düzenle
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(s.id)}>
                          Sil
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
