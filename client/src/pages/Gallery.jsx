import { useEffect, useState } from 'react';
import { fetchCollection } from '../api/client';

const placeholder = [
  {
    id: 1,
    title: 'Temizlik Öncesi/Sonrası',
    image_url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    description: 'Buharlı derin temizlik',
  },
];

const Gallery = () => {
  const [items, setItems] = useState(placeholder);

  useEffect(() => {
    fetchCollection('/gallery')
      .then(setItems)
      .catch(() => setItems(placeholder));
  }, []);

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h2>Galeri</h2>
        <p className="text-muted">Öncesi / sonrası kareler</p>
      </div>
      <div className="row">
        {items.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card h-100 shadow-sm">
              <img src={item.image_url} className="card-img-top" alt={item.title || 'Galeri'} />
              <div className="card-body">
                <h5>{item.title || 'Fotoğraf'}</h5>
                <p className="text-muted mb-0">{item.description || 'Temizlik sonrası sonuç'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
