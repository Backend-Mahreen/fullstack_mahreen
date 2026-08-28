import React from 'react';
import LegalSectionLink from '../../../components/Legal/LegalSectionLink';
import PrivacyRightsAccordion from '../components/PrivacyRightsAccordion';

import iconTentang from '../../../assets/KebijakanPrivasi/Tentang Kebijakan.png';
import iconData from '../../../assets/KebijakanPrivasi/datakoleksi.png';
import iconKeamanan from '../../../assets/KebijakanPrivasi/keamanan data.png';
import iconHak from '../../../assets/KebijakanPrivasi/hakpengguna.png';
import iconHubungi from '../../../assets/KebijakanPrivasi/Hubungikami.png';
import iconPersonal from '../../../assets/KebijakanPrivasi/identitas personal.png';
import iconKontak from '../../../assets/KebijakanPrivasi/kontak bisnis.png';
import iconAnalitik from '../../../assets/KebijakanPrivasi/data analitik.png';
import iconKorporat from '../../../assets/KebijakanPrivasi/informasi korporat.png';
import iconSsl from '../../../assets/KebijakanPrivasi/ssl encryption.png';
import iconCloud from '../../../assets/KebijakanPrivasi/cloud storage.png';
import iconAuth from '../../../assets/KebijakanPrivasi/multi -auth.png';
import iconEmail from '../../../assets/KebijakanPrivasi/email.png';
import iconLokasi from '../../../assets/KebijakanPrivasi/kantor pusat.png';

const KontenPrivasi: React.FC = () => {
  return (
    <div className="kp-main-layout">
      {/* KIRI: Sidebar Navigasi */}
      <aside className="kp-sidebar">
        <div className="kp-toc-box">
          <h3>Table of Contents</h3>
          <p>Legal Framework</p>
          <ul className="kp-toc-menu">
            <li><LegalSectionLink pagePath="/kebijakan-privasi" sectionId="tentang-kebijakan"><img width="17" height="17" decoding="async" loading="lazy" src={iconTentang} alt="" className="kp-toc-icon" /> Tentang Kebijakan</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/kebijakan-privasi" sectionId="data-koleksi"><img width="15" height="15" decoding="async" loading="lazy" src={iconData} alt="" className="kp-toc-icon" /> Data Koleksi</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/kebijakan-privasi" sectionId="keamanan-data"><img width="14" height="17" decoding="async" loading="lazy" src={iconKeamanan} alt="" className="kp-toc-icon" /> Keamanan Data</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/kebijakan-privasi" sectionId="hak-pengguna"><img width="15" height="16" decoding="async" loading="lazy" src={iconHak} alt="" className="kp-toc-icon" /> Hak Pengguna</LegalSectionLink></li>
            <li><LegalSectionLink pagePath="/kebijakan-privasi" sectionId="hubungi-kami"><img width="15" height="17" decoding="async" loading="lazy" src={iconHubungi} alt="" className="kp-toc-icon" /> Hubungi Kami</LegalSectionLink></li>
          </ul>
        </div>
      </aside>

      {/* KANAN: Isi Konten Utama */}
      <div className="kp-content">
        
        {/* Section 1: Tentang Kebijakan */}
        <section id="tentang-kebijakan" className="kp-section">
          <h2 className="kp-section-title">Tentang Kebijakan</h2>
          <p className="kp-text">
            Kebijakan Privasi ini menjelaskan bagaimana Mahreen Indonesia mengumpulkan, menggunakan, dan melindungi
            informasi Anda saat menggunakan layanan konsultasi, platform digital, dan situs web kami.
          </p>
          <p className="kp-text">
            Kebijakan ini berlaku untuk seluruh ekosistem layanan Mahreen Indonesia tanpa pengecualian. Kami memastikan
            bahwa setiap data yang diproses mematuhi regulasi perlindungan data yang berlaku baik secara nasional maupun
            internasional.
          </p>
        </section>

        {/* Section 2: Data Koleksi */}
        <section id="data-koleksi" className="kp-section">
          <h2 className="kp-section-title">Data yang Dikumpulkan</h2>
          <p className="kp-text">Kami mengumpulkan informasi yang diperlukan untuk memberikan pengalaman layanan yang optimal bagi klien korporat kami:</p>
          
          <div className="kp-grid-2">
            <div className="kp-card">
              <div className="kp-icon"><img width="40" height="40" decoding="async" loading="lazy" src={iconPersonal} alt="Ikon Identitas Personal" /></div>
              <div className="kp-card-text">
                <h4>Identitas Personal</h4>
                <p>Nama Lengkap, Jabatan, Identitas Profesional.</p>
              </div>
            </div>
            <div className="kp-card">
              <div className="kp-icon"><img width="40" height="40" decoding="async" loading="lazy" src={iconKontak} alt="Ikon Kontak Bisnis" /></div>
              <div className="kp-card-text">
                <h4>Kontak Bisnis</h4>
                <p>Email Perusahaan, Nomor WhatsApp Bisnis.</p>
              </div>
            </div>
            <div className="kp-card">
              <div className="kp-icon"><img width="40" height="40" decoding="async" loading="lazy" src={iconAnalitik} alt="Ikon Data Analitik" /></div>
              <div className="kp-card-text">
                <h4>Data Analitik</h4>
                <p>Alamat IP, log aktivitas, preferensi layanan.</p>
              </div>
            </div>
            <div className="kp-card">
              <div className="kp-icon"><img width="40" height="40" decoding="async" loading="lazy" src={iconKorporat} alt="Ikon Informasi Korporat" /></div>
              <div className="kp-card-text">
                <h4>Informasi Korporat</h4>
                <p>Nama Instansi, NPWP, Detail Proyek.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Keamanan Data */}
        <section id="keamanan-data" className="kp-section">
          <h2 className="kp-section-title">Protokol Keamanan Data</h2>
          
          <div className="kp-grid-3">
            <div className="kp-card">
              <div className="kp-icon"><img width="24" height="32" decoding="async" loading="lazy" src={iconSsl} alt="Ikon SSL Encryption" /></div>
              <h4>Secure Transport</h4>
              <p>Deployment production diwajibkan memakai HTTPS untuk melindungi data selama transmisi.</p>
            </div>
            <div className="kp-card">
              <div className="kp-icon"><img width="33" height="24" decoding="async" loading="lazy" src={iconCloud} alt="Ikon Cloud Storage" /></div>
              <h4>Cloud Storage</h4>
              <p>Penyimpanan, lokasi data, dan masa retensi mengikuti konfigurasi backend serta penyedia infrastruktur production.</p>
            </div>
            <div className="kp-card">
              <div className="kp-icon"><img width="28" height="30" decoding="async" loading="lazy" src={iconAuth} alt="Ikon Multi-Auth" /></div>
              <h4>Multi-Auth</h4>
              <p>Kontrol akses, autentikasi tambahan, dan pencatatan aktivitas diterapkan sesuai peran pengguna pada backend.</p>
            </div>
          </div>
        </section>

        {/* Section 4: Hak Pengguna */}
        <section id="hak-pengguna" className="kp-section">
          <h2 className="kp-section-title">Hak Pengguna</h2>
          <PrivacyRightsAccordion />
        </section>

        {/* Section 5: Hubungi Kami */}
        <section id="hubungi-kami" className="kp-section">
          <h2 className="kp-section-title">Hubungi Kami</h2>
          <div className="kp-card" style={{ maxWidth: '100%', padding: '32px' }}>
            <p className="kp-text">
              Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau praktik kami terkait informasi Anda, silakan
              hubungi tim Data Privacy Officer kami:
            </p>
            
            {/* Mengubah layout info kontak menjadi vertikal (kolom) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '32px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="kp-icon-contact"><img width="48" height="48" decoding="async" loading="lazy" src={iconEmail} alt="Ikon Email" /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', letterSpacing: '0.5px' }}>EMAIL</p>
                  <h4 style={{ margin: '4px 0 0 0', color: '#C8A97E', fontSize: '15px' }}>info@mahreenindonesia.com</h4>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div className="kp-icon-contact"><img width="48" height="48" decoding="async" loading="lazy" src={iconLokasi} alt="Ikon Lokasi" /></div>
                <div>
                  <p style={{ margin: 0, fontSize: '14px', color: '#666', letterSpacing: '0.5px' }}>ALAMAT OPERASIONAL</p>
                  <h4 style={{ margin: '4px 0 0 0', fontSize: '15px', color: '#fff' }}>Tersedia melalui kanal Contact resmi Mahreen Indonesia</h4>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default KontenPrivasi;
