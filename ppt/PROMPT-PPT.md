# Prompt: Konversi Markdown ke PowerPoint (Claude AI)

Gunakan prompt di bawah ini di Claude AI untuk mengconvert file markdown PPT menjadi file PowerPoint (.pptx).

---

## PROMPT UTAMA

```
Kamu adalah asisten expert dalam membuat presentasi PowerPoint. 

TUGASKU:
Aku akan memberikanmu file-file markdown yang berisi konten presentasi. 
Tugasmu adalah mengubahnya menjadi file PowerPoint (.pptx) yang profesional.

YANG PERLU KAMU LAKUKAN:
1. Baca semua file markdown yang aku kirim
2. Buat file Python menggunakan library `python-pptx` untuk generate PowerPoint
3. Jalankan script Python tersebut untuk menghasilkan file .pptx
4. Berikan aku file .pptx yang sudah jadi

DESIGN GUIDELINES:
- Warna utama: Hijau (#2D6A4F) — brand Mahreen Indonesia
- Warna sekunder: Hijau muda (#52B788)
- Warna accent: Emas (#D4A843)
- Background: Putih (#FFFFFF) atau abu sangat muda (#F8F9FA)
- Font heading: Calibri Bold atau Arial Bold
- Font body: Calibri atau Arial
- Font size: Title 32-36pt, Heading 24-28pt, Body 16-18pt
- Setiap slide harus ada footer: "Mahreen Indonesia — mahreenindonesia.com"
- Gunakan icons/emoji sebagai visual di slide

SLIDE STRUCTURE:
- Slide 1: Cover (judul besar, nama tim, tahun)
- Slide 2: Pengenalan Tim (tabel 4 role)
- Slide 3: TEKNOLOGI (4 section: UI/UX, FE, BE, DB)
- Slide 4: KONTRIBUSI (4 section dengan detail)
- Slide 5: CHALLENGE & SOLUTION (tabel per role)
- Slide 6: KESIMPULAN & SARAN (per role + kesimpulan utama)
- Slide 7: Penutup & Q&A

FORMAT OUTPUT:
- Simpan file sebagai: Mahreen_Indonesia_PPT.pptx
- Ukuran slide: Widescreen 16:9
- Setiap poin dalam bullet point, maksimal 5 poin per slide
- Gunakan tabel untuk perbandingan
```

---

## PROMPT LANJUTAN (jika perlu detail lebih)

```
TAMBAHAN UNTUK SETIAP SLIDE:

SLIDE COVER:
- Background gradient hijau (#2D6A4F ke #1B4332)
- Judul: "Mahreen Indonesia" (putih, bold, 40pt)
- Subtitle: "Presentasi Project Web Development" (putih, 24pt)
- Nama tim di bawah dengan icon per role
- Logo/teks "mahreenindonesia.com" di pojok kanan bawah

SLIDE TEKNOLOGI:
- Buat 4 box/card per role
- Setiap box: nama role sebagai header, list teknologi sebagai isi
- Gunakan warna berbeda untuk setiap role:
  * UI/UX: Biru (#3B82F6)
  * Frontend: Hijau (#10B981)
  * Backend: Oranye (#F59E0B)
  * Database: Ungu (#8B5CF6)

SLIDE KONTRIBUSI:
- Format tabel dengan kolom: No, Kontribusi, Detail
- Maksimal 5 baris per role
- Highlight kontribusi utama dengan warna

SLIDE CHALLENGE & SOLUTION:
- Format 2 kolom: Challenge | Solution
- Gunakan warna merah muda untuk challenge, hijau muda untuk solution
- Maksimal 4 challenge per role

SLIDE KESIMPULAN & SARAN:
- Kesimpulan: paragraf singkat per role
- Saran: tabel dengan kolom No, Saran, Alasan
- Tambahkan box "Kesimpulan Utama Tim" di akhir

SLIDE PENUTUP:
- Diagram arsitektur sederhana (text-based)
- Tabel nama tim
- "Terima Kasih" besar di tengah
- "Ada Pertanyaan?" di bawah
```

---

## PROMPT ALTERNATIF (untuk Claude Artifacts)

```
Buatkan aku presentasi PowerPoint menggunakan Python python-pptx.

Berikut isi presentasi yang perlu dibuat:

=== SLIDE 1: COVER ===
Judul: "Mahreen Indonesia"
Subtitle: "Presentasi Project Web Development"
Tim: UI/UX Designer, Frontend Developer, Backend Developer, Database Engineer
Tahun: 2026
Website: mahreenindonesia.com

=== SLIDE 2: PENGENALAN TIM ===
Tabel:
| Role | Tanggung Jawab |
| UI/UX Designer | Perancangan antarmuka, user experience, design system |
| Frontend Developer | Implementasi tampilan, interaksi user, integrasi API |
| Backend Developer | Server, API, autentikasi, integrasi payment gateway |
| Database Engineer | Perancangan database, optimasi query, data integrity |

=== SLIDE 3: TEKNOLOGI ===
UI/UX: Figma, Design System, Lucide Icons, Font Cormorant + Inter
Frontend: React 19, TypeScript, Vite 8, Custom Hash Routing, Lazy Loading, Dual Data Source
Backend: Node.js 22, Express 5, JWT, Midtrans, SSE, Rate Limiting, DOMPurify
Database: MySQL InnoDB, 35+ Tabel, UUID PKs, Foreign Keys, JSON Columns

=== SLIDE 4: KONTRIBUSI ===
UI/UX: Wireframe 23+ halaman, Design System, Responsive Layout, User Flow, Component Library
Frontend: 15+ custom hooks, API client auto-refresh, Dual data source, Lazy loading, Admin dashboard
Backend: 40+ endpoint, JWT dual-token, 80+ RBAC permissions, Midtrans integration, SSE, 6+ rate limiters
Database: 35+ tabel, Foreign keys, UUID strategy, Auto-seeding, Parameterized queries

=== SLIDE 5: CHALLENGE & SOLUTION ===
UI/UX: 5 pilar konsisten → Design System | Banyak halaman → Component-based | Responsive → Mobile-first
Frontend: Tanpa React Router → Custom hash routing | Dual data source → serviceMode.ts | State management → Context + hooks
Backend: Raw SQL → Parameterized queries + helpers | Autentikasi → JWT dual-token | Security → Helmet + rate limiting + CSRF
Database: Relasi kompleks → Foreign keys + transactions | Performance → LRU caching | No migration → Programmatic schema

=== SLIDE 6: KESIMPULAN & SARAN ===
Kesimpulan: Platform terpadu 5 layanan, aman, transaksi online, real-time, responsive, scalable
Saran UI/UX: Dark mode, Design System v2, User testing
Saran Frontend: React Router, Zustand/Jotai, E2E testing
Saran Backend: API versioning, Migration framework, Swagger docs, Unit test coverage
Saran Database: Indexing, Query logging, Backup strategy, Read replicas

=== SLIDE 7: PENUTUP ===
Diagram arsitektur, Nama tim, Terima Kasih, Q&A

DESIGN: Warna hijau (#2D6A4F), font Calibri, 16:9, footer "Mahreen Indonesia"
```

---

## CARA PAKAI

1. **Buka Claude AI** (claude.ai)
2. **Copy prompt utama** di atas
3. **Paste** ke chat Claude
4. **Kirim file markdown** satu per satu (atau semua sekaligus)
5. Claude akan generate **script Python** + **file .pptx**
6. **Download** file .pptx yang dihasilkan

## CATATAN

- Claude AI bisa generate **script Python** yang menghasilkan .pptx
- Kamu perlu **install python-pptx** dulu: `pip install python-pptx`
- Jalankan script yang diberikan Claude: `python create_pptx.py`
- File .pptx akan tersimpan di folder yang sama

---

*File ini dibuat untuk memudahkan konversi markdown → PowerPoint menggunakan Claude AI.*
