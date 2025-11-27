"use client";

export default function AboutPage() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6 mb-4">
          <img
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
            alt="Hakkımızda"
            className="img-fluid rounded shadow"
          />
        </div>
        <div className="col-md-6">
          <h2 className="mb-3">Pırıl Koltuk Yıkama</h2>
          <p className="lead">
            Yerinde buharlı yıkama, leke çıkarma ve antibakteriyel çözümlerle evlerinizi ve ofislerinizi hijyenle
            buluşturuyoruz. Eğitimli ekibimiz, kumaş dostu formüller ve yüksek ısı ile kalıcı temizlik sağlar.
          </p>
          <ul className="list-unstyled">
            <li className="mb-2">
              <i className="fas fa-check text-primary me-2" />
              10+ yıllık saha deneyimi
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-primary me-2" />
              Çevre dostu ve kokusuz ürünler
            </li>
            <li className="mb-2">
              <i className="fas fa-check text-primary me-2" />
              Aynı gün kuruma garantisi
            </li>
          </ul>
          <a className="btn btn-primary" href="/iletisim">
            Hızlı Teklif Al
          </a>
        </div>
      </div>
    </div>
  );
}
