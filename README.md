# Pırıl Koltuk Yıkama – React + Admin Panel

Taşınan tüm HTML şablonları `docs/` klasöründedir. Aynı görünüm dilini koruyan React tabanlı bir vitrin ve JWT korumalı yönetim paneli eklendi. API katmanı PostgreSQL kullanıyor.

## Özellikler
- React (Vite) ön yüz: Anasayfa, hakkımızda, portföy, galeri, blog, iletişim formları.
- Yönetim paneli: Hizmet, proje, galeri, blog ve gelen talepler için CRUD + istatistik kartları.
- Node/Express API: JWT oturum, Postgres bağlantısı, hazır migration/seed komutları.
- Örnek veri ve hazır admin hesabı (seed içinde): `admin@piril.com` / `admin123`.

## Hızlı Başlangıç
1. PostgreSQL’i başlatın ve bağlantı adresinizi `.env` dosyalarına yazın.
2. Sunucu bağımlılıkları:  
   ```bash
   cd server
   npm install
   cp .env.example .env   # bağlantıyı ve JWT_SECRET'i güncelleyin
   npm run db:seed        # migration + örnek veri + admin kullanıcısı
   npm run dev            # API http://localhost:4000
   ```
3. İstemci bağımlılıkları:  
   ```bash
   cd client
   npm install
   cp .env.example .env   # gerekirse API adresini düzenleyin
   npm run dev            # ön yüz http://localhost:5173
   ```

## Önemli Diziler
- `docs/`: Orijinal HTML şablonları (CSS kopyası dahil).
- `client/`: React uygulaması ve yönetim paneli.
- `server/`: Express API, migration (`db/migrations`), seed ve scriptler (`scripts/`).

## API Uçları (özet)
- `POST /api/auth/login` → JWT üretir.
- `GET/POST/PUT/DELETE /api/services`, `/projects`, `/posts`, `/gallery` → CRUD (yazma işlemleri JWT ister).
- `POST /api/contacts` → Form gönderimi (public), `GET/PUT /api/contacts/:id/status` → yönetici.
- `GET /api/dashboard/metrics` → Panel kartları ve son talepler.

## Notlar
- Varsayılan CORS: `http://localhost:5173` (env ile değiştirilebilir).
- İletişim formu veritabanına `contact_requests` tablosuna düşer; panelden durum yönetilir.
- `docs/` içindeki statik şablonlar referans amaçlıdır; React uygulaması aynı içerik temasıyla çalışır.
