import React from 'react';

const CTAPrivasi: React.FC = () => {
  return (
    <section className="kp-cta-section">
      <div className="kp-cta-box">
        <h2>Masih Memiliki Pertanyaan?</h2>
        <p>
          Tim hukum kami siap membantu Anda memahami lebih lanjut mengenai hak-hak Anda dan 
          komitmen perlindungan data kami.
        </p>
        <div className="kp-btn-group">
          <a className="kp-btn-primary" href="/contact">Hubungi Kami Sekarang</a>
          <a className="kp-btn-outline" href="/syarat-ketentuan">Lihat Syarat & Ketentuan</a>
        </div>
      </div>
    </section>
  );
};

export default CTAPrivasi;