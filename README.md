# Pırıl Koltuk Yıkama – Next.js Tek Uygulama

`web/` klasöründe Next.js (App Router) tabanlı vitrin + yönetim paneli + Postgres API tek pakette toplandı. Eski HTML şablonları referans için `docs/` içinde duruyor.

## Hızlı Başlangıç
1) **Ortam değişkenleri**  
`cp web/.env.example web/.env` ve `DATABASE_URL`, `JWT_SECRET` değerlerini güncelleyin.  
`NEXT_PUBLIC_API_URL` varsayılanı `/api` (aynı hosttan çağrı).

2) **Bağımlılıklar**  
```bash
cd web
npm install
```

3) **Veritabanı**  
```bash
cd web
npm run db:seed   # migration + örnek veri + admin kullanıcısı
```

4) **Çalıştır**  
```bash
cd web
npm run dev
```
Uygulama: `http://localhost:3000`  
Admin girişi (seed ile gelir): `admin@piril.com` / `admin123`

## İçerik ve Yapı
- `src/app/(site)/*`: Anasayfa, hakkımızda, portföy, galeri, blog, iletişim.
- `src/app/admin/*`: Yönetim paneli (hizmet, proje, galeri, blog, talepler) + login.
- `src/app/api/*`: Next.js route handlers (JWT, services, projects, gallery, posts, contacts, dashboard).
- `db/migrations/`: Postgres şeması; `scripts/migrate.js`, `scripts/seed.js` ile yönetilir.
- Ortak stiller: `src/app/globals.css`; Bootstrap + FontAwesome yükleniyor. 

## Önemli Değişkenler
- `DATABASE_URL`: Postgres bağlantısı (Render/Railway/Neon vs).
- `JWT_SECRET`: Token üretimi.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`: Seed için opsiyonel override.
- `PGSSLMODE=require`: SSL isteyen DB servisleri için.

## Deploy İpuçları
- Vercel: `web/` kök olarak seçip env değişkenlerini girin; `/api/*` rotaları serverless çalışır. DB migration/seed’i bir kere CI veya lokalden `DATABASE_URL` uzaktaki DB’yi gösterirken çalıştırın.
- Tek host olduğundan `NEXT_PUBLIC_API_URL=/api` bırakabilirsiniz; frontend ve API aynı domain altında. 
