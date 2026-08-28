import React, { useEffect, useRef, useState } from 'react';

// Import gambar tailoring asli dari folder GambarProduk
import tailoringProcessImg from '../../../../assets/Mahreen-Studio/GambarProduk/tailoring_process.webp';

const creativeStyles = `
  .creative-section {
    width: 100%;
    background: #000000;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
    padding: 70px clamp(18px, 3vw, 36px);
    overflow: hidden;
  }

  .creative-section * {
    box-sizing: border-box;
  }

  .creative-inner {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
    gap: clamp(42px, 6vw, 72px);
    align-items: center;
  }

  .creative-content,
  .creative-image-box {
    opacity: 0;
    transform: translateY(22px);
    will-change: opacity, transform;
  }

  .creative-section.is-visible .creative-content {
    animation: creativeFadeUp 720ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .creative-section.is-visible .creative-image-box {
    animation: creativeFadeUp 720ms cubic-bezier(0.16, 1, 0.3, 1) 120ms forwards;
  }

  @keyframes creativeFadeUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .creative-tag {
    display: inline-block;
    margin-bottom: 18px;
    color: #d8aa66;
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 3px;
    text-transform: uppercase;
  }

  .creative-title {
    max-width: 560px;
    margin: 0 0 22px;
    color: #f2f2f2;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: clamp(38px, 4.2vw, 58px);
    font-weight: 600;
    line-height: 0.98;
    letter-spacing: -1.2px;
  }

  .creative-desc {
    max-width: 560px;
    margin: 0 0 36px;
    color: rgba(255, 255, 255, 0.58);
    font-size: clamp(15px, 1.25vw, 18px);
    font-weight: 400;
    line-height: 1.7;
  }

  .creative-stats {
    display: flex;
    align-items: flex-start;
    gap: clamp(46px, 7vw, 74px);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 9px;
  }

  .stat-number {
    color: #f4f4f4;
    font-family: 'Playfair Display', Georgia, serif;
    font-size: 17px;
    font-weight: 500;
    line-height: 1;
  }

  .stat-label {
    color: rgba(255, 255, 255, 0.34);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: 0.7px;
    text-transform: uppercase;
  }

  .creative-image-box {
    position: relative;
    width: 100%;
    min-height: 320px;
    aspect-ratio: 1.7 / 1;
    border: 1px solid rgba(216, 170, 102, 0.2);
    background: #090909;
    overflow: hidden;
  }

  .creative-image-box::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.2), transparent 36%, rgba(0, 0, 0, 0.08));
  }

  .creative-image-box img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transform: scale(1.015);
  }

  @media (max-width: 900px) {
    .creative-section {
      padding: 58px 20px;
    }

    .creative-inner {
      grid-template-columns: 1fr;
      gap: 34px;
    }

    .creative-title,
    .creative-desc {
      max-width: 100%;
    }

    .creative-image-box {
      min-height: 260px;
    }
  }

  @media (max-width: 520px) {
    .creative-section {
      padding: 48px 16px;
    }

    .creative-title {
      font-size: 34px;
      line-height: 1.05;
    }

    .creative-desc {
      font-size: 15px;
      line-height: 1.65;
    }

    .creative-stats {
      gap: 34px;
    }

    .creative-image-box {
      min-height: 210px;
      aspect-ratio: 1.25 / 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .creative-content,
    .creative-image-box {
      opacity: 1;
      transform: none;
      will-change: auto;
      animation: none !important;
    }
  }
`;

const Creative_process: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style data-component="creative-process">{creativeStyles}</style>
      <section
        ref={sectionRef}
        className={`creative-section${isVisible ? ' is-visible' : ''}`}
      >
        <div className="creative-inner">
          <div className="creative-content">
            <span className="creative-tag">Our Creative Process</span>
            <h2 className="creative-title">Designed with Architectural Precision</h2>
            <p className="creative-desc">
              At Mahreen Studio, every seam is a statement. Our design process begins with a study of movement and silhouette, blending the structural integrity of brutalist architecture with the soft touch of luxury textiles.
            </p>

            <div className="creative-stats">
              <div className="stat-item">
                <span className="stat-number">18</span>
                <span className="stat-label">Months R&amp;D</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Threads per cm</span>
              </div>
            </div>
          </div>

          <div className="creative-image-box" aria-label="Mahreen Studio creative process">
            <img src={tailoringProcessImg} alt="Mahreen Studio creative process" loading="lazy" decoding="async" width="1001" height="542" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Creative_process;
