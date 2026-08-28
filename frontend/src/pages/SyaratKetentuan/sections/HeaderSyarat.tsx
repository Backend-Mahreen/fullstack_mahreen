// src/pages/SyaratKetentuan/sections/HeaderSyarat.tsx
import React from 'react';

const HeaderSyarat: React.FC = () => {
  return (
    <section className="sk-header">
      <div className="sk-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        Terakhir Diperbarui: 15 Mei 2024
      </div>
      <h1 className="sk-title">Syarat & Ketentuan</h1>
      <p className="sk-subtitle">
        Dengan menggunakan website dan layanan Mahreen Indonesia, Anda dianggap telah membaca, memahami, 
        dan menyetujui seluruh syarat dan ketentuan yang berlaku.
      </p>
    </section>
  );
};

export default HeaderSyarat;