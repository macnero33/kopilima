# Kopi Lima

Website mobile-first dan loyalty card digital untuk kedai Kopi Lima.

## Jalankan lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Setup Supabase

1. Buat project gratis di Supabase.
2. Buka SQL Editor, jalankan `supabase/001_loyalty.sql`.
3. Di Authentication → Users, buat satu atau dua akun kasir/pemilik.
4. Ambil URL dan anon key dari Project Settings → API.
5. Ambil service role key; jangan pernah menaruhnya di variabel `NEXT_PUBLIC_*` atau kode browser.
6. Isi `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

RLS aktif pada `customers` dan `stamp_log`; tidak ada policy client. Semua tulis data dilakukan route server memakai service role.

## Alur

- `/daftar` untuk registrasi pelanggan.
- `/kartu/[token]` untuk QR kartu; nomor WhatsApp tidak ditampilkan.
- `/admin/login` untuk login kasir.
- `/admin/scan` untuk scan dan tambah stempel.
- `/admin/pelanggan` untuk cari, tebus, undo, riwayat, dan hapus pelanggan.

Aturan: 10 menit cooldown, 5 stempel untuk satu kopi gratis, undo tersedia 5 menit. Nilai cooldown ada di `src/config/site.ts`.

## Placeholder yang perlu diisi pemilik

- `src/config/site.ts`: alamat, jam buka, WhatsApp, dan link Maps.
- `src/config/menu.ts`: nama, kategori, harga, dan tag menu.
- `public/logo.svg`: logo asli pemilik.

## Test dan build

```bash
npm test
npm run lint
npm run build
```

## Deploy Vercel

1. Push proyek ke GitHub/GitLab.
2. Import repository di Vercel.
3. Tambahkan tiga environment variable Supabase di Project Settings → Environment Variables.
4. Deploy.
5. Di Supabase Auth → URL Configuration, tambahkan domain Vercel sebagai Site URL dan tambahkan redirect asal jika digunakan.
