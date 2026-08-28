# Integrasi Backend Newsroom

Newsroom menggunakan pola repository agar UI admin dan UI pengguna tidak perlu
diubah ketika backend sudah tersedia.

## Mode saat ini

```env
VITE_NEWSROOM_DATA_SOURCE=local
```

Mode `local` menyimpan artikel di `localStorage` dengan key
`mahreen.newsroom.database.v1`. Perubahan langsung dikirim ke semua komponen pada
tab yang sama dan disinkronkan ke tab browser lain melalui event `storage`.

Artikel dengan status `Published` tampil di Newsroom publik dan Newsroom pada
dashboard pengguna. Artikel `Draft` dan `Scheduled` hanya terlihat di admin.

## Mengaktifkan backend

Ubah variabel berikut setelah endpoint siap:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_NEWSROOM_DATA_SOURCE=api
```

UI akan menggunakan `apiNewsroomRepository.ts`. Mode `auto` juga tersedia untuk
mencoba API terlebih dahulu dan kembali ke data lokal ketika API tidak dapat
dihubungi.

## Kontrak endpoint

### GET `/api/newsroom`

Mengembalikan `NewsroomDatabase`, baik secara langsung maupun di dalam envelope
`{ "data": NewsroomDatabase }`.

### POST `/api/newsroom/articles`

Menerima satu `NewsroomArticleRecord` dalam body JSON dan mengembalikan record
yang sudah disimpan. Backend boleh mengganti `id`, `createdAt`, atau `updatedAt`
sebelum mengembalikan record.

Record dapat memuat `thumbnail`, seluruh item `gallery`, metadata SEO, status,
dan `viewCount`. Penyimpanan media produksi sebaiknya mengganti data URL lokal
dengan URL hasil object storage sebelum record dikembalikan.

### DELETE `/api/newsroom/articles/:slug`

Menghapus artikel berdasarkan slug. Setelah berhasil, artikel otomatis hilang
dari dashboard admin dan seluruh tampilan pengguna.

### POST `/api/newsroom/articles/:slug/view`

Mencatat satu pembukaan artikel dan mengembalikan `NewsroomArticleRecord` dengan
nilai `viewCount` terbaru. Frontend membatasi pencatatan menjadi satu view per
artikel untuk setiap sesi tab browser.

Jenis data utama berada di `src/data/newsroomLocalDatabase.ts`. Kontrak repository
berada di `newsroomRepository.ts`, sehingga implementasi autentikasi, upload media,
atau endpoint CMS dapat ditambahkan tanpa mengubah komponen halaman.
