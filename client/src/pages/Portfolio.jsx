import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCollection } from '../api/client';

const fallbackProjects = [
  {
    id: 1,
    title: 'Showroom Koltuk Yenileme',
    summary: 'Leke ve koku giderme, aynı gün teslim.',
    image_url: 'https://images.unsplash.com/photo-1523419400524-fc1e0f1a3b69?auto=format&fit=crop&w=900&q=80',
    status: 'tamamlandı',
  },
];

const Portfolio = () => {
  const [projects, setProjects] = useState(fallbackProjects);

  useEffect(() => {
    fetchCollection('/projects')
      .then(setProjects)
      .catch(() => setProjects(fallbackProjects));
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2>Çalışmalarımız</h2>
        <p className="text-muted">Tamamlanan projelerden seçmeler</p>
      </div>
      <div className="row">
        {projects.map((p) => (
          <div className="col-md-4 mb-4" key={p.id}>
            <div className="card h-100 shadow-sm">
              {p.image_url && <img src={p.image_url} className="card-img-top" alt={p.title} />}
              <div className="card-body">
                <span className="badge bg-primary-subtle text-primary mb-2">{p.status}</span>
                <h5>{p.title}</h5>
                <p className="text-muted">{p.summary}</p>
                <Link to={`/portfoy/${p.id}`} className="btn btn-outline-primary btn-sm">
                  Detay
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
