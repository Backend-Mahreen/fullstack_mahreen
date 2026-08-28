# Template sitemap konten dinamis

Folder ini tidak ikut dipublikasikan sebagai sitemap aktif. Berkas `*.xml.example`
hanya menjadi referensi struktur lama selama artikel, produk, webinar/event, dan
studi kasus portfolio masih menggunakan data demo/local.

Jangan menyalin URL dummy ke folder `public`.

Sitemap dinamis baru boleh dibuat oleh backend/CMS apabila seluruh syarat berikut
terpenuhi:

- konten berstatus `published`;
- visibilitas konten `public`;
- slug tersedia dan unik;
- halaman detail merespons HTTP 200;
- canonical mengarah ke URL detail tersebut;
- halaman tidak memiliki `noindex`;
- konten utama bukan placeholder atau `Coming Soon`.

Setelah backend siap:

1. buat endpoint sitemap dinamis dari database;
2. tambahkan endpoint tersebut ke `public/sitemap.xml` atau jadikan `sitemap.xml`
   sebagai sitemap index yang dihasilkan server;
3. ubah `VITE_ENABLE_DYNAMIC_CONTENT_INDEXING=true` pada environment produksi;
4. tambahkan structured data Article/Product/Event hanya dari data published;
5. pastikan slug yang tidak ditemukan mengembalikan HTTP 404 dari server.

Setelah mengubah flag environment, hapus juga aturan `X-Robots-Tag: noindex`
sementara untuk route detail dari `.htaccess` ketika
konten dinamis sudah layak diindeks.
