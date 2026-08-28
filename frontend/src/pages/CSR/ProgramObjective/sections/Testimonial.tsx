const testimonialStyles = `
  .po-testimonial {
    width: 100%;
    background: #1C1B1B;
    padding: 80px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .po-testimonial__container {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }

  .po-testimonial__quote-icon {
    font-family: 'Playfair Display', serif;
    font-size: 80px;
    line-height: 0.5;
    color: #E5C483;
    margin-bottom: -10px;
  }

  .po-testimonial__text {
    font-family: 'Playfair Display', serif;
    font-weight: 500;
    font-size: clamp(20px, 3vw, 28px);
    line-height: 1.5;
    color: #E5E2E1;
    margin: 0;
  }

  .po-testimonial__author-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .po-testimonial__author-name {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #E5E2E1;
    margin: 0;
  }

  .po-testimonial__author-title {
    font-family: 'Manrope', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: #C8A96A;
    margin: 0;
  }

  .po-testimonial__dots {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .po-testimonial__dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: background 0.3s ease;
  }

  .po-testimonial__dot--active {
    background: #C8A96A;
  }
    
  @media (max-width: 768px) {
    .po-testimonial {
      padding: 60px 24px;
    }
  }
`;

const Testimonial = () => {
  return (
    <section className="po-testimonial">
      <style>{testimonialStyles}</style>
      <div className="po-testimonial__container">
        <div className="po-testimonial__quote-icon">”</div>
        <p className="po-testimonial__text">
          "Mahreen CSR bukan sekadar memberi bantuan, mereka memberikan martabat. Melalui kolektif ini, kami tidak lagi hanya menjadi buruh, melainkan pemilik masa depan kami sendiri."
        </p>
        <div className="po-testimonial__author-box">
          <p className="po-testimonial__author-name">Siti Aminah</p>
          <p className="po-testimonial__author-title">KETUA KOLEKTIF PENGRAJIN SAMUDRA</p>
        </div>
        <div className="po-testimonial__dots">
          <div className="po-testimonial__dot po-testimonial__dot--active"></div>
          <div className="po-testimonial__dot"></div>
          <div className="po-testimonial__dot"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
