"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

const emptyPost = { title: "", excerpt: "", content: "", cover_image: "" };

export default function AdminPostsPage() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyPost);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");

  const load = () =>
    api
      .get("/posts")
      .then(({ data }) => setPosts(data))
      .catch(() => setStatus("Yazılar alınamadı"));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, form);
      } else {
        await api.post("/posts", form);
      }
      setForm(emptyPost);
      setEditingId(null);
      load();
    } catch (err) {
      setStatus(err.response?.data?.message || "Kaydedilemedi");
    }
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image || "",
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Yazı silinsin mi?")) return;
    await api.delete(`/posts/${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Blog Yazıları</h3>
          <p className="text-muted mb-0">İçeriklerinizi güncel tutun.</p>
        </div>
      </div>

      {status && <div className="alert alert-danger">{status}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-3">{editingId ? "Yazıyı Güncelle" : "Yeni Yazı"}</h5>
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
                  <label className="form-label">Özet</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={form.excerpt}
                    onChange={(e) => setForm((p) => ({ ...p, excerpt: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">İçerik</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={form.content}
                    onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Kapak Görseli</label>
                  <input
                    className="form-control"
                    value={form.cover_image}
                    onChange={(e) => setForm((p) => ({ ...p, cover_image: e.target.value }))}
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
                        setForm(emptyPost);
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
              <h5 className="mb-3">Kayıtlı Yazılar</h5>
              {!posts.length ? (
                <p className="text-muted mb-0">Henüz kayıt yok.</p>
              ) : (
                <div className="list-group">
                  {posts.map((post) => (
                    <div className="list-group-item d-flex justify-content-between align-items-start" key={post.id}>
                      <div>
                        <div className="fw-bold">{post.title}</div>
                        <div className="text-muted small">{post.excerpt}</div>
                        <span className="badge bg-secondary-subtle text-secondary">
                          {new Date(post.created_at).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" onClick={() => handleEdit(post)}>
                          Düzenle
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(post.id)}>
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
