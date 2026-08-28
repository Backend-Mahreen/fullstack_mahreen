// src/pages/SyaratKetentuan/sections/CTASyarat.tsx
import React from 'react';

const CTASyarat: React.FC = () => {
  return (
    <section className="sk-related-section">
      <h3>Kebijakan Terkait</h3>
      <div className="sk-grid-3">
        <div className="sk-related-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <h4>Kebijakan Privasi</h4>
          <p>Bagaimana kami menjaga dan mengolah data pribadi Anda secara aman.</p>
        </div>
        <div className="sk-related-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 00-1 19.95"/><path d="M12 22a10 10 0 001-19.95"/></svg>
          <h4>Kebijakan Cookie</h4>
          <p>Informasi mengenai penggunaan pelacak digital di ekosistem kami.</p>
        </div>
        <div className="sk-related-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
          <h4>Refund Policy</h4>
          <p>Prosedur dan syarat pengembalian dana untuk layanan berbayar.</p>
        </div>
      </div>
    </section>
  );
};

export default CTASyarat;