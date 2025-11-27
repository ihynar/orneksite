"use client";

import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import api from "@/lib/api";

const fallbackServices = [
  { id: 1, title: "Koltuk Yıkama", description: "Özel vakum ve buharlı makinelerle derin temizlik." },
  { id: 2, title: "Yatak Yıkama", description: "Mite ve bakterilerden arındırılmış sağlıklı uyku." },
  { id: 3, title: "Araç Koltuğu", description: "Aracınızın içi de dışı kadar temiz olsun." },
];

export default function HomePage() {
  const [services, setServices] = useState(fallbackServices);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api
      .get("/services")
      .then(({ data }) => setServices(data))
      .catch(() => setServices(fallbackServices));
    api
      .get("/posts")
      .then(({ data }) => setPosts(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <>
      <HeroSection
        title="Koltuklarınız İlk Günkü Gibi Olsun"
        subtitle="Yerinde buharlı yıkama teknolojisi ile bakterilere ve lekelere veda edin."
        primaryText="Randevu Al"
        secondaryText="Örnekleri Gör"
      />

      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2>Hizmetlerimiz</h2>
            <p className="text-muted">Neleri temizliyoruz?</p>
          </div>
          <div className="row">
            {services.map((service) => (
              <div className="col-md-4 mb-4" key={service.id}>
                <div className="card service-card p-3 h-100">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-sparkles fa-2x text-primary me-3" />
                    <div>
                      <h5 className="mb-0">{service.title}</h5>
                      {service.price ? (
                        <small className="text-muted">{service.price} TL</small>
                      ) : (
                        <small className="text-muted">Yerinde fiyatlandırma</small>
                      )}
                    </div>
                  </div>
                  <p className="text-muted mb-0">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4">
              <img
                className="img-fluid rounded shadow"
                src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
                alt="Temizlik ekibi"
              />
            </div>
            <div className="col-md-6">
              <h3 className="mb-3">Neden Pırıl?</h3>
              <ul className="list-unstyled lead">
                <li className="mb-2">
                  <i className="fas fa-check-circle text-primary me-2" />
                  Yerinde, hızlı ve kokusuz uygulama
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle text-primary me-2" />
                  Leke odaklı formüller ve yüksek ısı buhar
                </li>
                <li className="mb-2">
                  <i className="fas fa-check-circle text-primary me-2" />
                  Fotoğraf destekli rapor ve garanti
                </li>
              </ul>
              <a className="btn btn-cta" href="/iletisim">
                Teklif Al
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h3>Son Yazılar</h3>
              <p className="text-muted mb-0">Temizlik ipuçları ve yenilikler</p>
            </div>
            <a href="/blog" className="btn btn-link">
              Tümü
            </a>
          </div>
          <div className="row">
            {posts.map((post) => (
              <div className="col-md-4 mb-4" key={post.id}>
                <div className="card h-100 shadow-sm">
                  {post.cover_image ? (
                    <img src={post.cover_image} className="card-img-top" alt={post.title} />
                  ) : null}
                  <div className="card-body">
                    <h5>{post.title}</h5>
                    <p className="text-muted">{post.excerpt || post.content?.slice(0, 120)}</p>
                    <a className="btn btn-outline-primary btn-sm" href={`/blog/${post.id}`}>
                      Oku
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {!posts.length && <p className="text-muted">Henüz blog eklenmedi.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
