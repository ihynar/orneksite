const path = require('path');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const pool = require('../src/db');
const runMigrations = require('./migrate');

async function seed() {
  await runMigrations();

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@piril.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const { rows: admins } = await pool.query('SELECT id FROM admins WHERE email=$1', [adminEmail]);
  if (!admins.length) {
    const hash = await bcrypt.hash(adminPassword, 10);
    await pool.query('INSERT INTO admins (email, name, password_hash) VALUES ($1,$2,$3)', [
      adminEmail,
      'Pırıl Admin',
      hash,
    ]);
    console.log(`> Yönetici eklendi: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log('> Yönetici zaten kayıtlı');
  }

  const servicesSeed = [
    {
      title: 'Koltuk Yıkama',
      description: 'Buharlı ve antialerjik solüsyonlarla derin temizlik.',
      price: 1200,
    },
    {
      title: 'Yatak Yıkama',
      description: 'Mite ve bakterilere karşı yüksek ısıda hijyen.',
      price: 950,
    },
    {
      title: 'Araç Koltuğu Detaylı Temizlik',
      description: 'İnce uçlu vakum ve kokusuz formüllerle detaylı temizlik.',
      price: 800,
    },
  ];

  const { rows: servicesCount } = await pool.query('SELECT COUNT(*) FROM services');
  if (Number(servicesCount[0].count) === 0) {
    for (const s of servicesSeed) {
      await pool.query(
        'INSERT INTO services (title, description, price) VALUES ($1,$2,$3)',
        [s.title, s.description, s.price],
      );
    }
    console.log('> Hizmet verileri eklendi');
  }

  const projectsSeed = [
    {
      title: 'Nakkaştepe Villa Koltuk Projesi',
      summary: 'Su bazlı leke çıkarıcı ve sıcak buhar kombinasyonu ile 16 parça takım yenilendi.',
      image_url: 'https://images.unsplash.com/photo-1523419400524-fc1e0f1a3b69?auto=format&fit=crop&w=900&q=80',
      status: 'tamamlandı',
      tags: ['koltuk', 'leke', 'buhar'],
    },
    {
      title: 'Ofis Kanepe Detaylı Bakım',
      summary: 'Hafta sonu mesaisiyle 30+ oturma alanı hijyen standardına getirildi.',
      image_url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80',
      status: 'tamamlandı',
      tags: ['ofis', 'hızlı teslim'],
    },
  ];

  const { rows: projectCount } = await pool.query('SELECT COUNT(*) FROM projects');
  if (Number(projectCount[0].count) === 0) {
    for (const p of projectsSeed) {
      await pool.query(
        'INSERT INTO projects (title, summary, image_url, status, tags) VALUES ($1,$2,$3,$4,$5)',
        [p.title, p.summary, p.image_url, p.status, p.tags],
      );
    }
    console.log('> Proje verileri eklendi');
  }

  const gallerySeed = [
    {
      title: 'Buharlı Temizlik',
      description: 'Derinlemesine köpük ve vakum uygulaması',
      image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    },
    {
      title: 'Araç İçi Detay',
      description: 'Ozon destekli ferahlatma',
      image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80',
    },
  ];

  const { rows: galleryCount } = await pool.query('SELECT COUNT(*) FROM gallery_items');
  if (Number(galleryCount[0].count) === 0) {
    for (const g of gallerySeed) {
      await pool.query(
        'INSERT INTO gallery_items (title, description, image_url) VALUES ($1,$2,$3)',
        [g.title, g.description, g.image_url],
      );
    }
    console.log('> Galeri verileri eklendi');
  }

  const postsSeed = [
    {
      title: 'Yerinde Koltuk Yıkama Neden Önemli?',
      excerpt: 'Evde hijyen seviyesini yükseltmek için yerinde buharlı yıkama nasıl fark yaratır?',
      content:
        'Kumaş dokularını zedelemeden yüksek ısı buharı ile yapılan temizlik, lekeleri çözerken bakteri ve mite oluşumunu minimuma indirir. Doğru ekipmanla yapılan uygulama, kuruma süresini de kısaltır.',
      cover_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Temizlik Sonrası Kurutma İpuçları',
      excerpt: 'Koltuk ve yatakların daha hızlı kuruması için uygulanabilir püf noktaları.',
      content:
        'Oda havalandırmasını artırın, fan desteği kullanın ve güneş alan noktalarda doğrudan ısıtmadan kaçının. Kimyasal kalıntısı bırakmayan formüller, koku oluşumunu engeller.',
      cover_image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const { rows: postCount } = await pool.query('SELECT COUNT(*) FROM posts');
  if (Number(postCount[0].count) === 0) {
    for (const p of postsSeed) {
      const slug = p.title.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/gi, '').trim().replace(/\s+/g, '-');
      await pool.query(
        'INSERT INTO posts (title, slug, excerpt, content, cover_image) VALUES ($1,$2,$3,$4,$5)',
        [p.title, slug, p.excerpt || '', p.content, p.cover_image || ''],
      );
    }
    console.log('> Blog yazıları eklendi');
  }

  console.log('Seed tamamlandı');
}

if (require.main === module) {
  seed()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed hatası', err);
      process.exit(1);
    });
}

module.exports = seed;
