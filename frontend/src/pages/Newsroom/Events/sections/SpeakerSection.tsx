import React from 'react';
import useNewsroomDatabase from '../../../../hooks/useNewsroomDatabase';
import { handleNewsroomImageError } from "../../utils/newsroomImageFallback";

const SpeakerSection: React.FC = () => {
  const { speakers } = useNewsroomDatabase();

  return (
    <section className="speaker-section newsroom-content-section">
      <h3 className="speaker-section-title tag-title-serif" data-newsroom-reveal>Pembicara Utama</h3>
      <div className="speakers-grid">
        {speakers.map((spk, idx) => (
          <div
            className="speaker-card"
            key={spk.name}
            data-newsroom-reveal
            style={{ transitionDelay: `${100 + idx * 75}ms` }}
          >
            <div className="speaker-img-wrapper">
              <img
                decoding="async"
                loading="lazy"
                src={spk.image}
                alt={spk.name}
                onError={handleNewsroomImageError}
              />
            </div>
            <h4>{spk.name}</h4>
            <p className="speaker-role">{spk.role}</p>
            <span className="speaker-desc">{spk.description}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpeakerSection;
