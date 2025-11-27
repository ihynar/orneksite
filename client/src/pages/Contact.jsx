import { useState } from 'react';
import api from '../api/client';

const Contact = () => {
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    message: '',
    preferred_service: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    try {
      await api.post('/contacts', form);
      setStatus({ type: 'success', message: 'Talebiniz alındı, en kısa sürede dönüş yapacağız.' });
      setForm({ full_name: '', phone: '', email: '', message: '', preferred_service: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Gönderilemedi' });
    }
  };

  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-md-6">
          <h2>İletişim</h2>
          <p className="text-muted">Randevu ve fiyatlandırma için formu doldurun.</p>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-phone text-primary me-2" />
            <span>+90 555 000 00 00</span>
          </div>
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-envelope text-primary me-2" />
            <span>info@piril.com</span>
          </div>
          <div className="d-flex align-items-center">
            <i className="fas fa-map-marker-alt text-primary me-2" />
            <span>İstanbul, Türkiye</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Hızlı Teklif Formu</h5>
            {status.message && (
              <div className={`alert alert-${status.type === 'success' ? 'success' : 'danger'}`}>
                {status.message}
              </div>
            )}
            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-12">
                <label className="form-label">Ad Soyad</label>
                <input
                  className="form-control"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Telefon</label>
                <input
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">E-posta</label>
                <input
                  className="form-control"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  type="email"
                />
              </div>
              <div className="col-12">
                <label className="form-label">Talep Ettiğiniz Hizmet</label>
                <select
                  className="form-select"
                  name="preferred_service"
                  value={form.preferred_service}
                  onChange={handleChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="Koltuk">Koltuk Yıkama</option>
                  <option value="Yatak">Yatak Yıkama</option>
                  <option value="Araç">Araç Koltuğu</option>
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Detay</label>
                <textarea
                  className="form-control"
                  rows="3"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary w-100">
                  Gönder
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
