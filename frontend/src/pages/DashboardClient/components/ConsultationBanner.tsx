import iconConsultation from "../../../assets/TanyaMahreen/Home/icon-consultation.png";


const tags = ["Business", "Brand", "Marketing", "Personal"];

const ConsultationBanner = () => (
  <>
<section
      className="client-dashboard__consultation dashboard-card"
      data-dashboard-reveal
      data-dashboard-step="3"
      aria-labelledby="client-consultation-title"
    >
      <div className="client-dashboard__consultation-left">
        <div className="client-dashboard__consultation-icon" aria-hidden="true">
          <img width="401" height="482" decoding="async" loading="lazy" src={iconConsultation} alt="" />
        </div>

        <div className="client-dashboard__consultation-content">
          <div className="client-dashboard__consultation-title-row">
            <h2 className="client-dashboard__consultation-title" id="client-consultation-title">
              Business Consultation
            </h2>
            <span className="client-dashboard__consultation-price">Rp300K / Session</span>
          </div>

          <p className="client-dashboard__consultation-subtitle">
            Expert guidance for digital transformation, branding strategy, and personal branding excellence.
          </p>

          <div className="client-dashboard__consultation-tags" aria-label="Topik konsultasi">
            {tags.map((tag, index) => (
              <span
                className="client-dashboard__consultation-tag"
                key={tag}
                style={{ "--tag-index": index } as React.CSSProperties}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <a className="client-dashboard__consultation-button" href="/tanya-mahreen/konsultasi">
        Book Now
      </a>
    </section>
  </>
);

export default ConsultationBanner;
