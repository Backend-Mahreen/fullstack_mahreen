// src/pages/SyaratKetentuan/sections/KontenSyarat.tsx
import React from 'react';
import LegalSectionLink from '../../../components/Legal/LegalSectionLink';

const KontenSyarat: React.FC = () => {
  return (
    <div className="sk-main-layout">
      {/* KIRI: Sidebar Navigasi */}
      <aside className="sk-sidebar">
        <div className="sk-toc-box">
          <h3>Legal Center</h3>
          <p>Resources & Compliance</p>
          <ul className="sk-toc-menu">
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="tentang-ketentuan"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M12 20h9M9 4h6a2 2 0 012 2v14M5 4h4v16H5z"/></svg> Tentang Ketentuan</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="definisi"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13z"/></svg> Definisi</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="persetujuan"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="9 15 11 17 15 13"/></svg> Persetujuan</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="hak-kewajiban"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Hak dan Kewajiban</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="layanan"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Layanan</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="pembayaran"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> Pembayaran</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="kekayaan-intelektual"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/></svg> Kekayaan Intelektual</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="larangan"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg> Larangan</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/syarat-ketentuan" sectionId="kontak"><svg className="sk-toc-icon" viewBox="0 0 24 24" fill="none" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 16 16 12 12 8"/><line x1="8" y1="12" x2="16" y2="12"/></svg> Kontak</LegalSectionLink></li>
          </ul>
        </div>
      </aside>

      {/* KANAN: Isi Konten Utama */}
      <div className="sk-content">
        
        <section id="tentang-ketentuan" className="sk-section">
          <h2 className="sk-section-title">1. Tentang Syarat & Ketentuan</h2>
          <div className="sk-box-standard">
            <p className="sk-text">
              Ketentuan Layanan ini merupakan perjanjian hukum antara Mahreen Indonesia dan Anda ("Pengguna").
              Perjanjian ini mengatur akses dan penggunaan platform Mahreen Indonesia, termasuk namun tidak
              terbatas pada website, portal klien, dan seluruh ekosistem layanan digital yang kami sediakan untuk
              memastikan kepatuhan hukum dan transparansi operasional secara global.
            </p>
          </div>
        </section>

        <section id="definisi" className="sk-section">
          <h2 className="sk-section-title">2. Definisi</h2>
          <div className="sk-def-row">
            <div className="sk-def-term">Mahreen Indonesia</div>
            <div className="sk-def-desc">Entitas bisnis penyedia platform teknologi dan ekosistem bisnis terintegrasi.</div>
          </div>
          <div className="sk-def-row">
            <div className="sk-def-term">Pengguna</div>
            <div className="sk-def-desc">Setiap individu atau badan hukum yang mengakses situs atau menggunakan layanan kami.</div>
          </div>
          <div className="sk-def-row">
            <div className="sk-def-term">Klien</div>
            <div className="sk-def-desc">Pengguna yang telah melakukan perikatan profesional untuk layanan premium.</div>
          </div>
        </section>

        <section id="persetujuan" className="sk-section">
          <h2 className="sk-section-title">3. Persetujuan Pengguna</h2>
          <div className="sk-box-quote">
            <p>
              "Dengan melanjutkan penggunaan situs ini, Anda secara otomatis memberikan persetujuan tanpa
              syarat terhadap seluruh poin dalam Syarat & Ketentuan ini. Jika Anda tidak setuju, harap segera
              menghentikan penggunaan platform kami."
            </p>
          </div>
        </section>

        <section id="hak-kewajiban" className="sk-section">
          <h2 className="sk-section-title">4. Hak dan Kewajiban</h2>
          <div className="sk-list-check">
            <div className="sk-list-item">
              <svg className="sk-list-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div className="sk-list-text"><strong>Kewajiban Data:</strong> Pengguna wajib memberikan data yang akurat dan terkini pada saat registrasi.</div>
            </div>
            <div className="sk-list-item">
              <svg className="sk-list-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div className="sk-list-text"><strong>Keamanan Akun:</strong> Pengguna bertanggung jawab penuh atas kerahasiaan kredensial akses mereka.</div>
            </div>
            <div className="sk-list-item">
              <svg className="sk-list-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div className="sk-list-text"><strong>Penggunaan Wajar:</strong> Menggunakan platform sesuai dengan norma hukum yang berlaku di Indonesia.</div>
            </div>
          </div>
        </section>

        <section id="layanan" className="sk-section">
          <h2 className="sk-section-title">5. Layanan Mahreen Indonesia</h2>
          <div className="sk-grid-4">
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/></svg>
              <div><h4>Newsroom</h4><p>Informasi & Update Ekosistem</p></div>
            </div>
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 006.5 22H20V4H6.5A2.5 2.5 0 004 6.5v13z"/></svg>
              <div><h4>Internship</h4><p>Program Pengembangan Bakat</p></div>
            </div>
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              <div><h4>Tanya Mahreen</h4><p>Layanan AI Assistant</p></div>
            </div>
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 9.36l-7.1 7.1a1 1 0 01-1.41 0l-1.42-1.42a1 1 0 010-1.4l7.1-7.1a6 6 0 019.36-7.94l-3.76 3.77z"/></svg>
              <div><h4>Studio</h4><p>Creative Production Hub</p></div>
            </div>
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              <div><h4>CSR</h4><p>Social Impact Programs</p></div>
            </div>
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              <div><h4>Peduli</h4><p>Initiative Sosial & Donasi</p></div>
            </div>
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              <div><h4>Verification</h4><p>Status & Keabsahan Akun</p></div>
            </div>
            <div className="sk-card-mini">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <div><h4>Client Portal</h4><p>Manajemen Proyek & Aset</p></div>
            </div>
          </div>
        </section>

        <section id="pembayaran" className="sk-section">
          <h2 className="sk-section-title">6. Pembayaran</h2>
          <div className="sk-grid-2">
            <div className="sk-card-pay">
              <div className="sk-pay-header">
                <h4>Digital Invoice</h4>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <p className="sk-text">Tagihan resmi dikirim melalui sistem billing setelah layanan dan pembayaran dikonfirmasi.</p>
            </div>
            <div className="sk-card-pay">
              <div className="sk-pay-header">
                <h4>Down Payment (DP)</h4>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              </div>
              <p className="sk-text">Pekerjaan akan dimulai setelah konfirmasi pembayaran DP sesuai kesepakatan.</p>
            </div>
          </div>
        </section>

        <section id="kekayaan-intelektual" className="sk-section">
          <h2 className="sk-section-title">7. Hak Kekayaan Intelektual</h2>
          <div className="sk-box-standard">
            <p className="sk-text">Semua konten yang tersedia di Platform, termasuk namun tidak terbatas pada:</p>
            <ul className="sk-bullet-list">
              <li>Logo & Identitas Brand</li>
              <li>Desain Antarmuka (UI/UX)</li>
              <li>Kode Sumber (Source Code)</li>
              <li>Aset Multimedia</li>
            </ul>
            <p className="sk-text" style={{ fontSize: '14px' }}>Adalah hak milik eksklusif Mahreen Indonesia atau pemberi lisensi kami dan dilindungi oleh Undang-Undang Hak Cipta.</p>
          </div>
        </section>

        <section id="larangan" className="sk-section">
          <h2 className="sk-section-title">8. Larangan Penggunaan</h2>
          <div className="sk-danger-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <p>Dilarang keras melakukan upaya peretasan, scraping data tanpa izin, atau gangguan teknis pada server Mahreen.</p>
          </div>
          <div className="sk-danger-box">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <p>Dilarang menggunakan layanan kami untuk aktivitas spamming atau pengiriman konten ilegal.</p>
          </div>
        </section>

        <section id="kontak" className="sk-section">
          <h2 className="sk-section-title">9. Hubungi Kami</h2>
          <div className="sk-contact-layout">
            <div className="sk-contact-info">
              <div className="sk-info-item">
                <div className="sk-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div className="sk-info-text">
                  <p>EMAIL RESMI</p>
                  <h4>legal@mahreenindonesia.com</h4>
                </div>
              </div>
              <div className="sk-info-item">
                <div className="sk-info-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div className="sk-info-text">
                  <p>ALAMAT OPERASIONAL</p>
                  <h4>Tersedia melalui kanal Contact resmi</h4>
                </div>
              </div>
            </div>
            
            <div className="sk-contact-card">
              <h4>Butuh Bantuan Cepat?</h4>
              <p>Tim Legal kami tersedia di jam kerja untuk konsultasi kepatuhan.</p>
              <a
                className="sk-btn-whatsapp"
                href="https://wa.me/6289652647385?text=Halo%20Tim%20Legal%20Mahreen%2C%20saya%20ingin%20berkonsultasi."
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp Legal
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default KontenSyarat;
