const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const allowedOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const authRequired = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Yetkisiz erişim' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Oturum süresi doldu' });
  }
};

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'E-posta ve şifre zorunlu' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, email, name, password_hash FROM admins WHERE email=$1 LIMIT 1',
      [email],
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Geçersiz bilgiler' });
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Geçersiz bilgiler' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      JWT_SECRET,
      { expiresIn: '1d' },
    );

    res.json({
      token,
      admin: { id: admin.id, email: admin.email, name: admin.name },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Giriş yapılamadı' });
  }
});

app.get('/api/services', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, description, price, created_at FROM services ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hizmet listesi alınamadı' });
  }
});

app.post('/api/services', authRequired, async (req, res) => {
  const { title, description, price } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ message: 'Başlık ve açıklama zorunlu' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO services (title, description, price) VALUES ($1,$2,$3) RETURNING *',
      [title, description, price ?? null],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hizmet oluşturulamadı' });
  }
});

app.put('/api/services/:id', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  const { title, description, price } = req.body || {};
  try {
    const { rows } = await pool.query(
      'UPDATE services SET title=$1, description=$2, price=$3 WHERE id=$4 RETURNING *',
      [title, description, price ?? null, id],
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hizmet güncellenemedi' });
  }
});

app.delete('/api/services/:id', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  try {
    await pool.query('DELETE FROM services WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Hizmet silinemedi' });
  }
});

app.get('/api/projects', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, summary, image_url, status, tags, completed_on, created_at FROM projects ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Projeler alınamadı' });
  }
});

app.post('/api/projects', authRequired, async (req, res) => {
  const { title, summary, image_url, status, tags, completed_on } = req.body || {};
  if (!title) return res.status(400).json({ message: 'Başlık zorunlu' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO projects (title, summary, image_url, status, tags, completed_on) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, summary || '', image_url || '', status || 'devam ediyor', tags || [], completed_on || null],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Proje oluşturulamadı' });
  }
});

app.put('/api/projects/:id', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  const { title, summary, image_url, status, tags, completed_on } = req.body || {};
  try {
    const { rows } = await pool.query(
      'UPDATE projects SET title=$1, summary=$2, image_url=$3, status=$4, tags=$5, completed_on=$6 WHERE id=$7 RETURNING *',
      [title, summary || '', image_url || '', status || 'devam ediyor', tags || [], completed_on || null, id],
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Proje güncellenemedi' });
  }
});

app.delete('/api/projects/:id', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  try {
    await pool.query('DELETE FROM projects WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Proje silinemedi' });
  }
});

app.get('/api/gallery', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, description, image_url, created_at FROM gallery_items ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Galeri alınamadı' });
  }
});

app.post('/api/gallery', authRequired, async (req, res) => {
  const { title, description, image_url } = req.body || {};
  if (!image_url) return res.status(400).json({ message: 'Görsel URL zorunlu' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO gallery_items (title, description, image_url) VALUES ($1,$2,$3) RETURNING *',
      [title || '', description || '', image_url],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Galeri öğesi eklenemedi' });
  }
});

app.delete('/api/gallery/:id', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  try {
    await pool.query('DELETE FROM gallery_items WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Galeri öğesi silinemedi' });
  }
});

app.get('/api/posts', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title, slug, excerpt, content, cover_image, created_at FROM posts ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Yazılar alınamadı' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  try {
    const { rows } = await pool.query(
      'SELECT id, title, slug, excerpt, content, cover_image, created_at FROM posts WHERE id=$1',
      [id],
    );
    if (!rows.length) return res.status(404).json({ message: 'Bulunamadı' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Yazı getirilemedi' });
  }
});

app.post('/api/posts', authRequired, async (req, res) => {
  const { title, excerpt, content, cover_image } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ message: 'Başlık ve içerik zorunlu' });
  }
  const slug = title.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/gi, '').trim().replace(/\s+/g, '-');
  try {
    const { rows } = await pool.query(
      'INSERT INTO posts (title, slug, excerpt, content, cover_image) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [title, slug, excerpt || '', content, cover_image || ''],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Yazı eklenemedi' });
  }
});

app.put('/api/posts/:id', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  const { title, excerpt, content, cover_image } = req.body || {};
  try {
    const slug =
      title?.toLowerCase().replace(/[^a-z0-9ğüşıöç\s-]/gi, '').trim().replace(/\s+/g, '-') || null;
    const { rows } = await pool.query(
      'UPDATE posts SET title=$1, slug=COALESCE($2, slug), excerpt=$3, content=$4, cover_image=$5 WHERE id=$6 RETURNING *',
      [title, slug, excerpt || '', content, cover_image || '', id],
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Yazı güncellenemedi' });
  }
});

app.delete('/api/posts/:id', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  try {
    await pool.query('DELETE FROM posts WHERE id=$1', [id]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Yazı silinemedi' });
  }
});

app.post('/api/contacts', async (req, res) => {
  const { full_name, phone, email, message, preferred_service } = req.body || {};
  if (!full_name || !phone) {
    return res.status(400).json({ message: 'İsim ve telefon zorunlu' });
  }
  try {
    const { rows } = await pool.query(
      'INSERT INTO contact_requests (full_name, phone, email, message, preferred_service) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [full_name, phone, email || '', message || '', preferred_service || ''],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Talep gönderilemedi' });
  }
});

app.get('/api/contacts', authRequired, async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, full_name, phone, email, message, preferred_service, status, created_at FROM contact_requests ORDER BY created_at DESC',
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Talepler alınamadı' });
  }
});

app.put('/api/contacts/:id/status', authRequired, async (req, res) => {
  const id = safeNumber(req.params.id);
  if (!id) return res.status(400).json({ message: 'Geçersiz ID' });
  const { status } = req.body || {};
  try {
    const { rows } = await pool.query(
      'UPDATE contact_requests SET status=$1 WHERE id=$2 RETURNING *',
      [status || 'işleniyor', id],
    );
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Durum güncellenemedi' });
  }
});

app.get('/api/dashboard/metrics', authRequired, async (_req, res) => {
  try {
    const [services, projects, gallery, posts, contacts] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM services'),
      pool.query('SELECT COUNT(*) FROM projects'),
      pool.query('SELECT COUNT(*) FROM gallery_items'),
      pool.query('SELECT COUNT(*) FROM posts'),
      pool.query('SELECT COUNT(*) FILTER (WHERE status = $1) FROM contact_requests', ['beklemede']),
    ]);

    const recentRequests = await pool.query(
      'SELECT id, full_name, phone, preferred_service, status, created_at FROM contact_requests ORDER BY created_at DESC LIMIT 5',
    );

    res.json({
      counts: {
        services: Number(services.rows[0].count),
        projects: Number(projects.rows[0].count),
        gallery: Number(gallery.rows[0].count),
        posts: Number(posts.rows[0].count),
        pendingRequests: Number(contacts.rows[0].count),
      },
      recentRequests: recentRequests.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Panel verisi alınamadı' });
  }
});

app.use((err, _req, res, _next) => {
  console.error('Beklenmeyen hata', err);
  res.status(500).json({ message: 'Beklenmeyen bir hata oluştu' });
});

app.listen(PORT, () => {
  console.log(`API http://localhost:${PORT} üzerinde çalışıyor`);
});
