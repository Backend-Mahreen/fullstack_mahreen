import React, { useEffect, useRef, useState } from 'react';

// Import gambar packaging asli dari folder GambarProduk
import premiumPackagingImg from '../../../../assets/Mahreen-Studio/GambarProduk/Premium_Packaging.webp';

const experienceStyles = `
  .exp-section {
    width: 100%;
    background: #050505;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    padding: 0 clamp(16px, 4vw, 32px);
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    overflow: hidden;
  }

  .exp-section * {
    box-sizing: border-box;
  }

  .exp-panel {
    max-width: 1020px;
    margin: 0 auto;
    padding: clamp(56px, 7vw, 72px) clamp(22px, 6vw, 70px);
    background: #171a18;
    min-height: 455px;
    display: grid;
    grid-template-columns: minmax(260px, 315px) minmax(280px, 1fr);
    align-items: center;
    gap: clamp(46px, 7vw, 72px);
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 700ms ease, transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
    content-visibility: auto;
    contain-intrinsic-size: 455px;
  }

  .exp-section.is-visible .exp-panel {
    opacity: 1;
    transform: translateY(0);
  }

  .exp-image-box {
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #111;
    overflow: hidden;
    box-shadow: 0 22px 42px rgba(0, 0, 0, 0.35);
    opacity: 0;
    transform: translateX(-22px);
    transition: opacity 700ms ease 120ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 120ms;
  }

  .exp-section.is-visible .exp-image-box {
    opacity: 1;
    transform: translateX(0);
  }

  .exp-image-box img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .exp-content {
    max-width: 390px;
    opacity: 0;
    transform: translateX(22px);
    transition: opacity 700ms ease 220ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 220ms;
  }

  .exp-section.is-visible .exp-content {
    opacity: 1;
    transform: translateX(0);
  }

  .exp-tag {
    display: inline-block;
    margin-bottom: 14px;
    color: #d6a35c;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 2px;
    line-height: 1;
    text-transform: uppercase;
  }

  .exp-title {
    margin: 0 0 18px;
    color: #f5f2ec;
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 3.2vw, 34px);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.02em;
  }

  .exp-desc {
    margin: 0 0 22px;
    color: rgba(255, 255, 255, 0.48);
    font-size: 14px;
    line-height: 1.78;
  }

  .exp-checklist {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .exp-check-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.76);
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 1.7px;
    line-height: 1.4;
    text-transform: uppercase;
  }

  .exp-check-icon {
    width: 9px;
    height: 9px;
    flex: 0 0 9px;
    border: 1px solid #d6a35c;
    border-radius: 50%;
    position: relative;
  }

  .exp-check-icon::after {
    content: '';
    position: absolute;
    left: 2px;
    top: 1px;
    width: 3px;
    height: 5px;
    border-right: 1px solid #d6a35c;
    border-bottom: 1px solid #d6a35c;
    transform: rotate(42deg);
  }

  @media (max-width: 820px) {
    .exp-panel {
      grid-template-columns: 1fr;
      gap: 34px;
      max-width: 620px;
      min-height: auto;
    }

    .exp-image-box {
      max-width: 360px;
    }

    .exp-content {
      max-width: 100%;
    }
  }

  @media (max-width: 480px) {
    .exp-section {
      padding-inline: 0;
    }

    .exp-panel {
      padding: 42px 18px;
    }

    .exp-title {
      font-size: 28px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .exp-panel,
    .exp-image-box,
    .exp-content {
      opacity: 1;
      transform: none;
      transition: none;
    }
  }
`;

const Experience: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -80px 0px',
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style data-component="experience">{experienceStyles}</style>
      <section
        ref={sectionRef}
        className={`exp-section${isVisible ? ' is-visible' : ''}`}
        aria-labelledby="experience-title"
      >
        <div className="exp-panel">
          <div className="exp-image-box">
            <img
              src={premiumPackagingImg}
              alt="Premium Mahreen Studio packaging box"
              loading="lazy"
              decoding="async"
              width="811"
              height="802"
            />
          </div>

          <div className="exp-content">
            <span className="exp-tag">The Experience</span>
            <h2 className="exp-title" id="experience-title">Unboxing Elegance</h2>
            <p className="exp-desc">
              Every Signature Hoodie arrives in our custom-designed, FSC-certified matte black presentation box.
              Secured with a magnetic closure and lined with acid-free charcoal silk paper, the unboxing experience
              is designed to be as memorable as the garment itself.
            </p>

            <ul className="exp-checklist">
              <li className="exp-check-item">
                <span className="exp-check-icon" aria-hidden="true"></span>
                Matte Gold Foil Branding
              </li>
              <li className="exp-check-item">
                <span className="exp-check-icon" aria-hidden="true"></span>
                Signature Velvet Protective Bag
              </li>
              <li className="exp-check-item">
                <span className="exp-check-icon" aria-hidden="true"></span>
                Certificate of Authenticity
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Experience;
