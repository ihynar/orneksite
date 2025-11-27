"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const emptyItem = { title: "", description: "", image_url: "" };

export default function AdminGalleryPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [status, setStatus] = useState("");

  const load = () =>
    api
      .get("/gallery")
      .then(({ data }) => setItems(data))
      .catch(() => setStatus("Galeri alınamadı"));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await api.post("/gallery", form);
      setForm(emptyItem);
      load();
    } catch (err) {
      setStatus(err.response?.data?.message || "Kaydedilemedi");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Silinsin mi?")) return;
    await api.delete(`/gallery/${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Galeri</h3>
          <p className="text-muted mb-0">Öncesi/sonrası kareleri ekleyin.</p>
        </div>
      </div>

      {status && <div className="alert alert-danger">{status}</div>}

      <div className="row g-3">
        <div className="col-md-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Yeni görsel</h5>
              <form className="d-grid gap-3" onSubmit={handleSubmit}>
                <div>
                  <label className="form-label">Başlık</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Açıklama</label>
                  <input
                    className="form-control"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Görsel URL</label>
                  <input
                    className="form-control"
                    value={form.image_url}
                    onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Ekle
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-7">
          <div className="row">
            {items.map((item) => (
              <div className="col-md-6 mb-3" key={item.id}>
                <div className="card h-100 shadow-sm">
                  <img src={item.image_url} className="card-img-top" alt={item.title} />
                  <div className="card-body">
                    <h6>{item.title}</h6>
                    <p className="text-muted small">{item.description}</p>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(item.id)}>
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!items.length && <p className="text-muted">Henüz görsel yok.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
