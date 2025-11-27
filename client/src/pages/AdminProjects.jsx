import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyProject = { title: '', summary: '', image_url: '', status: 'devam ediyor', tags: '' };

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyProject);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  const load = () =>
    api
      .get('/projects')
      .then(({ data }) => setProjects(data))
      .catch(() => setStatus('Projeler alınamadı'));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setForm(emptyProject);
      setEditingId(null);
      load();
    } catch (err) {
      setStatus(err.response?.data?.message || 'Kaydedilemedi');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      summary: project.summary,
      image_url: project.image_url,
      status: project.status,
      tags: project.tags?.join(', ') || '',
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Proje silinsin mi?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3>Projeler</h3>
          <p className="text-muted mb-0">Tamamlanan veya devam eden projeleri yönetin.</p>
        </div>
      </div>

      {status && <div className="alert alert-danger">{status}</div>}

      <div className="row g-3">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="mb-3">{editingId ? 'Projeyi Güncelle' : 'Yeni Proje'}</h5>
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
                    rows="3"
                    value={form.summary}
                    onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Kapak görseli</label>
                  <input
                    className="form-control"
                    value={form.image_url}
                    onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                  />
                </div>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">Durum</label>
                    <select
                      className="form-select"
                      value={form.status}
                      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    >
                      <option value="tamamlandı">Tamamlandı</option>
                      <option value="devam ediyor">Devam ediyor</option>
                      <option value="planlandı">Planlandı</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Etiketler (virgül ile)</label>
                    <input
                      className="form-control"
                      value={form.tags}
                      onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                    />
                  </div>
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
                        setForm(emptyProject);
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
              <h5 className="mb-3">Kayıtlı Projeler</h5>
              {!projects.length ? (
                <p className="text-muted mb-0">Henüz kayıt yok.</p>
              ) : (
                <div className="list-group">
                  {projects.map((p) => (
                    <div className="list-group-item d-flex justify-content-between align-items-start" key={p.id}>
                      <div>
                        <div className="fw-bold">{p.title}</div>
                        <div className="text-muted small">{p.summary}</div>
                        <span className="badge bg-primary-subtle text-primary">{p.status}</span>
                      </div>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-secondary" onClick={() => handleEdit(p)}>
                          Düzenle
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(p.id)}>
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
};

export default AdminProjects;
