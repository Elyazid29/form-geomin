# Register Surat & Nota Dinas — Unit Geomin

Aplikasi pencatatan register surat masuk/keluar dan nota dinas Unit Geomin.
Dibangun dengan React + TypeScript + Vite, Tailwind CSS, dan database Supabase.
Data register dapat diunduh sebagai file Excel (`.xlsx`) yang sudah bergaya.

## Fitur

- Form input register surat dengan validasi kolom wajib.
- Tabel data register (nomor, jenis, tanggal, perihal, tujuan, satuan kerja, keterangan).
- Hapus data dengan konfirmasi.
- Ekspor ke Excel (`.xlsx`) dengan header berwarna, border, dan lebar kolom rapi.
- Data tersimpan permanen di Supabase (PostgreSQL).

## Struktur Proyek

```
.
├─ src/
│  ├─ components/
│  │  ├─ RegisterForm.tsx     # Form input + validasi + panel sukses
│  │  └─ RegisterTable.tsx    # Tabel data + tombol hapus & ekspor
│  ├─ constants/
│  │  └─ form.ts              # Konfigurasi kolom formulir (mudah diubah)
│  ├─ lib/
│  │  └─ supabase.ts          # Inisialisasi client Supabase dari env
│  ├─ utils/
│  │  └─ exportExcel.ts       # Pembuatan file Excel
│  ├─ App.tsx                 # Layout, tab, dan pengelolaan data
│  ├─ main.tsx                # Entry point React
│  ├─ index.css               # Tailwind
│  ├─ types.ts                # Tipe data bersama
│  └─ vite-env.d.ts           # Tipe environment Vite
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.ts
├─ tsconfig.json
├─ .env.example               # Contoh variabel environment
└─ package.json
```

## Menjalankan Secara Lokal

Prasyarat: Node.js 18+.

```bash
npm install
```

Salin `.env.example` menjadi `.env`, lalu isi kredensial Supabase:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-public-key>
```

Jalankan:

```bash
npm run dev
```

Buka `http://localhost:5173`.

## Skema Database Supabase

Jalankan SQL berikut di Supabase SQL Editor:

```sql
create table if not exists public.registers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  answers jsonb not null
);

alter table public.registers enable row level security;

create policy "registers_select_public"
  on public.registers for select using (true);

create policy "registers_insert_public"
  on public.registers for insert with check (true);

create policy "registers_delete_public"
  on public.registers for delete using (true);
```

> **Peringatan keamanan:** policy di atas membuat siapa pun yang memiliki URL aplikasi
> dan anon key dapat membaca, menambah, serta menghapus data. Untuk penggunaan
> perusahaan, sebaiknya tambahkan autentikasi Supabase (login) dan ganti policy
> menjadi hanya untuk pengguna terautentikasi (`auth.role() = 'authenticated'`).
> Jangan pernah menaruh `service_role` key di frontend atau di repositori.

## Build & Hosting

```bash
npm run build     # hasil ada di folder dist/
npm run preview   # cek hasil build secara lokal
```

Deploy ke Vercel / Netlify / hosting statis lain:

1. Push repo ke GitHub.
2. Import repo di dashboard hosting.
3. Build command: `npm run build` — Output directory: `dist`.
4. Tambahkan environment variables berikut di dashboard hosting:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

File `.env` sengaja di-ignore oleh Git. Kredensial produksi diisi lewat
environment variables pada platform hosting.
